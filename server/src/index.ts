import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import contentRoutes from './routes/content';
import navRoutes from './routes/nav';
import authRoutes from './routes/auth';
import { startTelegramBot } from './services/telegramBot';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3018;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/contents',   contentRoutes);
app.use('/api/navigation', navRoutes);
app.use('/api',            authRoutes);

app.get('/health', (_req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting
  res.json({ status: 'ok', db: dbState === 1 ? 'connected' : 'connecting', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDB()
  .then(() => {
    startTelegramBot();
  })
  .catch((err) => {
    console.error('Startup error:', err);
    process.exit(1);
  });
