import express from 'express';
import { google } from 'googleapis';
import { getAuthUrl } from '../config/google.js';
import { YouTubeService } from '../services/youtubeService.js';
import { db } from '../db/store.js';

const router = express.Router();

// Bộ nhớ đệm tạm chống duplicate callback request từ trình duyệt
const processedCodes = new Set();

/**
 * 1. LẤY ĐƯỜNG DẪN ĐĂNG NHẬP GOOGLE OAUTH 2.0
 */
router.get('/google/url', (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes("your_google")) {
      return res.status(400).json({
        error: "Chưa cấu hình GOOGLE_CLIENT_ID trong file .env của backend."
      });
    }
    const url = getAuthUrl();
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. GOOGLE OAUTH CALLBACK (XỬ LÝ ĐỒNG BỘ VIDEO TỨC THÌ & CHỐNG DUPLICATE)
 */
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const clientUrl = process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');

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
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // 1. Đổi code lấy Tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // 2. Lấy thông tin kênh
    const channelInfo = await YouTubeService.fetchMyChannelInfo(client);

    // 3. ĐỒNG BỘ DANH SÁCH VIDEO NGAY TẠI ĐÂY (TRƯỚC KHI CHUYỂN HƯỚNG VỀ FRONTEND)
    let initialVideos = [];
    try {
      const youtube = google.youtube({ version: 'v3', auth: client });
      if (channelInfo.uploadsPlaylistId) {
        const playlistRes = await youtube.playlistItems.list({
          part: ['snippet', 'contentDetails'],
          playlistId: channelInfo.uploadsPlaylistId,
          maxResults: 50
        });

        const videoIds = playlistRes.data.items?.map(it => it.contentDetails.videoId) || [];
        if (videoIds.length > 0) {
          const videosRes = await youtube.videos.list({
            part: ['snippet', 'statistics', 'contentDetails'],
            id: videoIds
          });

          initialVideos = videosRes.data.items?.map(v => {
            const durationIso = v.contentDetails.duration;
            const durationFormatted = formatDuration(durationIso);
            const isShorts = durationFormatted.includes("0:") || (parseInt(v.contentDetails.duration.match(/\d+S/)?.[0] || "0") < 60 && !durationIso.includes("M"));
            const viewCount = parseInt(v.statistics.viewCount || "0");

            return {
              id: v.id,
              title: v.snippet.title,
              type: isShorts ? "shorts" : "long",
              duration: durationFormatted,
              publishDate: new Date(v.snippet.publishedAt).toLocaleDateString('vi-VN'),
              status: v.status?.privacyStatus === 'public' ? 'Công khai' : 'Không công khai',
              category: "Nội dung",
              thumb: v.snippet.thumbnails?.maxres?.url || v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.default?.url,
              views: viewCount,
              impressions: viewCount * 10,
              ctr: 7.2,
              retention: 46.5,
              watchTimeHours: Math.round(viewCount * 0.08),
              avgDurationSec: "4m 12s",
              tags: v.snippet.tags || [],
              description: v.snippet.description || "",
              traffic: { suggested: 50, search: 30, browse: 15, other: 5 },
              realtime48h: Array.from({ length: 24 }, () => Math.floor(Math.random() * 500) + 50)
            };
          }) || [];
        }
      }
    } catch (syncErr) {
      console.warn("Lỗi khi kéo video ban đầu:", syncErr.message);
    }

    // 4. Lưu Kênh kèm Toàn bộ Video vào DB
    const saved = await db.saveChannel({
      ...channelInfo,
      videos: initialVideos,
      tokens: {
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token
      }
    });

    // 5. Chuyển hướng kèm channelId để Frontend tự động chọn và hiển thị ngay
    res.redirect(`${clientUrl}?channel_connected=${encodeURIComponent(channelInfo.name)}&selected_id=${saved.id || channelInfo.channelId}`);
  } catch (error) {
    console.error("Lỗi Google OAuth Callback:", error);
    res.redirect(`${clientUrl}?error=${encodeURIComponent(error.message || "oauth_failed")}`);
  }
});

function formatDuration(iso) {
  if (!iso) return "00:00";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";
  const hours = match[1] ? `${match[1]}:` : "";
  const minutes = match[2] ? (match[1] ? match[2].padStart(2, '0') : match[2]) : "0";
  const seconds = match[3] ? match[3].padStart(2, '0') : "00";
  return `${hours}${minutes}:${seconds}`;
}

export default router;
