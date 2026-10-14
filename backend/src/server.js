import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import { isSupabaseConfigured, supabase, supabaseUrl, supabaseKey } from './db/supabase.js';

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

app.get('/api/health', async (req, res) => {
  let sbTest = null;
  let sbError = null;
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('channels').select('id, name');
      sbTest = data;
      sbError = error ? error.message : null;
    } catch (e) {
      sbError = e.message;
    }
  }
  res.json({
    status: "ok",
    service: "YouTube Multi-Channel Analytics Backend",
    isSupabaseConfigured: isSupabaseConfigured(),
    supabaseTestCount: sbTest ? sbTest.length : null,
    supabaseError: sbError,
    supabaseUrlUsed: supabaseUrl,
    supabaseKeyPrefix: supabaseKey ? supabaseKey.substring(0, 10) : null,
    supabaseKeyLength: supabaseKey ? supabaseKey.length : 0,
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

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Backend API đang chạy tại cổng: ${PORT}`);
  console.log(`📡 URL kết nối: http://localhost:${PORT}`);
  console.log(`=================================================`);
});