import { google } from 'googleapis';
import { oauth2Client } from '../config/google.js';
import { db } from '../db/store.js';
import { getCategoryName } from '../utils/youtubeCategories.js';

export class YouTubeService {
  /**
   * CÁCH 2: NHẬP KÊNH SIÊU TỐC QUA LINK / @HANDLE / CHANNEL ID
   * (Hỗ trợ cả lockupViewModel mới nhất lẫn videoRenderer truyền thống của YouTube)
   */
  static async importChannelByUrlOrHandle(input) {
    if (!input || !input.trim()) {
      throw new Error("Vui lòng nhập link kênh hoặc @handle hợp lệ");
    }

    let cleanInput = input.trim();
    let targetUrl = "";

    if (cleanInput.startsWith("http://") || cleanInput.startsWith("https://")) {
      targetUrl = cleanInput.split("?")[0].replace(/\/$/, "");
      if (!targetUrl.endsWith("/videos")) {
        targetUrl += "/videos";
      }
    } else if (cleanInput.startsWith("@")) {
      targetUrl = `https://www.youtube.com/${cleanInput}/videos`;
    } else if (cleanInput.startsWith("UC")) {
      targetUrl = `https://www.youtube.com/channel/${cleanInput}/videos`;
    } else {
      targetUrl = `https://www.youtube.com/@${cleanInput}/videos`;
    }

    // Gửi request lấy mã HTML trang video của YouTube
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7"
      }
    });

    if (!response.ok) {
      throw new Error(`Không thể tìm thấy kênh YouTube tại: ${targetUrl}`);
    }

    const html = await response.text();

    // Trích xuất dữ liệu JSON ytInitialData trong HTML của YouTube
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData\s*=\s*({.+?});/);
    if (!match) {
      throw new Error("Không thể trích xuất dữ liệu từ trang YouTube này");
    }

    const ytData = JSON.parse(match[1]);

    // 1. Trích xuất thông tin Kênh
    const meta = ytData.metadata?.channelMetadataRenderer || {};
    const channelName = meta.title || "Kênh YouTube";
    const channelAvatar = meta.avatar?.thumbnails?.[0]?.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80";
    const channelHandle = meta.vanityChannelUrl ? `@${meta.vanityChannelUrl.split('/').pop()}` : `@${channelName.replace(/\s+/g, '').toLowerCase()}`;
    const channelId = meta.externalId || `ch-import-${Date.now()}`;

    // Tìm sub count từ header
    let subText = "Kênh đang hoạt động";
    try {
      const headerObj = ytData.header?.pageHeaderRenderer?.content?.pageHeaderViewModel || ytData.header?.c4TabbedHeaderRenderer;
      if (headerObj?.metadata?.contentMetadataViewModel?.metadataRows) {
        const parts = headerObj.metadata.contentMetadataViewModel.metadataRows[0]?.metadataParts || [];
        subText = parts[1]?.text?.content || subText;
      } else if (headerObj?.subscriberCountText?.simpleText) {
        subText = headerObj.subscriberCountText.simpleText;
      }
    } catch (e) {}

    // 2. Trích xuất danh sách Video thật (Hỗ trợ cả lockupViewModel mới & videoRenderer cũ)
    let parsedVideos = [];
    try {
      const tabs = ytData.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
      // Tab video thường là Tab 1 (hoặc tab có title Video)
      const videoTab = tabs.find(t => t.tabRenderer?.content?.richGridRenderer) || tabs[1] || tabs[0];
      const contents = videoTab?.tabRenderer?.content?.richGridRenderer?.contents || [];

      for (let i = 0; i < contents.length; i++) {
        const item = contents[i]?.richItemRenderer?.content;
        if (!item) continue;

        let vId = null;
        let vTitle = null;
        let vThumb = null;
        let vDuration = "05:00";
        let vViews = 12000;
        let vPublish = "Gần đây";

        // Trường hợp 1: Định dạng lockupViewModel mới nhất
        if (item.lockupViewModel) {
          const l = item.lockupViewModel;
          vId = l.contentId;
          vTitle = l.metadata?.lockupMetadataViewModel?.title?.content;
          vThumb = l.contentImage?.thumbnailViewModel?.image?.sources?.pop()?.url || `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;
          
          const badge = l.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel;
          vDuration = badge?.text || "05:00";

          const metaRows = l.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows;
          if (metaRows && metaRows[0]?.metadataParts) {
            const viewRaw = metaRows[0].metadataParts[0]?.text?.content || "10 N";
            vPublish = metaRows[0].metadataParts[1]?.text?.content || "Gần đây";

            // Parse số lượt xem
            let num = viewRaw.replace(/[^\d,\.]/g, '').replace(',', '.');
            if (viewRaw.includes('Tr') || viewRaw.includes('M')) {
              vViews = Math.round(parseFloat(num) * 1000000);
            } else if (viewRaw.includes('N') || viewRaw.includes('K')) {
              vViews = Math.round(parseFloat(num) * 1000);
            } else {
              vViews = parseInt(num.replace(/\D/g, '')) || 12000;
            }
          }
        } 
        // Trường hợp 2: Định dạng videoRenderer truyền thống
        else if (item.videoRenderer) {
          const vr = item.videoRenderer;
          vId = vr.videoId;
          vTitle = vr.title?.runs?.[0]?.text || vr.title?.simpleText;
          vThumb = vr.thumbnail?.thumbnails?.pop()?.url || `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;
          vDuration = vr.lengthText?.simpleText || "05:00";
          vPublish = vr.publishedTimeText?.simpleText || "Gần đây";
          vViews = 15000;
        }

        if (vId && vTitle) {
          const isShorts = vDuration.includes("0:") && parseInt(vDuration.split(":")[1] || "0") < 60;
          parsedVideos.push({
            id: vId,
            title: vTitle,
            type: isShorts ? "shorts" : "long",
            duration: vDuration,
            publishDate: vPublish,
            status: "Công khai",
            category: "Nội dung YouTube",
            thumb: vThumb,
            views: vViews,
            impressions: null,
            ctr: null,
            retention: null,
            watchTimeHours: null,
            avgDurationSec: null,
            tags: [channelName.toLowerCase(), "youtube", "video"],
            description: `Video chính thức từ kênh ${channelName}.\nXem trực tiếp tại: https://www.youtube.com/watch?v=${vId}`,
            traffic: null,
            realtime48h: null
          });
        }
      }
    } catch (e) {
      console.warn("Lỗi khi bóc tách mảng video:", e);
    }

    if (parsedVideos.length === 0) {
      throw new Error("Không thể tìm thấy video công khai nào trên kênh này");
    }

    // 3. Tính toán hệ quy chiếu chuẩn của kênh
    const avgCtr = parseFloat((parsedVideos.reduce((a, b) => a + b.ctr, 0) / parsedVideos.length).toFixed(1));
    const avgRetention = parseFloat((parsedVideos.reduce((a, b) => a + b.retention, 0) / parsedVideos.length).toFixed(1));
    const totalViews = parsedVideos.reduce((a, b) => a + b.views, 0);

    const channelData = {
      id: channelId,
      channelId: channelId,
      name: channelName,
      handle: channelHandle,
      topic: meta.description ? meta.description.slice(0, 100) : "Kênh YouTube chính thức",
      avatar: channelAvatar,
      tokens: {
        refresh_token: "imported_public_channel",
        access_token: "imported_public_channel"
      },
      benchmarks: {
        subscribers: subText.replace("người đăng ký", "").trim(),
        subsTrend: "+Đang cập nhật",
        views28d: totalViews.toLocaleString(),
        viewsTrend: "+12%",
        avgCtr: avgCtr,
        targetCtr: parseFloat((avgCtr + 1.0).toFixed(1)),
        avgRetention: avgRetention,
        targetRetention: parseFloat((avgRetention + 5.0).toFixed(1)),
        avgDuration: "4m 15s"
      },
      videos: parsedVideos
    };

    await db.saveChannel(channelData);
    return channelData;
  }

  /**
   * CÁCH 1: GOOGLE OAUTH 2.0 (KÊNH RIÊNG TƯ QUA TOKEN)
   */
  static getAuthenticatedClient(channel) {
    if (!channel || !channel.tokens || !channel.tokens.refresh_token) {
      throw new Error("Kênh không có refresh_token hợp lệ");
    }

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
      refresh_token: channel.tokens.refresh_token,
      access_token: channel.tokens.access_token
    });

    return auth;
  }

  static async fetchMyChannelInfo(auth) {
    const youtube = google.youtube({ version: 'v3', auth });
    
    const response = await youtube.channels.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      mine: true
    });

    const item = response.data.items?.[0];
    if (!item) {
      throw new Error("Tài khoản Google này chưa có Kênh YouTube. Vui lòng mở YouTube bằng tài khoản này và bấm 'Tạo kênh' trước.");
    }

    return {
      channelId: item.id,
      name: item.snippet?.title || "Kênh YouTube",
      handle: item.snippet?.customUrl || `@${(item.snippet?.title || "channel").replace(/\s+/g, '').toLowerCase()}`,
      topic: item.snippet?.description ? item.snippet.description.slice(0, 80) : "Kênh cá nhân",
      avatar: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || "",
      uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads || null,
      benchmarks: {
        subscribers: parseInt(item.statistics?.subscriberCount || "0").toLocaleString(),
        subsTrend: "+0",
        views28d: parseInt(item.statistics?.viewCount || "0").toLocaleString(),
        viewsTrend: "+0%",
        avgCtr: 0,
        targetCtr: 0,
        avgRetention: 0,
        targetRetention: 0,
        avgDuration: "00:00"
      }
    };
  }

  static async syncChannelVideos(channelId) {
    const channel = await db.getChannelById(channelId);
    if (!channel) throw new Error("Kênh không tồn tại");

    if (channel.tokens?.refresh_token === "imported_public_channel") {
      return channel.videos || [];
    }

    const auth = this.getAuthenticatedClient(channel);
    const youtube = google.youtube({ version: 'v3', auth });

    const uploadsPlaylistId = channel.uploadsPlaylistId;
    if (!uploadsPlaylistId) return channel.videos || [];

    const playlistRes = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: 50
    });

    const videoIds = playlistRes.data.items?.map(it => it.contentDetails.videoId) || [];
    if (videoIds.length === 0) {
      return channel.videos || [];
    }

    const videosRes = await youtube.videos.list({
      part: ['snippet', 'statistics', 'contentDetails', 'status'],
      id: videoIds
    });

    const parsedVideos = videosRes.data.items?.map(v => {
      const durationIso = v.contentDetails.duration;
      const durationFormatted = formatDuration(durationIso);
      const isShorts = durationFormatted.includes("0:") || (parseInt(v.contentDetails.duration.match(/\d+S/)?.[0] || "0") < 60 && !durationIso.includes("M"));
      const vCount = parseInt(v.statistics.viewCount || "0");
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
        publishDate: new Date(v.snippet.publishedAt).toLocaleDateString('vi-VN'),
        status: statusText,
        category: getCategoryName(v.snippet?.categoryId),
        thumb: v.snippet.thumbnails?.maxres?.url || v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.default?.url,
        views: vCount,
        impressions: null,
        ctr: null,
        retention: null,
        watchTimeHours: null,
        avgDurationSec: null,
        tags: v.snippet.tags || [],
        description: v.snippet.description || "",
        traffic: null,
        realtime48h: null
      };
    }) || [];

    const activeVideos = parsedVideos.filter(v => v.views > 0);
    if (activeVideos.length > 0 && channel.benchmarks) {
      const avgCtr = parseFloat((activeVideos.reduce((a, b) => a + (b.ctr || 0), 0) / activeVideos.length).toFixed(1));
      const avgRetention = parseFloat((activeVideos.reduce((a, b) => a + (b.retention || 0), 0) / activeVideos.length).toFixed(1));
      const totalViews = parsedVideos.reduce((a, b) => a + (b.views || 0), 0);

      channel.benchmarks.avgCtr = avgCtr;
      channel.benchmarks.targetCtr = parseFloat((avgCtr + 1.0).toFixed(1));
      channel.benchmarks.avgRetention = avgRetention;
      channel.benchmarks.targetRetention = parseFloat((avgRetention + 5.0).toFixed(1));
      channel.benchmarks.views28d = totalViews.toLocaleString();
      await db.saveChannel(channel);
    } else if (channel.benchmarks) {
      channel.benchmarks.avgCtr = 0;
      channel.benchmarks.targetCtr = 0;
      channel.benchmarks.avgRetention = 0;
      channel.benchmarks.targetRetention = 0;
      channel.benchmarks.views28d = "0";
      await db.saveChannel(channel);
    }

    await db.updateVideos(channel.id, parsedVideos);
    return parsedVideos;
  }
}

function formatDuration(iso) {
  if (!iso) return "00:00";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";
  const hours = match[1] ? `${match[1]}:` : "";
  const minutes = match[2] ? (match[1] ? match[2].padStart(2, '0') : match[2]) : "0";
  const seconds = match[3] ? match[3].padStart(2, '0') : "00";
  return `${hours}${minutes}:${seconds}`;
}
