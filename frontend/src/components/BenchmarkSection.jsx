import React from 'react';
import { Compass, Calendar, Users, Eye, MousePointerClick, Activity } from 'lucide-react';

export default function BenchmarkSection({ benchmarks, videos = [] }) {
  if (!benchmarks) return null;

  const hasCtr = typeof benchmarks.avgCtr === 'number' && benchmarks.avgCtr > 0;
  const hasRetention = typeof benchmarks.avgRetention === 'number' && benchmarks.avgRetention > 0;

  // Đảm bảo số lượt xem 28 ngày luôn đồng bộ và không bao giờ thấp hơn tổng view thực tế của các video
  const calculatedViews28d = React.useMemo(() => {
    const rawStored = parseInt((benchmarks.views28d || "0").toString().replace(/,/g, ''), 10) || 0;
    if (!videos || videos.length === 0) return (rawStored || 0).toLocaleString();

    const cutoff28d = Date.now() - 28 * 24 * 60 * 60 * 1000;
    const recentVideosViews = videos.filter(v => {
      let t = 0;
      if (v.publishedAt) t = new Date(v.publishedAt).getTime();
      else if (v.publishDate) {
        const parts = v.publishDate.split('/');
        if (parts.length === 3) t = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime();
        else t = new Date(v.publishDate).getTime();
      }
      return !isNaN(t) && t >= cutoff28d;
    }).reduce((sum, v) => sum + (v.views || 0), 0);

    const totalAllViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const baseline = recentVideosViews > 0 ? recentVideosViews : (videos.length <= 10 ? totalAllViews : 0);
    return Math.max(rawStored, baseline).toLocaleString();
  }, [benchmarks.views28d, videos]);

  const displayTrend = React.useMemo(() => {
    if (calculatedViews28d !== "0" && (!benchmarks.viewsTrend || benchmarks.viewsTrend === '+0%')) {
      return '+100%';
    }
    return benchmarks.viewsTrend || '+0%';
  }, [calculatedViews28d, benchmarks.viewsTrend]);

  return (
    <section className="benchmark-section">
      <div className="benchmark-header">
        <div className="benchmark-title-group">
          <div className="icon-circle">
            <Compass size={20} />
          </div>
          <div>
            <h3>Hệ quy chiếu chuẩn của riêng kênh (28 ngày qua)</h3>
            <p>Mỗi video của kênh được so sánh với các chỉ số trung bình này để đo lường độ hiệu quả</p>
          </div>
        </div>
        <span className="badge-period">
          <Calendar size={13} /> 28 ngày gần nhất
        </span>
      </div>

      <div className="benchmark-grid">
        <div className="benchmark-card card-cyan">
          <div className="card-top">
            <span className="label">Người đăng ký (Subscribers)</span>
            <div className="icon-box"><Users size={16} /></div>
          </div>
          <div className="value-row">
            <span className="value">{benchmarks.subscribers || 0}</span>
            <span className="trend up">{benchmarks.subsTrend || '+0'}</span>
          </div>
          <div className="card-footer-info">Tổng quy mô người theo dõi</div>
        </div>

        <div className="benchmark-card card-purple">
          <div className="card-top">
            <span className="label">Tổng lượt xem (28 ngày)</span>
            <div className="icon-box"><Eye size={16} /></div>
          </div>
          <div className="value-row">
            <span className="value">{calculatedViews28d}</span>
            <span className="trend up">{displayTrend}</span>
          </div>
          <div className="card-footer-info">Lượng view tích lũy tháng này</div>
        </div>

        <div className="benchmark-card card-red highlight-card">
          <div className="card-top">
            <span className="label">CTR Trung Bình Kênh (Chuẩn nhấp)</span>
            <div className="icon-box"><MousePointerClick size={16} /></div>
          </div>
          <div className="value-row">
            <span className={`value ${!hasCtr ? 'empty-val' : ''}`}>{hasCtr ? `${benchmarks.avgCtr}%` : 'Chưa có'}</span>
            <span className={`target-tag ${!hasCtr ? 'hint-tag' : ''}`}>
              {hasCtr ? (
                <>Mục tiêu &gt; <strong>{benchmarks.targetCtr}%</strong></>
              ) : (
                'Chỉ có trong YouTube Studio'
              )}
            </span>
          </div>
          <div className="card-footer-info">
            {hasCtr ? 'Thước đo sức hút Thumbnail & Tiêu đề' : 'Google API không hỗ trợ xuất CTR tự động'}
          </div>
        </div>

        <div className="benchmark-card card-emerald highlight-card">
          <div className="card-top">
            <span className="label">Tỷ lệ Giữ Chân TB (Retention)</span>
            <div className="icon-box"><Activity size={16} /></div>
          </div>
          <div className="value-row">
            <span className={`value ${!hasRetention ? 'empty-val' : ''}`}>{hasRetention ? `${benchmarks.avgRetention}%` : 'Chưa có'}</span>
            <span className={`target-tag ${!hasRetention ? 'hint-tag' : ''}`}>
              {hasRetention ? (
                <>Mục tiêu &gt; <strong>{benchmarks.targetRetention}%</strong></>
              ) : (
                'Đang cập nhật từ Analytics'
              )}
            </span>
          </div>
          <div className="card-footer-info">
            {hasRetention ? 'Thước đo chất lượng nội dung video' : 'Cần phát sinh lượt xem để YouTube Analytics ghi nhận'}
          </div>
        </div>
      </div>
    </section>
  );
}
