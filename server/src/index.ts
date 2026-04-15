import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db';
import contentRoutes from './routes/content';
import navRoutes from './routes/nav';
import authRoutes from './routes/auth';
import articleRequestRoutes from './routes/articleRequests';
import webhookRoutes from './routes/webhooks';
import subscriptionRoutes from './routes/subscriptions';
import siteConfigRoutes from './routes/siteConfig';
import { startTelegramBot } from './services/telegramBot';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Log variabili critiche presenti (senza valori)
const requiredVars = ['MONGODB_PASSWORD', 'MONGODB_URL', 'CLERK_SECRET_KEY'];
requiredVars.forEach((v) => {
  console.log(`[Env] ${v}: ${process.env[v] ? 'SET' : 'MISSING'}`);
});

const app  = express();
const PORT = process.env.PORT || 3018;

// Health check PRIMA di qualsiasi middleware — non richiede auth
app.get('/health', (_req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting
  res.json({ status: 'ok', db: dbState === 1 ? 'connected' : 'connecting', timestamp: new Date().toISOString() });
});

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));

// CRITICAL: webhook route BEFORE express.json() — needs raw body
app.use('/webhooks', webhookRoutes);

app.use(clerkMiddleware());

app.use(express.json({ limit: '10mb' }));

app.use('/api/contents',         contentRoutes);
app.use('/api/navigation',       navRoutes);
app.use('/api/article-requests', articleRequestRoutes);
app.use('/api/subscriptions',    subscriptionRoutes);
app.use('/api/site-config',      siteConfigRoutes);
app.use('/api',                  authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDB()
  .then(() => {
    try {
      startTelegramBot();
    } catch (err) {
      console.error('[Startup] Telegram bot non avviato:', err);
    }
  })
  .catch((err) => {
    console.error('Startup error (DB):', err);
    process.exit(1);
  });
