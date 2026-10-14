import express from "express";
import { google } from "googleapis";
import { getAuthUrl, getOAuth2Client, getRedirectUri, GOOGLE_CLIENT_ID } from "../config/google.js";
import { YouTubeService } from "../services/youtubeService.js";
import { db } from "../db/store.js";
import { getCategoryName } from "../utils/youtubeCategories.js";

const router = express.Router();

// Bộ nhớ đệm tạm chống duplicate callback request từ trình duyệt
const processedCodes = new Set();

/**
 * 1. LẤY ĐƯỜNG DẪN ĐĂNG NHẬP GOOGLE OAUTH 2.0
 */
router.get("/google/url", (req, res) => {
  try {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID.includes("your_google")
    ) {
      return res.status(400).json({
        error: "Chưa cấu hình GOOGLE_CLIENT_ID. Vui lòng thêm GOOGLE_CLIENT_ID trong Hugging Face Space Settings (Variables and secrets) hoặc file .env của backend.",
      });
    }
    const redirectUri = getRedirectUri(req);
    const url = getAuthUrl(redirectUri);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. GOOGLE OAUTH CALLBACK (XỬ LÝ ĐỒNG BỘ VIDEO TỨC THÌ & CHỐNG DUPLICATE)
 */
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.get("host");
  const currentOrigin = `${proto}://${host}`;
  const clientUrl =
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === "production" ? currentOrigin : "http://localhost:5173");

  if (!code) {
    return res.redirect(`${clientUrl}?error=missing_code`);
  }

  // Chống lỗi invalid_grant khi trình duyệt gửi duplicate request
  if (processedCodes.has(code)) {
    return res.redirect(`${clientUrl}`);
  }
  processedCodes.add(code);
  setTimeout(() => processedCodes.delete(code), 5 * 60 * 1000);

  try {
    const redirectUri = getRedirectUri(req);
    const client = getOAuth2Client(redirectUri);

    // 1. Đổi code lấy Tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // 2. Lấy thông tin kênh
    const channelInfo = await YouTubeService.fetchMyChannelInfo(client);

    // 3. ĐỒNG BỘ DANH SÁCH VIDEO NGAY TẠI ĐÂY (TRƯỚC KHI CHUYỂN HƯỚNG VỀ FRONTEND)
    let initialVideos = [];
    try {
      const youtube = google.youtube({ version: "v3", auth: client });
      if (channelInfo.uploadsPlaylistId) {
        const playlistRes = await youtube.playlistItems.list({
          part: ["snippet", "contentDetails"],
          playlistId: channelInfo.uploadsPlaylistId,
          maxResults: 50,
        });

        const videoIds =
          playlistRes.data.items?.map((it) => it.contentDetails.videoId) || [];
        if (videoIds.length > 0) {
          const videosRes = await youtube.videos.list({
            part: ["snippet", "statistics", "contentDetails", "status"],
            id: videoIds,
          });

          initialVideos =
            videosRes.data.items?.map((v) => {
              const durationIso = v.contentDetails.duration;
              const durationFormatted = formatDuration(durationIso);
              const isShorts =
                durationFormatted.includes("0:") ||
                (parseInt(v.contentDetails.duration.match(/\d+S/)?.[0] || "0") <
                  60 &&
                  !durationIso.includes("M"));
              const viewCount = parseInt(v.statistics.viewCount || "0");
              const privacy = v.status?.privacyStatus;
              const statusText = privacy === 'public'
                ? 'Công khai'
                : privacy === 'unlisted'
                  ? 'Không công khai'
                  : privacy === 'private'
                    ? 'Riêng tư'
                    : 'Công khai';

              return {
                id: v.id,
                title: v.snippet.title,
                type: isShorts ? "shorts" : "long",
                duration: durationFormatted,
                publishDate: new Date(v.snippet.publishedAt).toLocaleDateString(
                  "vi-VN",
                ),
                status: statusText,
                category: getCategoryName(v.snippet?.categoryId),
                thumb:
                  v.snippet.thumbnails?.maxres?.url ||
                  v.snippet.thumbnails?.high?.url ||
                  v.snippet.thumbnails?.default?.url,
                views: viewCount,
                impressions: null,
                ctr: null,
                retention: null,
                watchTimeHours: null,
                avgDurationSec: null,
                tags: v.snippet.tags || [],
                description: v.snippet.description || "",
                traffic: null,
                realtime48h: null,
              };
            }) || [];
        }
      }
    } catch (syncErr) {
      console.warn("Lỗi khi kéo video ban đầu:", syncErr.message);
    }

    // 4. Lấy dữ liệu YouTube Analytics thực tế (28 ngày qua & từng video)
    await YouTubeService.enrichVideosAndBenchmarksWithAnalytics(client, initialVideos, channelInfo.benchmarks);

    const activeVideos = initialVideos.filter((v) => v.views > 0);
    if (activeVideos.length > 0 && channelInfo.benchmarks) {
      const avgCtr = parseFloat(
        (
          activeVideos.reduce((a, b) => a + (b.ctr || 0), 0) /
          activeVideos.length
        ).toFixed(1),
      );
      channelInfo.benchmarks.avgCtr = avgCtr;
      channelInfo.benchmarks.targetCtr = avgCtr > 0 ? parseFloat((avgCtr + 1.0).toFixed(1)) : 0;

      if (!channelInfo.benchmarks.avgRetention || channelInfo.benchmarks.avgRetention === 0) {
        const vidsWithRet = activeVideos.filter(v => typeof v.retention === 'number' && v.retention > 0);
        if (vidsWithRet.length > 0) {
          const avgRetention = parseFloat((vidsWithRet.reduce((a, b) => a + b.retention, 0) / vidsWithRet.length).toFixed(1));
          channelInfo.benchmarks.avgRetention = avgRetention;
          channelInfo.benchmarks.targetRetention = parseFloat((avgRetention + 5.0).toFixed(1));
        }
      }

      if (!channelInfo.benchmarks.views28d || channelInfo.benchmarks.views28d === "0") {
        const totalViews = initialVideos.reduce((a, b) => a + (b.views || 0), 0);
        channelInfo.benchmarks.views28d = totalViews.toLocaleString();
      }
    }

    // 5. Lưu Kênh kèm Toàn bộ Video vào DB
    const saved = await db.saveChannel({
      ...channelInfo,
      videos: initialVideos,
      tokens: {
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token,
      },
    });

    // 5. Chuyển hướng kèm channelId để Frontend tự động chọn và hiển thị ngay
    res.redirect(
      `${clientUrl}?channel_connected=${encodeURIComponent(channelInfo.name)}&selected_id=${saved.id || channelInfo.channelId}`,
    );
  } catch (error) {
    console.error("Lỗi Google OAuth Callback:", error);
    res.redirect(
      `${clientUrl}?error=${encodeURIComponent(error.message || "oauth_failed")}`,
    );
  }
});

function formatDuration(iso) {
  if (!iso) return "00:00";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";
  const hours = match[1] ? `${match[1]}:` : "";
  const minutes = match[2]
    ? match[1]
      ? match[2].padStart(2, "0")
      : match[2]
    : "0";
  const seconds = match[3] ? match[3].padStart(2, "0") : "00";
  return `${hours}${minutes}:${seconds}`;
}

export default router;
