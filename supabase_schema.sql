-- ==============================================================
-- YTAnalyticsHub - Supabase Schema
-- Mở Supabase -> Chọn Project "YTAnalyticsHub" -> Vào "SQL Editor" -> Dán đoạn này và nhấn Run
-- ==============================================================

CREATE TABLE IF NOT EXISTS public.channels (
    id TEXT PRIMARY KEY,
    channel_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    handle TEXT,
    topic TEXT,
    avatar TEXT,
    uploads_playlist_id TEXT,
    benchmarks JSONB DEFAULT '{}'::jsonb,
    tokens JSONB DEFAULT '{}'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tắt RLS để backend Node.js có quyền đọc/ghi qua Supabase Key
ALTER TABLE public.channels DISABLE ROW LEVEL SECURITY;

-- Tạo index để tăng tốc độ tìm kiếm
CREATE INDEX IF NOT EXISTS idx_channels_channel_id ON public.channels(channel_id);

COMMENT ON TABLE public.channels IS 'Lưu trữ thông tin các kênh YouTube, hệ quy chiếu benchmarks và danh sách video đã đồng bộ';