import 'dotenv/config';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import { spawnCoworker } from './coworker.js';

const CHANNEL_ARTICLE_NEW = 'article:new';

async function connectMongo(): Promise<void> {
  const password = process.env.MONGODB_PASSWORD!;
  const url      = process.env.MONGODB_URL!.replace('{password}', password).replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
  console.log('[MongoDB] Connected');
}

function createRedisSubscriber(): Redis {
  const sub = new Redis({
    host:     process.env.REDIS_HOST!,
    port:     parseInt(process.env.REDIS_PORT || '11976', 10),
    password: process.env.REDIS_PASSWORD!,
  });
  sub.on('connect', () => console.log('[Redis] Subscriber connected'));
  sub.on('error',   (err) => console.error('[Redis] Error:', err.message));
  return sub;
}

async function main(): Promise<void> {
  await connectMongo();

  const sub = createRedisSubscriber();
  await sub.subscribe(CHANNEL_ARTICLE_NEW);
  console.log(`[Local] In ascolto su canale Redis "${CHANNEL_ARTICLE_NEW}"...`);

  sub.on('message', async (_channel, message) => {
    try {
      const { id, pubblica } = JSON.parse(message) as { id: string; pubblica: boolean };
      console.log(`[Local] Nuova ArticleRequest ricevuta: ${id} (pubblica: ${pubblica})`);
      await spawnCoworker(id, pubblica);
    } catch (err) {
      console.error('[Local] Errore elaborazione messaggio:', err);
    }
  });
}

main().catch((err) => {
  console.error('[Local] Errore avvio:', err);
  process.exit(1);
});
