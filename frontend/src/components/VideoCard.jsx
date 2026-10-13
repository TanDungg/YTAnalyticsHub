import React from 'react';

export default function VideoCard({ video, benchmark, onSelect }) {
  const ctrDiff = benchmark ? (video.ctr - benchmark.avgCtr).toFixed(1) : 0;
  const isCtrHigher = ctrDiff >= 0;

  const retDiff = benchmark ? (video.retention - benchmark.avgRetention).toFixed(1) : 0;
  const isRetHigher = retDiff >= 0;

  return (
    <div className="video-card" onClick={() => onSelect(video)}>
      <div className="card-thumb-wrap">
        <img src={video.thumb} alt={video.title} className="card-thumb" loading="lazy" />
        <span className={`thumb-type-tag ${video.type === 'shorts' ? 'type-shorts' : 'type-long'}`}>
          {video.type === 'shorts' ? 'Shorts ⚡' : 'Video dài'}
        </span>
        <span className="thumb-duration">{video.duration}</span>
      </div>

      <div className="card-body">
        <h4 className="card-title" title={video.title}>{video.title}</h4>
        
        <div className="card-meta-line">
          <span>{video.publishDate}</span>
          <span>•</span>
          <span>{video.category}</span>
        </div>

        <div className="card-stats-row">
          <div className="card-stat-item">
            <span className="card-stat-label">Lượt xem</span>
            <div className="card-stat-val">{video.views.toLocaleString()}</div>
          </div>
          <div className="card-stat-item">
            <span className="card-stat-label">CTR</span>
            <div className="card-stat-val">
              {video.ctr}%{' '}
              <span className={`comp-pill ${isCtrHigher ? 'higher' : 'lower'}`}>
                {isCtrHigher ? '+' : ''}{ctrDiff}%
              </span>
            </div>
          </div>
          <div className="card-stat-item">
            <span className="card-stat-label">% Giữ chân</span>
            <div className="card-stat-val">
              {video.retention}%{' '}
              <span className={`comp-pill ${isRetHigher ? 'higher' : 'lower'}`}>
                {isRetHigher ? '+' : ''}{retDiff}%
              </span>
            </div>
          </div>
          <div className="card-stat-item">
            <span className="card-stat-label">Tổng giờ xem</span>
            <div className="card-stat-val">{video.watchTimeHours?.toLocaleString() || 0}h</div>
          </div>
        </div>

        <div className="card-tags-preview">
          {video.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="tag-badge">#{tag}</span>
          ))}
          {video.tags?.length > 3 && (
            <span className="tag-badge">+{video.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}
