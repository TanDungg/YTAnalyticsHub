import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import channelRoutes from './routes/channelRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration (hỗ trợ cả chạy local lẫn trên domain Hugging Face)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    service: "YouTube Multi-Channel Analytics Backend",
    timestamp: new Date().toISOString()
  });
});

// Phục vụ giao diện Frontend (Hỗ trợ chạy Docker trên Hugging Face Spaces)
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Backend API đang chạy tại cổng: ${PORT}`);
  console.log(`📡 URL kết nối: http://localhost:${PORT}`);
  console.log(`=================================================`);
});