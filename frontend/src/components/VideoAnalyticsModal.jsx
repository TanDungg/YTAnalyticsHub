import React, { useEffect } from 'react';
import {
  X, BarChart3, Globe, Filter, TrendingUp, BarChart2, PieChart, Tag, Copy, FileText
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function VideoAnalyticsModal({ video, benchmark, onClose, showToast }) {
  useEffect(() => {
    document.body.classList.add('modal-open');
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!video) return null;

  // So sánh với chuẩn kênh
  const ctrDiff = benchmark ? ((video.ctr - benchmark.avgCtr) / benchmark.avgCtr * 100).toFixed(1) : 0;
  const retDiff = benchmark ? ((video.retention - benchmark.avgRetention) / benchmark.avgRetention * 100).toFixed(1) : 0;

  let evalBadge = "HIỆU SUẤT XUẤT SẮC";
  let evalBg = "var(--neon-emerald)";
  let evalText = `Cả CTR (+${ctrDiff}%) và Giữ chân người xem (+${retDiff}%) đều vượt chuẩn của kênh. Thuật toán YouTube đang đề xuất rất tích cực video này.`;

  if (video.retention >= (benchmark?.avgRetention || 0) && video.ctr < (benchmark?.avgCtr || 0)) {
    evalBadge = "TIỀM NĂNG - CẦN ĐỔI THUMBNAIL";
    evalBg = "var(--neon-amber)";
    evalText = `Nội dung giữ chân người xem rất tốt (+${retDiff}%), nhưng CTR thấp hơn chuẩn (${ctrDiff}%). Thay đổi Thumbnail hoặc Tiêu đề hấp dẫn hơn sẽ giúp video bùng nổ view!`;
  } else if (video.ctr >= (benchmark?.avgCtr || 0) && video.retention < (benchmark?.avgRetention || 0)) {
    evalBadge = "CẨN THẬN CLICKBAIT";
    evalBg = "var(--yt-red)";
    evalText = `CTR cao (+${ctrDiff}%) chứng tỏ Thumbnail hấp dẫn, nhưng người xem thoát sớm (${retDiff}% so với chuẩn). Cần kiểm tra lại đoạn mở đầu (Hook) của video.`;
  } else if (video.ctr < (benchmark?.avgCtr || 0) && video.retention < (benchmark?.avgRetention || 0)) {
    evalBadge = "DƯỚI MỨC TRUNG BÌNH";
    evalBg = "var(--text-muted)";
    evalText = `Cả tỉ lệ click lẫn thời gian giữ chân đều chưa đạt ngưỡng trung bình của kênh. Cần tối ưu lại chủ đề cho các video sau.`;
  }

  // Retention Chart Config
  const retentionLabels = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
  const decayRate = (100 - video.retention) / 50;
  const retentionData = {
    labels: retentionLabels,
    datasets: [
      {
        label: "Video này",
        data: [
          100,
          Math.round(85 - decayRate * 2),
          Math.round(76 - decayRate * 4),
          Math.round(68 - decayRate * 5),
          Math.round(62 - decayRate * 6),
          Math.round(video.retention + 4),
          Math.round(video.retention),
          Math.round(video.retention - 4),
          Math.round(video.retention - 8),
          Math.round(video.retention - 12),
          Math.round(video.retention - 16)
        ],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.12)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#38bdf8"
      },
      {
        label: `Chuẩn kênh (${benchmark?.avgRetention || 45}%)`,
        data: retentionLabels.map(() => benchmark?.avgRetention || 45),
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  // Traffic Chart Config
  const trafficData = {
    labels: ["Đề xuất (Suggested)", "Tìm kiếm (Search)", "Duyệt xem (Browse)", "Khác / Shorts Feed"],
    datasets: [
      {
        data: [
          video.traffic?.suggested || 50,
          video.traffic?.search || 30,
          video.traffic?.browse || 15,
          video.traffic?.other || 5
        ],
        backgroundColor: ["#ff0033", "#38bdf8", "#34d399", "#c084fc"],
        borderWidth: 0
      }
    ]
  };

  // Realtime Chart Config
  const realtimeData = {
    labels: Array.from({ length: 24 }, (_, i) => `${24 - i}h trước`),
    datasets: [
      {
        label: "Lượt xem / giờ",
        data: video.realtime48h || Array.from({ length: 24 }, () => Math.floor(Math.random() * 500) + 50),
        backgroundColor: "rgba(56, 189, 248, 0.75)",
        hoverBackgroundColor: "#38bdf8",
        borderRadius: 3
      }
    ]
  };

  const copyTags = () => {
    if (video.tags && video.tags.length > 0) {
      navigator.clipboard.writeText(video.tags.join(', ')).then(() => {
        showToast(`Đã sao chép ${video.tags.length} thẻ tags vào clipboard!`);
      });
    }
  };

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && onClose()}>
      <div className="modal-dialog" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-badge">
              <BarChart3 size={14} /> PHÂN TÍCH CHUYÊN SÂU VIDEO
            </span>
            <h2 className="modal-title">{video.title}</h2>
          </div>
          <button className="btn-close-modal" onClick={onClose} title="Đóng (ESC)">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Row 1: Hero & Specs */}
          <div className="modal-hero-grid">
            <div className="modal-thumb-box">
              <img src={video.thumb} alt={video.title} className="modal-thumb" />
              <span className="thumb-duration-pill">{video.duration}</span>
              <span className="thumb-format-pill">{video.type === 'shorts' ? 'Shorts ⚡' : 'Video dài'}</span>
            </div>

            <div className="modal-hero-details">
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Ngày xuất bản</span>
                  <span className="spec-val">{video.publishDate}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Trạng thái</span>
                  <span className="spec-val text-green"><Globe size={13} /> {video.status}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Danh mục</span>
                  <span className="spec-val">{video.category}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Mã Video (ID)</span>
                  <span className="spec-val font-mono text-cyan">{video.id}</span>
                </div>
              </div>

              <div className="diagnosis-banner">
                <div className="diagnosis-badge" style={{ background: evalBg, color: evalBg === 'var(--yt-red)' ? '#fff' : '#000' }}>
                  {evalBadge}
                </div>
                <p className="diagnosis-desc">{evalText}</p>
              </div>
            </div>
          </div>

          {/* Row 2: 4 Core Metrics */}
          <div className="kpi-metrics-row">
            <div className="kpi-box">
              <span className="kpi-label">Lượt xem (Views)</span>
              <div className="kpi-num">{video.views.toLocaleString()}</div>
              <div className="kpi-comp">{(video.views / 1000).toFixed(1)}K lượt xem thực tế</div>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">CTR (Tỉ lệ click)</span>
              <div className="kpi-num">{video.ctr}%</div>
              <div className={`kpi-comp ${ctrDiff >= 0 ? '' : 'neg'}`}>
                {ctrDiff >= 0 ? '+' : ''}{ctrDiff}% vs chuẩn kênh ({benchmark?.avgCtr}%)
              </div>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">% Giữ chân TB (Retention)</span>
              <div className="kpi-num">{video.retention}%</div>
              <div className={`kpi-comp ${retDiff >= 0 ? '' : 'neg'}`}>
                {retDiff >= 0 ? '+' : ''}{retDiff}% vs chuẩn kênh ({benchmark?.avgRetention}%)
              </div>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">Tổng giờ xem (Watch Time)</span>
              <div className="kpi-num">{video.watchTimeHours?.toLocaleString() || 0}h</div>
              <div className="kpi-comp font-mono">AVD: {video.avgDurationSec}</div>
            </div>
          </div>

          {/* Row 3: Audience Funnel */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">
                <Filter size={17} />
                <h4>Phễu chuyển đổi người xem (Audience Conversion Funnel)</h4>
              </div>
              <span className="panel-subtitle">Từ lúc hiển thị thumbnail đến khi tạo ra thời gian xem</span>
            </div>
            <div className="funnel-chain">
              <div className="funnel-step">
                <span className="funnel-name">Lượt hiển thị</span>
                <div className="funnel-val">{(video.impressions / 1000000).toFixed(2)}M</div>
                <div className="funnel-rate">100% người thấy</div>
              </div>
              <div className="funnel-step">
                <span className="funnel-name">Tỷ lệ Click (CTR)</span>
                <div className="funnel-val">{video.ctr}%</div>
                <div className="funnel-rate">Quyết định xem</div>
              </div>
              <div className="funnel-step">
                <span className="funnel-name">Lượt xem (Views)</span>
                <div className="funnel-val">{(video.views / 1000).toFixed(1)}K</div>
                <div className="funnel-rate">Vào video</div>
              </div>
              <div className="funnel-step">
                <span className="funnel-name">Tổng giờ xem</span>
                <div className="funnel-val">{video.watchTimeHours?.toLocaleString() || 0}h</div>
                <div className="funnel-rate">Tích lũy thực tế</div>
              </div>
            </div>
          </div>

          {/* Row 4: Two-Column Charts */}
          <div className="modal-columns-grid">
            <div className="modal-col-left">
              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-title">
                    <TrendingUp size={17} />
                    <h4>Tỷ lệ giữ chân người xem theo thời lượng (Audience Retention Curve)</h4>
                  </div>
                  <span className="panel-subtitle">So sánh với đường chuẩn trung bình</span>
                </div>
                <div className="chart-canvas-container main-chart">
                  <Line data={retentionData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
                <div className="retention-insights-row">
                  <div className="insight-item">
                    <span className="insight-dot dot-green"></span>
                    <span>Tỷ lệ xem 30 giây đầu: <strong>76%</strong> (Khởi đầu rất tốt)</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-dot dot-red"></span>
                    <span>Điểm tụt view mạnh nhất: <strong>ở mốc 60%</strong> (Chuyển tiếp nội dung)</span>
                  </div>
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-title">
                    <BarChart2 size={17} />
                    <h4>Lượt xem theo từng giờ (48 giờ gần nhất)</h4>
                  </div>
                  <span className="badge-realtime"><span className="pulse-dot"></span> Realtime</span>
                </div>
                <div className="chart-canvas-container mini-chart">
                  <Bar data={realtimeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </div>

            <div className="modal-col-right">
              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-title">
                    <PieChart size={17} />
                    <h4>Nguồn lưu lượng (Traffic Sources)</h4>
                  </div>
                </div>
                <div className="chart-canvas-container doughnut-chart">
                  <Doughnut data={trafficData} options={{ responsive: true, maintainAspectRatio: false, cutout: '68%' }} />
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-title">
                    <Tag size={17} />
                    <h4>Thẻ Tags đã gắn ({video.tags?.length || 0})</h4>
                  </div>
                  <button className="btn-action-sm" onClick={copyTags}>
                    <Copy size={13} />
                    <span>Sao chép tất cả tag</span>
                  </button>
                </div>
                <div className="tags-cloud">
                  {video.tags?.map((t, i) => (
                    <span key={i} className="tag-pill">#{t}</span>
                  ))}
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-title">
                    <FileText size={17} />
                    <h4>Mô tả video (Description)</h4>
                  </div>
                </div>
                <div className="description-preview">{video.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
