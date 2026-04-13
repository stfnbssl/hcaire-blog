import 'dotenv/config';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import { spawnCoworker } from './coworker.js';

const WorkflowLogSchema = new mongoose.Schema(
  {
    articleRequestId: { type: mongoose.Schema.Types.ObjectId },
    testoPreview: String, step: String, actor: String, message: String, requestStatus: String,
  },
  { timestamps: true, collection: 'workflow-logs' }
);
const WorkflowLog = mongoose.models['WorkflowLog']
  ?? mongoose.model('WorkflowLog', WorkflowLogSchema);

async function logRedisReceived(ids: string[]): Promise<void> {
  const ArticleRequest = mongoose.models['ArticleRequest'];
  if (!ArticleRequest) return;
  for (const id of ids) {
    try {
      const req = await ArticleRequest.findById(id).select('testo status');
      if (!req) continue;
      const testoPreview = (req.testo as string).slice(0, 80) + ((req.testo as string).length > 80 ? '…' : '');
      await WorkflowLog.create({
        articleRequestId: new mongoose.Types.ObjectId(id),
        testoPreview, step: 'redis_published', actor: 'local',
        message: 'Notifica Redis ricevuta da local', requestStatus: req.status,
      });
    } catch { /* non bloccare il flusso */ }
  }
}

const CHANNEL_ARTICLE_NEW = 'article:new';

async function connectMongo(): Promise<void> {
  const password = process.env.MONGODB_PASSWORD!;
  const url      = process.env.MONGODB_URL!.replace('{password}', password).replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
  console.log('[MongoDB] Connected');
}

function createRedisSubscriber(): Redis {
  const sub = new Redis({
    host:              process.env.REDIS_HOST!,
    port:              parseInt(process.env.REDIS_PORT || '11976', 10),
    password:          process.env.REDIS_PASSWORD!,
    retryStrategy:     (times) => Math.min(times * 500, 5000), // riconnette automaticamente
    maxRetriesPerRequest: null,
  });
  sub.on('connect',     () => console.log('[Redis] Subscriber connected'));
  sub.on('reconnecting',() => console.log('[Redis] Reconnecting...'));
  sub.on('error',       (err) => console.error('[Redis] Error:', err.message));
  return sub;
}

async function main(): Promise<void> {
  await connectMongo();

  const sub = createRedisSubscriber();

  sub.on('message', async (_channel, message) => {
    try {
      const { ids, pubblica } = JSON.parse(message) as { ids: string[]; pubblica: boolean };
      console.log(`[Local] Batch ricevuto: ${ids.length} articoli (pubblica: ${pubblica})`);
      await logRedisReceived(ids);
      await spawnCoworker(ids, pubblica);
    } catch (err) {
      console.error('[Local] Errore elaborazione messaggio:', err);
    }
  });

  await sub.subscribe(CHANNEL_ARTICLE_NEW);
  console.log(`[Local] In ascolto su canale Redis "${CHANNEL_ARTICLE_NEW}"...`);
}

main().catch((err) => {
  console.error('[Local] Errore avvio:', err);
  process.exit(1);
});
