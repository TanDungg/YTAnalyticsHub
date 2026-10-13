// CHANNELS MOCK DATA (CÔ LẬP VÀ ĐỘC LẬP 100% THEO KÊNH)
const CHANNELS_DATA = [
  {
    id: "ch-01",
    name: "Tech Lab Việt Nam",
    handle: "@techlabvn",
    topic: "Đánh giá công nghệ & Thiết bị di động",
    avatar:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    benchmarks: {
      subscribers: "245,000",
      subsTrend: "+2.8K",
      views28d: "1,850,000",
      viewsTrend: "+18.4%",
      avgCtr: 6.4,
      targetCtr: 7.0,
      avgRetention: 42.5,
      targetRetention: 50.0,
      avgDuration: "5m 20s",
    },
    videos: [
      {
        id: "vid-tl-01",
        title:
          "Đánh giá thực tế iPhone 16 Pro Max sau 30 ngày: Đừng mua vội nếu bạn chưa biết điều này!",
        type: "long",
        duration: "14:28",
        durationSeconds: 868,
        publishDate: "02/10/2026",
        status: "Công khai",
        category: "Khoa học & Công nghệ",
        thumb:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
        views: 184500,
        impressions: 1940000,
        ctr: 9.5, // rất cao so với TB 6.4%
        retention: 54.2, // rất cao so với TB 42.5%
        watchTimeHours: 16800,
        avgDurationSec: "7m 50s",
        tags: [
          "iphone 16 pro max",
          "danh gia iphone",
          "tech lab vn",
          "apple 2026",
          "pin iphone 16",
          "camera 4k",
          "ios 18",
        ],
        description:
          "Video chia sẻ trải nghiệm thực tế sau 1 tháng sử dụng iPhone 16 Pro Max làm máy chính. Đánh giá chi tiết thời lượng pin, nhiệt độ khi chơi game nặng và chất lượng quay video 4K 120fps.\n\nCác mốc thời gian trong video:\n00:00 - Mở đầu & Lý do làm video\n02:15 - Thời lượng pin thực tế\n06:40 - Nhiệt độ và hiệu năng\n11:20 - Có nên nâng cấp?",
        traffic: { suggested: 58, search: 26, browse: 12, other: 4 },
        realtime48h: [
          320, 290, 210, 150, 180, 260, 410, 520, 680, 890, 1120, 1250, 1100,
          980, 850, 720, 690, 540, 490, 410, 380, 460, 580, 650,
        ],
      },
      {
        id: "vid-tl-02",
        title:
          "Setup Bàn Làm Việc Công Nghệ Tối Giản 2026: Chi tiết chi phí và món đồ đáng tiền nhất",
        type: "long",
        duration: "11:15",
        durationSeconds: 675,
        publishDate: "25/09/2026",
        status: "Công khai",
        category: "Phong cách sống & Công nghệ",
        thumb:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
        views: 92400,
        impressions: 1250000,
        ctr: 7.4,
        retention: 46.8,
        watchTimeHours: 7200,
        avgDurationSec: "5m 15s",
        tags: [
          "desk setup 2026",
          "ban lam viec toi gian",
          "man hinh 4k",
          "cong nghe",
          "decor phong lam viec",
        ],
        description:
          "Chia sẻ góc làm việc mới được nâng cấp với phong cách Minimalist Dark Mode. Chi tiết danh sách đồ dùng, ghế công thái học, đèn thanh treo màn hình và hệ thống quản lý dây cáp giấu kín.",
        traffic: { suggested: 42, search: 38, browse: 15, other: 5 },
        realtime48h: [
          120, 95, 80, 60, 75, 110, 180, 240, 310, 420, 490, 510, 480, 420, 360,
          300, 280, 220, 190, 160, 150, 190, 230, 270,
        ],
      },
      {
        id: "vid-tl-03",
        title:
          "⚡ Mẹo kéo dài thời lượng Pin trên mọi điện thoại Android cực dễ ai cũng làm được #Shorts",
        type: "shorts",
        duration: "0:58",
        durationSeconds: 58,
        publishDate: "08/10/2026",
        status: "Công khai",
        category: "Mẹo công nghệ",
        thumb:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        views: 312000,
        impressions: 2800000,
        ctr: 11.1,
        retention: 82.5,
        watchTimeHours: 4290,
        avgDurationSec: "0m 48s",
        tags: [
          "meo android",
          "tiet kiem pin",
          "shorts cong nghe",
          "meo vat smartphone",
        ],
        description:
          "Tắt ngay 3 tính năng ngầm này để điện thoại Android của bạn dùng được cả ngày không lo tụt pin nhanh! #shorts #techlab #androidtips",
        traffic: { suggested: 12, search: 5, browse: 8, other: 75 },
        realtime48h: [
          850, 920, 780, 620, 510, 640, 890, 1200, 1650, 2100, 2450, 2600, 2400,
          2150, 1800, 1550, 1400, 1200, 1100, 980, 920, 1100, 1350, 1500,
        ],
      },
      {
        id: "vid-tl-04",
        title:
          "Test Card đồ họa RTX 5080: 4K Ray Tracing mượt không tưởng hay chỉ là thổi phồng?",
        type: "long",
        duration: "18:40",
        durationSeconds: 1120,
        publishDate: "18/09/2026",
        status: "Công khai",
        category: "Khoa học & Công nghệ",
        thumb:
          "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
        views: 64100,
        impressions: 1100000,
        ctr: 5.8, // Thấp hơn TB kênh 6.4% -> Cần đổi thumbnail!
        retention: 48.0,
        watchTimeHours: 6200,
        avgDurationSec: "8m 58s",
        tags: [
          "rtx 5080",
          "danh gia vga",
          "nvidia 2026",
          "pc gaming 4k",
          "benchmark rtx",
        ],
        description:
          "Benchmark chi tiết RTX 5080 trên 10 tựa game AAA nặng nhất hiện nay ở độ phân giải 4K Ultra Settings. So sánh nhiệt độ, mức ăn điện với thế hệ trước.",
        traffic: { suggested: 48, search: 34, browse: 14, other: 4 },
        realtime48h: [
          80, 70, 55, 40, 50, 75, 110, 160, 210, 270, 310, 330, 300, 280, 240,
          210, 190, 160, 140, 120, 110, 130, 150, 170,
        ],
      },
      {
        id: "vid-tl-05",
        title:
          "⚡ So sánh Camera: 200MP của Samsung vs 48MP của iPhone quay đêm ai hơn? #Shorts",
        type: "shorts",
        duration: "0:45",
        durationSeconds: 45,
        publishDate: "05/10/2026",
        status: "Công khai",
        category: "Khoa học & Công nghệ",
        thumb:
          "https://images.unsplash.com/photo-1510519138161-58474ebf8996?w=600&auto=format&fit=crop&q=80",
        views: 188000,
        impressions: 1950000,
        ctr: 9.6,
        retention: 78.0,
        watchTimeHours: 1950,
        avgDurationSec: "0m 35s",
        tags: [
          "camera test",
          "samsung vs iphone",
          "shorts cong nghe",
          "so sanh camera",
        ],
        description:
          "Test chụp đêm không đèn giữa hai máy đầu bảng hiện nay. Bạn thích chất ảnh chân thực hay nịnh mắt hơn? #shorts #cameratest",
        traffic: { suggested: 10, search: 6, browse: 6, other: 78 },
        realtime48h: [
          310, 280, 230, 190, 180, 240, 360, 480, 620, 810, 950, 1020, 980, 870,
          740, 650, 590, 510, 460, 420, 390, 450, 520, 600,
        ],
      },
    ],
  },

  {
    id: "ch-02",
    name: "Bếp Mẹ Bắp - Món Ngon Gia Đình",
    handle: "@bepmebap",
    topic: "Ẩm thực gia đình, Món ngon dân dã 3 miền",
    avatar:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=120&auto=format&fit=crop&q=80",
    benchmarks: {
      subscribers: "88,200",
      subsTrend: "+1.1K",
      views28d: "620,000",
      viewsTrend: "+9.2%",
      avgCtr: 7.8,
      targetCtr: 8.5,
      avgRetention: 51.0,
      targetRetention: 55.0,
      avgDuration: "4m 10s",
    },
    videos: [
      {
        id: "vid-bmb-01",
        title:
          "Bí quyết Nấu Canh Chua Cá Lóc Chuẩn Vị Nam Bộ: Nước dùng trong veo, không tanh chút nào",
        type: "long",
        duration: "08:42",
        durationSeconds: 522,
        publishDate: "04/10/2026",
        status: "Công khai",
        category: "Ẩm thực & Nấu ăn",
        thumb:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        views: 125000,
        impressions: 1380000,
        ctr: 9.1,
        retention: 58.4,
        watchTimeHours: 9400,
        avgDurationSec: "5m 05s",
        tags: [
          "canh chua ca loc",
          "mon ngon mien tay",
          "bep me bap",
          "huong dan nau an",
          "mon ngon gia dinh",
        ],
        description:
          "Hôm nay mẹ Bắp chia sẻ công thức nấu món Canh Chua Cá Lóc truyền thống của gia đình. Mẹo sơ chế cá không tanh bằng muối hột và gừng, nước canh thanh dịu mát lành cho bữa cơm ngày hè.",
        traffic: { suggested: 52, search: 36, browse: 9, other: 3 },
        realtime48h: [
          210, 190, 140, 110, 100, 150, 240, 380, 520, 680, 750, 810, 780, 710,
          620, 540, 490, 420, 370, 310, 290, 350, 420, 490,
        ],
      },
      {
        id: "vid-bmb-02",
        title:
          "Cách Làm Sốt Ướp Thịt Nướng Bất Bại: Thịt mềm mọng nước, để lâu không bị khô",
        type: "long",
        duration: "06:15",
        durationSeconds: 375,
        publishDate: "20/09/2026",
        status: "Công khai",
        category: "Ẩm thực & Nấu ăn",
        thumb:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
        views: 84000,
        impressions: 1100000,
        ctr: 7.6,
        retention: 54.0,
        watchTimeHours: 4900,
        avgDurationSec: "3m 30s",
        tags: [
          "sot uop thit",
          "thit nuong com tam",
          "meo vat nha bep",
          "mon an cuoi tuan",
        ],
        description:
          "Một hũ sốt ướp này có thể dùng cho cả thịt heo, thịt bò và sườn nướng. Có thể bảo quản ngăn mát tủ lạnh dùng dần trong 2 tuần cực kỳ tiện lợi.",
        traffic: { suggested: 44, search: 42, browse: 11, other: 3 },
        realtime48h: [
          90, 80, 65, 50, 55, 80, 130, 190, 260, 340, 390, 410, 380, 340, 300,
          260, 230, 190, 170, 140, 130, 160, 190, 220,
        ],
      },
      {
        id: "vid-bmb-03",
        title:
          "⚡ Mẹo bóc tỏi siêu nhanh 1 bát đầy chỉ trong 10 giây không cần dao #Shorts",
        type: "shorts",
        duration: "0:35",
        durationSeconds: 35,
        publishDate: "07/10/2026",
        status: "Công khai",
        category: "Mẹo vặt bếp",
        thumb:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        views: 245000,
        impressions: 2100000,
        ctr: 11.6,
        retention: 89.0,
        watchTimeHours: 2380,
        avgDurationSec: "0m 31s",
        tags: ["meo boc toi", "shorts nau an", "meo nha bep", "bep me bap"],
        description:
          "Bí quyết bóc tỏi của các đầu bếp nhà hàng. Lưu lại áp dụng ngay nhé các mẹ! #shorts #meonhabep #bepmebap",
        traffic: { suggested: 8, search: 4, browse: 6, other: 82 },
        realtime48h: [
          520, 480, 410, 320, 290, 380, 560, 780, 1100, 1450, 1720, 1890, 1750,
          1580, 1320, 1150, 1020, 890, 780, 690, 640, 750, 920, 1080,
        ],
      },
    ],
  },

  {
    id: "ch-03",
    name: "Daily Humor & Meme Shorts",
    handle: "@dailyhumorvn",
    topic: "Video ngắn hài hước, Tình huống đời thường thú vị",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    benchmarks: {
      subscribers: "520,000",
      subsTrend: "+14.5K",
      views28d: "8,400,000",
      viewsTrend: "+32.1%",
      avgCtr: 11.2,
      targetCtr: 12.0,
      avgRetention: 86.0,
      targetRetention: 90.0,
      avgDuration: "0m 42s",
    },
    videos: [
      {
        id: "vid-dh-01",
        title:
          "⚡ Khi mẹ bảo 'Tao đếm từ 1 đến 3' và phản ứng của đứa con ngoan ngoãn #Shorts",
        type: "shorts",
        duration: "0:42",
        durationSeconds: 42,
        publishDate: "10/10/2026",
        status: "Công khai",
        category: "Giải trí hài hước",
        thumb:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
        views: 1240000,
        impressions: 9800000,
        ctr: 12.6,
        retention: 94.2,
        watchTimeHours: 13500,
        avgDurationSec: "0m 39s",
        tags: [
          "hai huoc",
          "shorts vui nhon",
          "gia dinh",
          "meme viet nam",
          "troll",
        ],
        description:
          "Câu thần chú đáng sợ nhất tuổi thơ của tất cả mọi người! 😂 #shorts #haihuoc #meme",
        traffic: { suggested: 5, search: 2, browse: 3, other: 90 },
        realtime48h: [
          3100, 2800, 2100, 1600, 1400, 1900, 2800, 4200, 5800, 7400, 8900,
          9600, 9100, 8200, 7100, 6200, 5400, 4700, 4100, 3600, 3300, 4100,
          5200, 6100,
        ],
      },
      {
        id: "vid-dh-02",
        title:
          "⚡ Đi xin việc thời kỳ 2026 và câu hỏi phỏng vấn hóc búa của sếp #Shorts",
        type: "shorts",
        duration: "0:52",
        durationSeconds: 52,
        publishDate: "03/10/2026",
        status: "Công khai",
        category: "Giải trí hài hước",
        thumb:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
        views: 890000,
        impressions: 7400000,
        ctr: 12.0,
        retention: 88.5,
        watchTimeHours: 10900,
        avgDurationSec: "0m 46s",
        tags: [
          "phong van xin viec",
          "shorts cong so",
          "tinh huong hai",
          "genz di lam",
        ],
        description:
          "Khi bạn nói bạn có 10 năm kinh nghiệm ở tuổi 22! #shorts #congso #troll",
        traffic: { suggested: 6, search: 3, browse: 4, other: 87 },
        realtime48h: [
          1800, 1600, 1200, 950, 850, 1100, 1700, 2500, 3400, 4300, 5100, 5600,
          5200, 4700, 4100, 3600, 3100, 2700, 2400, 2100, 1900, 2400, 3000,
          3600,
        ],
      },
    ],
  },
];

// STATE MANAGEMENT
let activeChannelId = "ch-01";
let currentFormatFilter = "all";
let currentSort = "recent";
let searchQuery = "";
let selectedVideo = null;

// Chart Instances
let retentionChartInstance = null;
let trafficChartInstance = null;
let realtimeChartInstance = null;

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  renderChannelList();
  loadChannelData(activeChannelId);
  setupEventListeners();
  lucide.createIcons();
});

// 1. RENDER CHANNEL SWITCHER
function renderChannelList() {
  const container = document.getElementById("channelList");
  container.innerHTML = "";

  CHANNELS_DATA.forEach((channel) => {
    const isActive = channel.id === activeChannelId;
    const card = document.createElement("div");
    card.className = `channel-card ${isActive ? "active" : ""}`;
    card.dataset.id = channel.id;

    card.innerHTML = `
      <div class="channel-avatar-wrap">
        <img src="${channel.avatar}" alt="${channel.name}" class="channel-avatar">
        <span class="active-indicator"></span>
      </div>
      <div class="channel-text">
        <div class="channel-name">${channel.name}</div>
        <div class="channel-meta">
          <span>${channel.benchmarks.subscribers} subs</span>
          <span>•</span>
          <span>${channel.videos.length} videos</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      if (activeChannelId !== channel.id) {
        activeChannelId = channel.id;
        renderChannelList();
        loadChannelData(channel.id);
        showToast(`Đã chuyển sang: ${channel.name} (Không gian độc lập)`);
      }
    });

    container.appendChild(card);
  });
}

// 2. LOAD CHANNEL DATA (ISOLATED WORKSPACE)
function loadChannelData(channelId) {
  const channel = CHANNELS_DATA.find((c) => c.id === channelId);
  if (!channel) return;

  // Header Info
  document.getElementById("activeChannelAvatar").src = channel.avatar;
  document.getElementById("activeChannelName").innerText = channel.name;
  document.getElementById("activeChannelHandle").innerText = channel.handle;
  document.getElementById("activeChannelTopic").innerText = channel.topic;
  document.getElementById("lastSyncedText").innerText =
    `Đồng bộ: ${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;

  // Benchmarks
  const bm = channel.benchmarks;
  document.getElementById("bmSubs").innerText = bm.subscribers;
  document.getElementById("bmSubsTrend").innerText = bm.subsTrend;
  document.getElementById("bmViews").innerText = bm.views28d;
  document.getElementById("bmViewsTrend").innerText = bm.viewsTrend;

  document.getElementById("bmAvgCtr").innerText = `${bm.avgCtr}%`;
  document.getElementById("bmAvgCtrTarget").innerText = `${bm.targetCtr}%`;

  document.getElementById("bmAvgRetention").innerText = `${bm.avgRetention}%`;
  document.getElementById("bmAvgRetentionTarget").innerText =
    `${bm.targetRetention}%`;

  // Render Videos
  renderVideos();
}

// 3. RENDER VIDEO GRID
function renderVideos() {
  const channel = CHANNELS_DATA.find((c) => c.id === activeChannelId);
  const grid = document.getElementById("videoGrid");
  const countText = document.getElementById("videoCountText");

  let filtered = [...channel.videos];

  // Format Filter
  if (currentFormatFilter !== "all") {
    filtered = filtered.filter((v) => v.type === currentFormatFilter);
  }

  // Search Filter
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  // Sort Filter
  if (currentSort === "views") {
    filtered.sort((a, b) => b.views - a.views);
  } else if (currentSort === "ctr") {
    filtered.sort((a, b) => b.ctr - a.ctr);
  } else if (currentSort === "retention") {
    filtered.sort((a, b) => b.retention - a.retention);
  }

  countText.innerText = `Đang hiển thị ${filtered.length} / ${channel.videos.length} video của kênh này`;
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
        <i data-lucide="video-off" style="width: 44px; height: 44px; margin-bottom: 14px; display: inline-block; color: var(--neon-cyan);"></i>
        <p style="font-size: 15px; font-weight: 700; color: var(--text-primary);">Không tìm thấy video nào phù hợp</p>
        <p style="font-size: 12px; margin-top: 4px;">Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc định dạng</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  filtered.forEach((vid) => {
    const card = document.createElement("div");
    card.className = "video-card";

    // CTR Comparison with Channel Average
    const ctrDiff = (vid.ctr - channel.benchmarks.avgCtr).toFixed(1);
    const isCtrHigher = ctrDiff >= 0;
    const ctrPill = `<span class="comp-pill ${isCtrHigher ? "higher" : "lower"}">${isCtrHigher ? "+" : ""}${ctrDiff}%</span>`;

    // Retention Comparison with Channel Average
    const retDiff = (vid.retention - channel.benchmarks.avgRetention).toFixed(
      1,
    );
    const isRetHigher = retDiff >= 0;
    const retPill = `<span class="comp-pill ${isRetHigher ? "higher" : "lower"}">${isRetHigher ? "+" : ""}${retDiff}%</span>`;

    card.innerHTML = `
      <div class="card-thumb-wrap">
        <img src="${vid.thumb}" alt="Thumbnail" class="card-thumb" loading="lazy">
        <span class="thumb-type-tag ${vid.type === "shorts" ? "type-shorts" : "type-long"}">
          ${vid.type === "shorts" ? "Shorts ⚡" : "Video dài"}
        </span>
        <span class="thumb-duration">${vid.duration}</span>
      </div>

      <div class="card-body">
        <h4 class="card-title" title="${vid.title}">${vid.title}</h4>
        
        <div class="card-meta-line">
          <span>${vid.publishDate}</span>
          <span>•</span>
          <span>${vid.category}</span>
        </div>

        <div class="card-stats-row">
          <div class="card-stat-item">
            <span class="card-stat-label">Lượt xem</span>
            <div class="card-stat-val">${vid.views.toLocaleString()}</div>
          </div>
          <div class="card-stat-item">
            <span class="card-stat-label">CTR</span>
            <div class="card-stat-val">${vid.ctr}% ${ctrPill}</div>
          </div>
          <div class="card-stat-item">
            <span class="card-stat-label">% Giữ chân</span>
            <div class="card-stat-val">${vid.retention}% ${retPill}</div>
          </div>
          <div class="card-stat-item">
            <span class="card-stat-label">Tổng giờ xem</span>
            <div class="card-stat-val">${vid.watchTimeHours.toLocaleString()}h</div>
          </div>
        </div>

        <div class="card-tags-preview">
          ${vid.tags
            .slice(0, 3)
            .map((tag) => `<span class="tag-badge">#${tag}</span>`)
            .join("")}
          ${vid.tags.length > 3 ? `<span class="tag-badge">+${vid.tags.length - 3}</span>` : ""}
        </div>
      </div>
    `;

    card.addEventListener("click", () => openVideoModal(vid));
    grid.appendChild(card);
  });

  lucide.createIcons();
}

// 4. OPEN CENTERED VIDEO MODAL (LOCK BODY SCROLL)
function openVideoModal(vid) {
  selectedVideo = vid;
  const channel = CHANNELS_DATA.find((c) => c.id === activeChannelId);

  // Populate Basic Metadata
  document.getElementById("insTitle").innerText = vid.title;
  document.getElementById("insThumb").src = vid.thumb;
  document.getElementById("insDuration").innerText = vid.duration;
  document.getElementById("insTypeBadge").innerText =
    vid.type === "shorts" ? "Shorts ⚡" : "Video dài";
  document.getElementById("insPublishDate").innerText = vid.publishDate;
  document.getElementById("insCategory").innerText = vid.category;
  document.getElementById("insVideoId").innerText = vid.id;
  document.getElementById("insDescription").innerText = vid.description;

  // Compute Benchmark Comparisons
  const ctrDiff = (
    ((vid.ctr - channel.benchmarks.avgCtr) / channel.benchmarks.avgCtr) *
    100
  ).toFixed(1);
  const retDiff = (
    ((vid.retention - channel.benchmarks.avgRetention) /
      channel.benchmarks.avgRetention) *
    100
  ).toFixed(1);

  // Diagnosis Banner
  const banner = document.getElementById("insEvalBanner");
  const badge = document.getElementById("insEvalBadge");
  const text = document.getElementById("insEvalText");

  if (
    vid.ctr >= channel.benchmarks.avgCtr &&
    vid.retention >= channel.benchmarks.avgRetention
  ) {
    badge.innerText = "HIỆU SUẤT XUẤT SẮC";
    badge.style.background = "var(--neon-emerald)";
    badge.style.color = "#000";
    banner.style.borderColor = "rgba(52, 211, 153, 0.4)";
    text.innerText = `Cả CTR (+${ctrDiff}%) và Giữ chân người xem (+${retDiff}%) đều vượt chuẩn của kênh. Thuật toán YouTube đang đề xuất rất tích cực video này.`;
  } else if (
    vid.retention >= channel.benchmarks.avgRetention &&
    vid.ctr < channel.benchmarks.avgCtr
  ) {
    badge.innerText = "TIỀM NĂNG - CẦN ĐỔI THUMBNAIL";
    badge.style.background = "var(--neon-amber)";
    badge.style.color = "#000";
    banner.style.borderColor = "rgba(251, 191, 36, 0.4)";
    text.innerText = `Nội dung giữ chân người xem rất tốt (+${retDiff}%), nhưng CTR thấp hơn chuẩn kênh (${ctrDiff}%). Thay đổi Thumbnail hoặc Tiêu đề hấp dẫn hơn sẽ giúp video bùng nổ view!`;
  } else if (
    vid.ctr >= channel.benchmarks.avgCtr &&
    vid.retention < channel.benchmarks.avgRetention
  ) {
    badge.innerText = "CẨN THẬN CLICKBAIT";
    badge.style.background = "var(--yt-red)";
    badge.style.color = "#fff";
    banner.style.borderColor = "rgba(255, 0, 51, 0.4)";
    text.innerText = `CTR cao (+${ctrDiff}%) chứng tỏ Thumbnail hấp dẫn, nhưng người xem thoát sớm (${retDiff}% so với chuẩn). Cần kiểm tra lại đoạn mở đầu (Hook) của video.`;
  } else {
    badge.innerText = "DƯỚI MỨC TRUNG BÌNH";
    badge.style.background = "var(--text-muted)";
    badge.style.color = "#fff";
    banner.style.borderColor = "var(--border-subtle)";
    text.innerText = `Cả tỉ lệ click lẫn thời gian giữ chân đều chưa đạt ngưỡng trung bình của kênh. Cần tối ưu lại chủ đề cho các video sau.`;
  }

  // Populate 4 KPI Metrics
  document.getElementById("insViews").innerText = vid.views.toLocaleString();
  document.getElementById("insViewsComp").innerText =
    `${(vid.views / 1000).toFixed(1)}K lượt xem thực tế`;

  document.getElementById("insCtr").innerText = `${vid.ctr}%`;
  const ctrCompEl = document.getElementById("insCtrComp");
  ctrCompEl.innerText = `${ctrDiff >= 0 ? "+" : ""}${ctrDiff}% so với chuẩn kênh (${channel.benchmarks.avgCtr}%)`;
  ctrCompEl.className = `kpi-comp ${ctrDiff >= 0 ? "" : "neg"}`;

  document.getElementById("insRetention").innerText = `${vid.retention}%`;
  const retCompEl = document.getElementById("insRetentionComp");
  retCompEl.innerText = `${retDiff >= 0 ? "+" : ""}${retDiff}% so với chuẩn kênh (${channel.benchmarks.avgRetention}%)`;
  retCompEl.className = `kpi-comp ${retDiff >= 0 ? "" : "neg"}`;

  document.getElementById("insWatchTime").innerText =
    `${vid.watchTimeHours.toLocaleString()}h`;
  document.getElementById("insAvgDuration").innerText =
    `AVD: ${vid.avgDurationSec}`;

  // Funnel
  renderFunnel(vid);

  // Tags
  const tagsContainer = document.getElementById("insTagsContainer");
  document.getElementById("tagCount").innerText = vid.tags.length;
  tagsContainer.innerHTML = vid.tags
    .map((t) => `<span class="tag-pill">#${t}</span>`)
    .join("");

  // Render Charts
  renderCharts(vid, channel);

  // Open Modal & LOCK BODY SCROLL
  document.body.classList.add("modal-open");
  const backdrop = document.getElementById("modalBackdrop");
  backdrop.classList.add("open");

  lucide.createIcons();
}

// CLOSE MODAL & UNLOCK BODY SCROLL
function closeVideoModal() {
  document.body.classList.remove("modal-open");
  const backdrop = document.getElementById("modalBackdrop");
  backdrop.classList.remove("open");
}

// 5. RENDER FUNNEL
function renderFunnel(vid) {
  const container = document.getElementById("funnelContainer");
  const impressions = vid.impressions;
  const views = vid.views;
  const watchTimeHours = vid.watchTimeHours;

  container.innerHTML = `
    <div class="funnel-step">
      <span class="funnel-name">Lượt hiển thị</span>
      <div class="funnel-val">${(impressions / 1000000).toFixed(2)}M</div>
      <div class="funnel-rate">100% người thấy</div>
    </div>
    <div class="funnel-step">
      <span class="funnel-name">Tỷ lệ Click (CTR)</span>
      <div class="funnel-val">${vid.ctr}%</div>
      <div class="funnel-rate">Quyết định xem</div>
    </div>
    <div class="funnel-step">
      <span class="funnel-name">Lượt xem (Views)</span>
      <div class="funnel-val">${(views / 1000).toFixed(1)}K</div>
      <div class="funnel-rate">Vào video</div>
    </div>
    <div class="funnel-step">
      <span class="funnel-name">Tổng giờ xem</span>
      <div class="funnel-val">${watchTimeHours.toLocaleString()}h</div>
      <div class="funnel-rate">Tích lũy thực tế</div>
    </div>
  `;
}

// 6. RENDER CHARTS
function renderCharts(vid, channel) {
  // A. Retention Curve
  const retentionCanvas = document
    .getElementById("retentionChart")
    .getContext("2d");
  if (retentionChartInstance) retentionChartInstance.destroy();

  const labels = [
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
  const decayRate = (100 - vid.retention) / 50;

  const videoData = [
    100,
    Math.round(85 - decayRate * 2),
    Math.round(76 - decayRate * 4),
    Math.round(68 - decayRate * 5),
    Math.round(62 - decayRate * 6),
    Math.round(vid.retention + 4),
    Math.round(vid.retention),
    Math.round(vid.retention - 4),
    Math.round(vid.retention - 8),
    Math.round(vid.retention - 12),
    Math.round(vid.retention - 16),
  ];

  const channelAvgLine = labels.map(() => channel.benchmarks.avgRetention);

  retentionChartInstance = new Chart(retentionCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Video này",
          data: videoData,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56, 189, 248, 0.12)",
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: "#38bdf8",
        },
        {
          label: `Chuẩn kênh (${channel.benchmarks.avgRetention}%)`,
          data: channelAvgLine,
          borderColor: "rgba(255, 255, 255, 0.3)",
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#94a3b8",
            font: { size: 11, family: "Plus Jakarta Sans" },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ` ${ctx.dataset.label}: ${ctx.raw}% người xem còn ở lại`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#64748b", font: { size: 10 } },
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: {
            color: "#64748b",
            callback: (v) => `${v}%`,
            font: { size: 10 },
          },
        },
      },
    },
  });

  document.getElementById("retentionInsights").innerHTML = `
    <div class="insight-item">
      <span class="insight-dot dot-green"></span>
      <span>Tỷ lệ xem 30 giây đầu: <strong>76%</strong> (Khởi đầu rất tốt)</span>
    </div>
    <div class="insight-item">
      <span class="insight-dot dot-red"></span>
      <span>Điểm tụt view mạnh nhất: <strong>ở mốc 60%</strong> (Đoạn chuyển tiếp nội dung)</span>
    </div>
  `;

  // B. Traffic Sources Doughnut
  const trafficCanvas = document
    .getElementById("trafficChart")
    .getContext("2d");
  if (trafficChartInstance) trafficChartInstance.destroy();

  trafficChartInstance = new Chart(trafficCanvas, {
    type: "doughnut",
    data: {
      labels: [
        "Đề xuất (Suggested)",
        "Tìm kiếm (Search)",
        "Duyệt xem (Browse)",
        "Khác / Shorts Feed",
      ],
      datasets: [
        {
          data: [
            vid.traffic.suggested,
            vid.traffic.search,
            vid.traffic.browse,
            vid.traffic.other,
          ],
          backgroundColor: ["#ff0033", "#38bdf8", "#34d399", "#c084fc"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#94a3b8",
            font: { size: 10 },
            boxWidth: 10,
            padding: 10,
          },
        },
      },
    },
  });

  // C. Realtime 48h
  const realtimeCanvas = document
    .getElementById("realtimeChart")
    .getContext("2d");
  if (realtimeChartInstance) realtimeChartInstance.destroy();

  const hoursLabels = Array.from({ length: 24 }, (_, i) => `${24 - i}h trước`);

  realtimeChartInstance = new Chart(realtimeCanvas, {
    type: "bar",
    data: {
      labels: hoursLabels,
      datasets: [
        {
          label: "Lượt xem / giờ",
          data: vid.realtime48h,
          backgroundColor: "rgba(56, 189, 248, 0.75)",
          hoverBackgroundColor: "#38bdf8",
          borderRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.raw} lượt xem`,
          },
        },
      },
      scales: {
        x: { display: false },
        y: {
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#64748b", font: { size: 9 } },
        },
      },
    },
  });
}

// 7. EVENT LISTENERS
function setupEventListeners() {
  // Format filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFormatFilter = btn.dataset.format;
      renderVideos();
    });
  });

  // Search input
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderVideos();
  });

  // Keyboard shortcut Ctrl+K
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
    }
    // ESC key closes modal
    if (e.key === "Escape") {
      closeVideoModal();
    }
  });

  // Sort dropdown
  const sortSelect = document.getElementById("sortSelect");
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderVideos();
  });

  // Close Modal buttons & backdrop click
  document
    .getElementById("btnCloseModal")
    .addEventListener("click", closeVideoModal);
  document.getElementById("modalBackdrop").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalBackdrop")) {
      closeVideoModal();
    }
  });

  // Copy Tags
  document.getElementById("btnCopyTags").addEventListener("click", () => {
    if (selectedVideo && selectedVideo.tags.length > 0) {
      const text = selectedVideo.tags.join(", ");
      navigator.clipboard.writeText(text).then(() => {
        showToast(
          `Đã sao chép ${selectedVideo.tags.length} thẻ tags vào clipboard!`,
        );
      });
    }
  });

  // Refresh
  document.getElementById("btnRefresh").addEventListener("click", () => {
    showToast("Đang đồng bộ số liệu mới nhất từ YouTube Data API...");
    setTimeout(() => {
      loadChannelData(activeChannelId);
      showToast("Đồng bộ hoàn tất! Số liệu mới nhất đã sẵn sàng.");
    }, 700);
  });

  // Add channel button mock
  document.getElementById("btnAddChannel").addEventListener("click", () => {
    showToast("Mở giao diện Google OAuth 2.0 cấp quyền đọc (Read-only)...");
  });
}

// 8. TOAST NOTIFICATION UTILITY
function showToast(msg) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  toastMsg.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}
