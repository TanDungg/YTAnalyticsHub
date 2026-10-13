import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, isSupabaseConfigured } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../data/channels.json');

class Store {
  constructor() {
    this.ensureDbExists();
  }

  ensureDbExists() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  getLocalChannels() {
    try {
      if (!fs.existsSync(DB_PATH)) return [];
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  saveLocalChannels(channels) {
    try {
      this.ensureDbExists();
      fs.writeFileSync(DB_PATH, JSON.stringify(channels, null, 2), 'utf-8');
    } catch (e) {
      console.warn("Không thể lưu channels.json:", e.message);
    }
  }

  async getChannels() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('channels')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const channels = data.map(row => ({
            id: row.id,
            channelId: row.channel_id,
            name: row.name,
            handle: row.handle,
            topic: row.topic,
            avatar: row.avatar,
            uploadsPlaylistId: row.uploads_playlist_id,
            benchmarks: row.benchmarks || {},
            tokens: row.tokens || {},
            videos: row.videos || []
          }));

          // Đồng bộ cache local
          this.saveLocalChannels(channels);
          return channels;
        } else if (error) {
          console.warn("Lỗi Supabase getChannels, dùng dữ liệu local:", error.message);
        }
      } catch (err) {
        console.warn("Lỗi kết nối Supabase:", err.message);
      }
    }

    return this.getLocalChannels();
  }

  async getChannelById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('channels')
          .select('*')
          .or(`id.eq.${id},channel_id.eq.${id}`)
          .maybeSingle();

        if (data) {
          return {
            id: data.id,
            channelId: data.channel_id,
            name: data.name,
            handle: data.handle,
            topic: data.topic,
            avatar: data.avatar,
            uploadsPlaylistId: data.uploads_playlist_id,
            benchmarks: data.benchmarks || {},
            tokens: data.tokens || {},
            videos: data.videos || []
          };
        }
      } catch (e) {
        console.warn("Lỗi Supabase getChannelById:", e.message);
      }
    }

    const channels = this.getLocalChannels();
    return channels.find(c => c.id === id || c.channelId === id);
  }

  async saveChannel(channelData) {
    const id = channelData.id || `ch-${Date.now()}`;
    const formatted = {
      ...channelData,
      id
    };

    // 1. Luôn lưu cache local
    const localChannels = this.getLocalChannels();
    const index = localChannels.findIndex(c => c.channelId === formatted.channelId);
    if (index >= 0) {
      localChannels[index] = { ...localChannels[index], ...formatted };
    } else {
      localChannels.push(formatted);
    }
    this.saveLocalChannels(localChannels);

    // 2. Lưu vào Supabase nếu cấu hình
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('channels')
          .upsert({
            id: formatted.id,
            channel_id: formatted.channelId,
            name: formatted.name,
            handle: formatted.handle || '',
            topic: formatted.topic || '',
            avatar: formatted.avatar || '',
            uploads_playlist_id: formatted.uploadsPlaylistId || '',
            benchmarks: formatted.benchmarks || {},
            tokens: formatted.tokens || {},
            videos: formatted.videos || [],
            updated_at: new Date().toISOString()
          }, { onConflict: 'channel_id' });

        if (error) {
          console.warn("Lỗi Supabase upsert:", error.message);
        }
      } catch (err) {
        console.warn("Lỗi lưu Supabase:", err.message);
      }
    }

    return formatted;
  }

  async updateVideos(channelId, videos) {
    // 1. Cập nhật local
    const localChannels = this.getLocalChannels();
    const channel = localChannels.find(c => c.id === channelId || c.channelId === channelId);
    if (channel) {
      channel.videos = videos;
      this.saveLocalChannels(localChannels);
    }

    // 2. Cập nhật Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('channels')
          .update({
            videos: videos,
            updated_at: new Date().toISOString()
          })
          .or(`id.eq.${channelId},channel_id.eq.${channelId}`);
      } catch (e) {
        console.warn("Lỗi Supabase updateVideos:", e.message);
      }
    }
  }

  async deleteChannel(id) {
    // 1. Xóa local
    const localChannels = this.getLocalChannels().filter(c => c.id !== id && c.channelId !== id);
    this.saveLocalChannels(localChannels);

    // 2. Xóa Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('channels')
          .delete()
          .or(`id.eq.${id},channel_id.eq.${id}`);
      } catch (e) {
        console.warn("Lỗi Supabase deleteChannel:", e.message);
      }
    }

    return true;
  }
}

export const db = new Store();