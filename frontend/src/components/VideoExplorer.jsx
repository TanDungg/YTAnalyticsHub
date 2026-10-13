import React from 'react';
import { Search, PlayCircle, Zap, ArrowDownUp, Sparkles, VideoOff } from 'lucide-react';
import VideoCard from './VideoCard';

export default function VideoExplorer({
  videos,
  benchmark,
  formatFilter,
  setFormatFilter,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  onSelectVideo
}) {
  return (
    <section className="video-explorer-section">
      <div className="controls-bar">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh theo tiêu đề video hoặc thẻ tag (Ctrl + K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="kbd-hint">Ctrl K</kbd>
        </div>

        <div className="filters-group">
          <div className="btn-group-format">
            <button
              className={`filter-btn ${formatFilter === 'all' ? 'active' : ''}`}
              onClick={() => setFormatFilter('all')}
            >
              Tất cả video
            </button>
            <button
              className={`filter-btn ${formatFilter === 'long' ? 'active' : ''}`}
              onClick={() => setFormatFilter('long')}
            >
              <PlayCircle size={14} /> Video dài
            </button>
            <button
              className={`filter-btn ${formatFilter === 'shorts' ? 'active' : ''}`}
              onClick={() => setFormatFilter('shorts')}
            >
              <Zap size={14} /> Shorts
            </button>
          </div>

          <div className="select-wrapper">
            <ArrowDownUp className="select-icon" size={15} />
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="recent">Sắp xếp: Mới nhất</option>
              <option value="views">Lượt xem nhiều nhất</option>
              <option value="ctr">Tỉ lệ Click (CTR) cao nhất</option>
              <option value="retention">Giữ chân người xem tốt nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="video-status-bar">
        <div className="count-pill">
          <span className="live-indicator"></span>
          <span>Đang hiển thị {videos.length} video</span>
        </div>
        <span className="hint-text">
          <Sparkles size={14} /> Nhấp vào bất kỳ video nào để mở bảng phân tích chuyên sâu
        </span>
      </div>

      <div className="video-grid">
        {videos.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-medium)'
          }}>
            <VideoOff size={44} style={{ marginBottom: 14, color: 'var(--neon-cyan)' }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Không tìm thấy video nào</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        ) : (
          videos.map((vid) => (
            <VideoCard
              key={vid.id}
              video={vid}
              benchmark={benchmark}
              onSelect={onSelectVideo}
            />
          ))
        )}
      </div>
    </section>
  );
}
