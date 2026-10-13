import React from 'react';
import { Compass, Calendar, Users, Eye, MousePointerClick, Activity } from 'lucide-react';

export default function BenchmarkSection({ benchmarks }) {
  if (!benchmarks) return null;

  const hasCtr = typeof benchmarks.avgCtr === 'number' && benchmarks.avgCtr > 0;
  const hasRetention = typeof benchmarks.avgRetention === 'number' && benchmarks.avgRetention > 0;

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
            <span className="value">{benchmarks.views28d || 0}</span>
            <span className="trend up">{benchmarks.viewsTrend || '+0%'}</span>
          </div>
          <div className="card-footer-info">Lượng view tích lũy tháng này</div>
        </div>

        <div className="benchmark-card card-red highlight-card">
          <div className="card-top">
            <span className="label">CTR Trung Bình Kênh (Chuẩn nhấp)</span>
            <div className="icon-box"><MousePointerClick size={16} /></div>
          </div>
          <div className="value-row">
            <span className="value">{hasCtr ? `${benchmarks.avgCtr}%` : 'Chưa có'}</span>
            <span className="target-tag">
              {hasCtr ? (
                <>Mục tiêu &gt; <strong>{benchmarks.targetCtr}%</strong></>
              ) : (
                'Cần tối thiểu 1 video'
              )}
            </span>
          </div>
          <div className="card-footer-info">
            {hasCtr ? 'Thước đo sức hút Thumbnail & Tiêu đề' : 'Chưa có video để tính toán'}
          </div>
        </div>

        <div className="benchmark-card card-emerald highlight-card">
          <div className="card-top">
            <span className="label">Tỷ lệ Giữ Chân TB (Retention)</span>
            <div className="icon-box"><Activity size={16} /></div>
          </div>
          <div className="value-row">
            <span className="value">{hasRetention ? `${benchmarks.avgRetention}%` : 'Chưa có'}</span>
            <span className="target-tag">
              {hasRetention ? (
                <>Mục tiêu &gt; <strong>{benchmarks.targetRetention}%</strong></>
              ) : (
                'Cần tối thiểu 1 video'
              )}
            </span>
          </div>
          <div className="card-footer-info">
            {hasRetention ? 'Thước đo chất lượng nội dung video' : 'Chưa có video để tính toán'}
          </div>
        </div>
      </div>
    </section>
  );
}
