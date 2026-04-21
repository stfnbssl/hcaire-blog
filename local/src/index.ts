import 'dotenv/config';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import { spawnCoworker } from './coworker.js';
import { processBartlebyTrace } from './bartlebyWorker.js';

const WorkflowLogSchema = new mongoose.Schema(
  {
    articleRequestId: { type: mongoose.Schema.Types.ObjectId },
    traceId:          String,
    testoPreview:     String,
    workflow_type:    { type: String, default: 'article' },
    step: String, actor: String, message: String, requestStatus: String,
  },
  { timestamps: true, collection: 'workflow-logs' }
);
const WorkflowLog = mongoose.models['WorkflowLog']
  ?? mongoose.model('WorkflowLog', WorkflowLogSchema);

const InputTraceSchema = new mongoose.Schema(
  { raw_text: String, status: String },
  { collection: 'bartleby_input_traces' }
);
const InputTrace = mongoose.models['LocalInputTrace']
  ?? mongoose.model('LocalInputTrace', InputTraceSchema);

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

const CHANNEL_ARTICLE_NEW        = 'article:new';
const CHANNEL_BARTLEBY_TRACE_NEW = 'bartleby:trace:new';

async function logBartlebyReceived(traceId: string): Promise<void> {
  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(traceId);
    const trace = await InputTrace.findOne(
      isObjectId
        ? { _id: new mongoose.Types.ObjectId(traceId) }
        : { bartlebyId: traceId }
    ).select('raw_text status').lean() as { raw_text?: string; status?: string } | null;

    const raw          = trace?.raw_text ?? '';
    const testoPreview = raw.length > 80 ? raw.slice(0, 80) + '…' : raw;

    await WorkflowLog.create({
      traceId,
      testoPreview,
      workflow_type:  'bartleby',
      step:           'worker_started',
      actor:          'worker',
      message:        'Messaggio Redis ricevuto — elaborazione avviata',
      requestStatus:  'processing',
    });

    await InputTrace.updateOne(
      isObjectId ? { _id: new mongoose.Types.ObjectId(traceId) } : { bartlebyId: traceId },
      { status: 'processing' }
    );
  } catch (err) {
    console.error('[Local] Errore log Bartleby ricevuto:', err);
  }
}

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

  sub.on('message', async (channel, message) => {
    try {
      if (channel === CHANNEL_ARTICLE_NEW) {
        const { ids, pubblica } = JSON.parse(message) as { ids: string[]; pubblica: boolean };
        console.log(`[Local] Batch articoli ricevuto: ${ids.length} (pubblica: ${pubblica})`);
        await logRedisReceived(ids);
        await spawnCoworker(ids, pubblica);
      } else if (channel === CHANNEL_BARTLEBY_TRACE_NEW) {
        const payload = JSON.parse(message) as {
          traceId: string; userId?: string; outputType?: string; areaId?: string;
        };
        console.log(`[Local] Traccia Bartleby ricevuta: ${payload.traceId}`);
        await logBartlebyReceived(payload.traceId);
        processBartlebyTrace(payload).catch((err) => {
          console.error('[Local] Errore processBartlebyTrace:', err);
        });
      }
    } catch (err) {
      console.error('[Local] Errore elaborazione messaggio:', err);
    }
  });

  await sub.subscribe(CHANNEL_ARTICLE_NEW, CHANNEL_BARTLEBY_TRACE_NEW);
  console.log(`[Local] In ascolto su: "${CHANNEL_ARTICLE_NEW}", "${CHANNEL_BARTLEBY_TRACE_NEW}"`);
}

main().catch((err) => {
  console.error('[Local] Errore avvio:', err);
  process.exit(1);
});
