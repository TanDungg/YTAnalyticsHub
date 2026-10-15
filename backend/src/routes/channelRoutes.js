import express from 'express';
import { db } from '../db/store.js';
import { YouTubeService } from '../services/youtubeService.js';

const router = express.Router();

/**
 * 1. LẤY TẤT CẢ KÊNH ĐANG KẾT NỐI
 */
router.get('/', async (req, res) => {
  try {
    const rawChannels = await db.getChannels();
    const cutoff28d = Date.now() - 28 * 24 * 60 * 60 * 1000;
    const channels = (rawChannels || []).map(c => {
      const { tokens, ...safeChannel } = c;
      if (safeChannel.benchmarks && safeChannel.videos && safeChannel.videos.length > 0) {
        const storedViews = parseInt((safeChannel.benchmarks.views28d || "0").toString().replace(/,/g, ''), 10) || 0;
        const recentViews = safeChannel.videos.filter(v => {
          let t = 0;
          if (v.publishedAt) t = new Date(v.publishedAt).getTime();
          else if (v.publishDate) {
            const parts = v.publishDate.split('/');
            if (parts.length === 3) t = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime();
            else t = new Date(v.publishDate).getTime();
          }
          return !isNaN(t) && t >= cutoff28d;
        }).reduce((sum, v) => sum + (v.views || 0), 0);

        const totalAll = safeChannel.videos.reduce((sum, v) => sum + (v.views || 0), 0);
        const baseline = recentViews > 0 ? recentViews : (safeChannel.videos.length <= 10 ? totalAll : 0);
        if (baseline > storedViews) {
          safeChannel.benchmarks.views28d = baseline.toLocaleString();
        }
      }
      return safeChannel;
    });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. CÁCH 2: NHẬP KÊNH SIÊU TỐC BẰNG LINK / @HANDLE (KHÔNG CẦN GOOGLE LOGIN)
 */
router.post('/import', async (req, res) => {
  try {
    const { urlOrHandle } = req.body;
    if (!urlOrHandle) {
      return res.status(400).json({ error: "Vui lòng cung cấp link kênh hoặc @handle" });
    }

    const channel = await YouTubeService.importChannelByUrlOrHandle(urlOrHandle);
    const { tokens, ...safeChannel } = channel;
    res.json({ message: "Nhập kênh thành công", channel: safeChannel });
  } catch (error) {
    console.error("Lỗi khi nhập kênh qua URL:", error);
    res.status(500).json({ error: error.message || "Không thể quét kênh này" });
  }
});

/**
 * 3. LẤY CHI TIẾT 1 KÊNH
 */
router.get('/:id', async (req, res) => {
  try {
    const channel = await db.getChannelById(req.params.id);
    if (!channel) return res.status(404).json({ error: "Không tìm thấy kênh" });

    const { tokens, ...safeChannel } = channel;
    res.json(safeChannel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 4. ĐỒNG BỘ DANH SÁCH VIDEO
 */
router.post('/:id/sync', async (req, res) => {
  try {
    const videos = await YouTubeService.syncChannelVideos(req.params.id);
    const updatedChannel = await db.getChannelById(req.params.id);
    const { tokens, ...safeChannel } = updatedChannel || {};
    res.json({ message: "Đồng bộ thành công", count: videos.length, videos, channel: safeChannel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 5. LẤY DANH SÁCH VIDEO KÈM BỘ LỌC
 */
router.get('/:id/videos', async (req, res) => {
  try {
    const channel = await db.getChannelById(req.params.id);
    if (!channel) return res.status(404).json({ error: "Không tìm thấy kênh" });

    let videos = channel.videos || [];
    const { format, q, sort } = req.query;

    if (format && format !== 'all') {
      videos = videos.filter(v => v.type === format);
    }

    if (q) {
      const query = q.toLowerCase();
      videos = videos.filter(v => 
        v.title.toLowerCase().includes(query) || 
        (v.tags && v.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    if (sort === 'views') {
      videos.sort((a, b) => b.views - a.views);
    } else if (sort === 'ctr') {
      videos.sort((a, b) => b.ctr - a.ctr);
    } else if (sort === 'retention') {
      videos.sort((a, b) => b.retention - a.retention);
    }

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 6. NGẮT KẾT NỐI 1 KÊNH
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.deleteChannel(req.params.id);
    res.json({ message: "Đã ngắt kết nối kênh thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;