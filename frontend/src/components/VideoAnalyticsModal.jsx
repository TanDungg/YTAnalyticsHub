import React, { useEffect } from "react";
import {
  X,
  BarChart3,
  Globe,
  Filter,
  TrendingUp,
  BarChart2,
  PieChart,
  Tag,
  Copy,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
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
  Filler,
} from "chart.js";

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
  Filler,
);

export default function VideoAnalyticsModal({
  video,
  benchmark,
  onClose,
  onSync,
  isSyncing,
  showToast,
}) {
  useEffect(() => {
    document.body.classList.add("modal-open");
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!video) return null;

  const hasViews = typeof video.views === "number" && video.views > 0;
  const hasCtr = typeof video.ctr === "number" && video.ctr > 0;
  const hasRetention =
    typeof video.retention === "number" && video.retention > 0;
  const hasBenchmark =
    benchmark &&
    typeof benchmark.avgCtr === "number" &&
    benchmark.avgCtr > 0 &&
    typeof benchmark.avgRetention === "number" &&
    benchmark.avgRetention > 0;

  // So sánh với chuẩn kênh
  const ctrDiff =
    hasBenchmark && hasCtr ? (video.ctr - benchmark.avgCtr).toFixed(1) : null;
  const retDiff =
    hasBenchmark && hasRetention
      ? (video.retention - benchmark.avgRetention).toFixed(1)
      : null;

  let evalBadge = "CHƯA PHÁT SINH LƯỢT XEM";
  let evalBg = "var(--text-muted)";
  let evalText =
    "Video này chưa ghi nhận lượt xem trên YouTube API. Nếu trên YouTube vừa có người xem mới, hãy bấm nút 'Làm mới số liệu' để cập nhật.";

  if (hasViews && hasRetention) {
    if (hasCtr) {
      if (
        video.retention >= (benchmark?.avgRetention || 0) &&
        video.ctr >= (benchmark?.avgCtr || 0)
      ) {
        evalBadge = "HIỆU SUẤT XUẤT SẮC";
        evalBg = "var(--neon-emerald)";
        evalText = `Cả CTR (+${ctrDiff || 0}%) và Giữ chân người xem (+${retDiff || 0}%) đều vượt chuẩn của kênh. Thuật toán YouTube đang đề xuất rất tích cực video này.`;
      } else if (
        video.retention >= (benchmark?.avgRetention || 0) &&
        video.ctr < (benchmark?.avgCtr || 0)
      ) {
        evalBadge = "TIỀM NĂNG - CẦN ĐỔI THUMBNAIL";
        evalBg = "var(--neon-amber)";
        evalText = `Nội dung giữ chân người xem rất tốt (+${retDiff || 0}%), nhưng CTR thấp hơn chuẩn (${ctrDiff || 0}%). Thay đổi Thumbnail hoặc Tiêu đề hấp dẫn hơn sẽ giúp video bùng nổ view!`;
      } else if (
        video.ctr >= (benchmark?.avgCtr || 0) &&
        video.retention < (benchmark?.avgRetention || 0)
      ) {
        evalBadge = "CẨN THẬN CLICKBAIT";
        evalBg = "var(--yt-red)";
        evalText = `CTR cao (+${ctrDiff || 0}%) chứng tỏ Thumbnail hấp dẫn, nhưng người xem thoát sớm (${retDiff || 0}% so với chuẩn). Cần kiểm tra lại đoạn mở đầu (Hook) của video.`;
      } else {
        evalBadge = "DƯỚI MỨC TRUNG BÌNH";
        evalBg = "var(--text-muted)";
        evalText = `Cả tỉ lệ click lẫn thời gian giữ chân đều chưa đạt ngưỡng trung bình của kênh. Cần tối ưu lại chủ đề cho các video sau.`;
      }
    } else {
      if (video.retention >= (benchmark?.avgRetention || 0)) {
        evalBadge = "GIỮ CHÂN NGƯỜI XEM TỐT";
        evalBg = "var(--neon-emerald)";
        evalText = `Tỷ lệ giữ chân người xem đạt ${video.retention}% (${retDiff && Number(retDiff) >= 0 ? `+${retDiff}% ` : ""}so với chuẩn kênh). Khán giả đang xem rất kỹ nội dung này!`;
      } else {
        evalBadge = "CẦN TỐI ƯU ĐOẠN ĐẦU";
        evalBg = "var(--neon-amber)";
        evalText = `Tỷ lệ giữ chân đạt ${video.retention}% (${retDiff || 0}% so với chuẩn kênh). Cần cải thiện đoạn Hook 30 giây đầu để giữ chân khán giả lâu hơn.`;
      }
    }
  } else if (hasViews && !hasRetention) {
    evalBadge = "ĐANG CHỜ YOUTUBE XỬ LÝ (24-48H)";
    evalBg = "var(--neon-amber)";
    evalText = `Đã ghi nhận ${video.views.toLocaleString()} lượt xem thực tế! Đối với video mới xuất bản, YouTube Analytics cần từ 24 đến 48 giờ để xử lý và tổng hợp các báo cáo chuyên sâu (% Giữ chân, Thời lượng xem trung bình AVD).`;
  }

  // Retention Chart Config
  const retentionLabels = [
    "0%",
    "10%",
    "20%",
    "30%",
    "40%",
    "50%",
    "60%",
    "70%",
    "80%",
    "90%",
    "100%",
  ];
  const decayRate = hasRetention ? (100 - video.retention) / 50 : 0;
  const retentionData = {
    labels: retentionLabels,
    datasets: [
      {
        label: "Video này",
        data: hasRetention
          ? [
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
              Math.round(video.retention - 16),
            ]
          : [],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.12)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#38bdf8",
      },
      {
        label: `Chuẩn kênh (${benchmark?.avgRetention || 0}%)`,
        data: retentionLabels.map(() => benchmark?.avgRetention || 0),
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  // Traffic Chart Config
  const hasTraffic =
    video.traffic &&
    typeof video.traffic === "object" &&
    Object.values(video.traffic).some((v) => v > 0);
  const trafficData = {
    labels: [
      "Đề xuất (Suggested)",
      "Tìm kiếm (Search)",
      "Duyệt xem (Browse)",
      "Khác / Shorts Feed",
    ],
    datasets: [
      {
        data: hasTraffic
          ? [
              video.traffic?.suggested || 0,
              video.traffic?.search || 0,
              video.traffic?.browse || 0,
              video.traffic?.other || 0,
            ]
          : [],
        backgroundColor: ["#ff0033", "#38bdf8", "#34d399", "#c084fc"],
        borderWidth: 0,
      },
    ],
  };

  // Realtime Chart Config
  const hasRealtime =
    Array.isArray(video.realtime48h) && video.realtime48h.some((v) => v > 0);
  const realtimeData = {
    labels: Array.from({ length: 24 }, (_, i) => `${24 - i}h trước`),
    datasets: [
      {
        label: "Lượt xem / giờ",
        data: hasRealtime ? video.realtime48h : [],
        backgroundColor: "rgba(56, 189, 248, 0.75)",
        hoverBackgroundColor: "#38bdf8",
        borderRadius: 3,
      },
    ],
  };

  const copyTags = () => {
    if (video.tags && video.tags.length > 0) {
      navigator.clipboard.writeText(video.tags.join(", ")).then(() => {
        showToast(`Đã sao chép ${video.tags.length} thẻ tags vào clipboard!`);
      });
    }
  };

  return (
    <div
      className="modal-backdrop open"
      onClick={(e) =>
        e.target.classList.contains("modal-backdrop") && onClose()
      }
    >
      <div className="modal-dialog" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-badge">
              <BarChart3 size={14} /> PHÂN TÍCH CHUYÊN SÂU VIDEO
            </span>
            <h2 className="modal-title">{video.title}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {onSync && (
              <button
                type="button"
                className="btn-sync-modal"
                onClick={onSync}
                disabled={isSyncing}
                title="Làm mới lượt xem và số liệu từ YouTube"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  color: "var(--neon-cyan)",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: isSyncing ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <RefreshCw size={13} className={isSyncing ? "spin" : ""} />
                <span>
                  {isSyncing ? "Đang cập nhật..." : "Làm mới số liệu"}
                </span>
              </button>
            )}
            <button
              className="btn-close-modal"
              onClick={onClose}
              title="Đóng (ESC)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Row 1: Hero & Specs */}
          <div className="modal-hero-grid">
            <div className="modal-thumb-box">
              <img
                src={video.thumb}
                alt={video.title}
                className="modal-thumb"
              />
              <span className="thumb-duration-pill">{video.duration}</span>
              <span className="thumb-format-pill">
                {video.type === "shorts" ? "Shorts ⚡" : "Video dài"}
              </span>
            </div>

            <div className="modal-hero-details">
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Ngày xuất bản</span>
                  <span className="spec-val">
                    {video.publishDate || "Chưa có"}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Trạng thái</span>
                  <span
                    className={`spec-val ${video.status === "Công khai" ? "text-green" : video.status === "Riêng tư" ? "text-amber" : "text-cyan"}`}
                  >
                    <Globe size={13} /> {video.status || "Chưa rõ"}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Danh mục</span>
                  <span className="spec-val">
                    {video.category || "Chưa phân loại"}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Mã Video (ID)</span>
                  <span className="spec-val font-mono text-cyan">
                    {video.id}
                  </span>
                </div>
              </div>

              <div className="diagnosis-banner">
                <div
                  className="diagnosis-badge"
                  style={{
                    background: evalBg,
                    color: evalBg === "var(--yt-red)" ? "#fff" : "#000",
                  }}
                >
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
              <div className="kpi-num">
                {hasViews ? video.views.toLocaleString() : "0"}
              </div>
              <div className="kpi-comp">
                {hasViews
                  ? `${video.views.toLocaleString()} lượt xem thực tế`
                  : "Chưa có lượt xem"}
              </div>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">CTR (Tỉ lệ click)</span>
              <div className="kpi-num">
                {hasCtr ? `${video.ctr}%` : "Chưa có"}
              </div>
              <div
                className={`kpi-comp ${hasCtr && ctrDiff !== null && ctrDiff >= 0 ? "" : "neg"}`}
              >
                {hasCtr && hasBenchmark && ctrDiff !== null
                  ? `${ctrDiff >= 0 ? "+" : ""}${ctrDiff}% vs chuẩn kênh (${benchmark?.avgCtr}%)`
                  : "Chỉ có trong YouTube Studio"}
              </div>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">% Giữ chân TB (Retention)</span>
              <div className="kpi-num">
                {hasRetention ? `${video.retention}%` : "Chưa có"}
              </div>
              <div
                className={`kpi-comp ${hasRetention && retDiff !== null && retDiff >= 0 ? "" : "neg"}`}
              >
                {hasRetention && hasBenchmark && retDiff !== null
                  ? `${retDiff >= 0 ? "+" : ""}${retDiff}% vs chuẩn kênh (${benchmark?.avgRetention}%)`
                  : "Chưa có"}
              </div>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">Tổng giờ xem (Watch Time)</span>
              <div className="kpi-num">
                {video.watchTimeHours && video.watchTimeHours > 0
                  ? `${video.watchTimeHours}h`
                  : "0h"}
              </div>
              <div className="kpi-comp font-mono">
                {video.avgDurationSec && video.avgDurationSec !== "0:00"
                  ? `AVD: ${video.avgDurationSec}`
                  : "AVD: Chưa có"}
              </div>
            </div>
          </div>

          {/* Row 3: Audience Funnel */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">
                <Filter size={17} />
                <h4>Phễu chuyển đổi người xem (Audience Conversion Funnel)</h4>
              </div>
              <span className="panel-subtitle">
                Từ lúc hiển thị thumbnail đến khi tạo ra thời gian xem
              </span>
            </div>
            <div className="funnel-chain">
              <div className="funnel-step">
                <span className="funnel-name">Lượt hiển thị</span>
                <div className="funnel-val">
                  {video.impressions && video.impressions > 0
                    ? video.impressions.toLocaleString()
                    : "Chưa có"}
                </div>
                <div className="funnel-rate">
                  {video.impressions > 0 ? "100% người thấy" : "Chưa có"}
                </div>
              </div>
              <div className="funnel-step">
                <span className="funnel-name">Tỷ lệ Click (CTR)</span>
                <div className="funnel-val">
                  {hasCtr ? `${video.ctr}%` : "Chưa có"}
                </div>
                <div className="funnel-rate">
                  {hasCtr ? "Quyết định xem" : "Chưa có"}
                </div>
              </div>
              <div className="funnel-step">
                <span className="funnel-name">Lượt xem (Views)</span>
                <div className="funnel-val">
                  {hasViews ? video.views.toLocaleString() : "0"}
                </div>
                <div className="funnel-rate">
                  {hasViews ? "Vào video" : "Chưa có"}
                </div>
              </div>
              <div className="funnel-step">
                <span className="funnel-name">Tổng giờ xem</span>
                <div className="funnel-val">
                  {video.watchTimeHours && video.watchTimeHours > 0
                    ? `${video.watchTimeHours}h`
                    : "0h"}
                </div>
                <div className="funnel-rate">
                  {video.watchTimeHours > 0 ? "Tích lũy thực tế" : "Chưa có"}
                </div>
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
                    <h4>
                      Tỷ lệ giữ chân người xem theo thời lượng (Audience
                      Retention Curve)
                    </h4>
                  </div>
                  <span className="panel-subtitle">
                    So sánh với đường chuẩn trung bình
                  </span>
                </div>
                {hasViews && hasRetention ? (
                  <>
                    <div className="chart-canvas-container main-chart">
                      <Line
                        data={retentionData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                    <div className="retention-insights-row">
                      <div className="insight-item">
                        <span className="insight-dot dot-green"></span>
                        <span>
                          Tỷ lệ xem 30 giây đầu:{" "}
                          <strong>{Math.round(video.retention * 1.4)}%</strong>
                        </span>
                      </div>
                      <div className="insight-item">
                        <span className="insight-dot dot-red"></span>
                        <span>
                          Tỷ lệ giữ chân trung bình:{" "}
                          <strong>{video.retention}%</strong>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="chart-empty-state">
                    <TrendingUp size={28} className="empty-chart-icon" />
                    <span className="empty-chart-title">
                      Chưa có dữ liệu tỷ lệ giữ chân
                    </span>
                    <span className="empty-chart-desc">
                      Đường cong Retention sẽ tự động hiển thị khi video phát
                      sinh lượt xem thực tế trên YouTube.
                    </span>
                  </div>
                )}
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-title">
                    <BarChart2 size={17} />
                    <h4>Lượt xem theo từng giờ (48 giờ gần nhất)</h4>
                  </div>
                  <span className="badge-realtime">
                    <span className="pulse-dot"></span> Realtime
                  </span>
                </div>
                {hasViews && hasRealtime ? (
                  <div className="chart-canvas-container mini-chart">
                    <Bar
                      data={realtimeData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                ) : (
                  <div className="chart-empty-state" style={{ minHeight: 140 }}>
                    <BarChart2 size={26} className="empty-chart-icon" />
                    <span className="empty-chart-title">
                      Chưa có lượt xem trong 48 giờ qua
                    </span>
                    <span className="empty-chart-desc">
                      Lượt xem theo từng giờ sẽ hiển thị tại đây khi có tương
                      tác mới.
                    </span>
                  </div>
                )}
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
                {hasViews && hasTraffic ? (
                  <div className="chart-canvas-container doughnut-chart">
                    <Doughnut
                      data={trafficData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "68%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="chart-empty-state">
                    <PieChart size={28} className="empty-chart-icon" />
                    <span className="empty-chart-title">
                      Chưa có dữ liệu nguồn lưu lượng
                    </span>
                    <span className="empty-chart-desc">
                      Dữ liệu nguồn xem (Đề xuất, Tìm kiếm, Duyệt xem) sẽ hiển
                      thị khi có người xem truy cập.
                    </span>
                  </div>
                )}
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
                    <span key={i} className="tag-pill">
                      #{t}
                    </span>
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
