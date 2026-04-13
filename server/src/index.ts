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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  startTelegramBot();
});
