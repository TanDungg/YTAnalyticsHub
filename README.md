---
title: YTAnalyticsHub
emoji: 🎬
colorFrom: red
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
---
# 🚀 YouTube Multi-Channel Analytics Hub (Fullstack)

Hệ thống quản lý và phân tích chuyên sâu hiệu quả video YouTube đa kênh với kiến trúc **cô lập không gian làm việc độc lập 100% theo từng kênh**, tích hợp trực tiếp **Google OAuth 2.0 & YouTube Data API v3**.

---

## 📁 Cấu trúc Dự án

```
yt-multi-channel-analytics/
├── backend/                  # Node.js + Express API Server (Cổng 5000)
│   ├── src/
│   │   ├── config/google.js  # Cấu hình OAuth 2.0 Client & Scopes
│   │   ├── services/         # Gọi YouTube Data API v3 & Analytics API
│   │   ├── routes/           # Auth routes & Channel routes
│   │   ├── db/store.js       # JSON Database lưu kênh & token
│   │   └── server.js         # Khởi chạy Express Server
│   ├── .env.example          # Mẫu cấu hình môi trường
│   └── package.json
│
├── frontend/                 # React 18 + Vite Dashboard (Cổng 5173)
│   ├── src/
│   │   ├── components/       # Các React components modular
│   │   ├── services/api.js   # Kết nối Backend API
│   │   ├── App.jsx           # Quản lý state toàn cục
│   │   └── index.css         # Dark Carbon Theme cao cấp
│   ├── vite.config.js
│   └── package.json
│
├── package.json              # Chạy song song cả Frontend và Backend
└── README.md
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Nhanh

### Bước 1: Cài đặt Dependencies cho cả 2 phần
Mở Terminal tại thư mục gốc của dự án và chạy:
```powershell
# Cài đặt thư viện cho root, backend và frontend:
npm install
npm install --prefix backend
npm install --prefix frontend
```

---

### Bước 2: Cấu hình Google Cloud Console (Để kết nối kênh YouTube thật)

1. Truy cập vào [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một **Project mới** (ví dụ: `yt-analytics-hub`).
3. Vào mục **APIs & Services > Library**, tìm kiếm và bấm **Enable** (Bật) 2 API:
   - **YouTube Data API v3**
   - **YouTube Analytics API**
4. Vào mục **APIs & Services > OAuth consent screen**:
   - Chọn loại **External**.
   - Điền App name, User support email.
   - Thêm Scopes: `https://www.googleapis.com/auth/youtube.readonly` và `https://www.googleapis.com/auth/yt-analytics.readonly`.
   - Tại mục **Test users**, thêm email Google của bạn (email đang quản lý kênh YouTube).
5. Vào mục **APIs & Services > Credentials**:
   - Bấm **Create Credentials > OAuth client ID**.
   - Application type: Chọn **Web application**.
   - Name: `YT Analytics Web Client`.
   - **Authorized redirect URIs**: Thêm chính xác:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Bấm **Create** và copy lại **Client ID** và **Client Secret**.

6. Tạo file cấu hình môi trường trong backend:
   - Nhân bản file `backend/.env.example` thành `backend/.env`.
   - Điền thông tin vừa tạo:
     ```env
     PORT=5000
     CLIENT_URL=http://localhost:5173
     GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your_client_secret
     GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
     ```

---

### Bước 3: Khởi chạy dự án

Từ thư mục gốc, chỉ cần chạy một lệnh duy nhất:
```powershell
npm run dev
```

* **Frontend:** Tự động chạy tại: `http://localhost:5173`
* **Backend:** Tự động chạy tại: `http://localhost:5000`

> **Lưu ý hữu ích:** Khi bạn chưa điền Google Credentials, hệ thống đã nạp sẵn **dữ liệu mẫu độc lập của 2 kênh (Tech Lab VN & Bếp Mẹ Bắp)** để bạn phát triển giao diện và kiểm thử tính năng ngay lập tức mà không sợ lỗi! Khi bạn bấm "Thêm kênh liên kết" và đăng nhập tài khoản Google của mình, kênh thật sẽ được nạp trực tiếp vào hệ thống.
