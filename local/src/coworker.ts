import { spawn }          from 'child_process';
import { writeFileSync }  from 'fs';
import { join }           from 'path';
import mongoose           from 'mongoose';

// ── Models ────────────────────────────────────────────────────────────────────

const ArticleRequestSchema = new mongoose.Schema(
  { testo: String, pubblica: Boolean, status: String },
  { collection: 'article-requests' }
);
const ArticleRequest = mongoose.models['ArticleRequest']
  ?? mongoose.model('ArticleRequest', ArticleRequestSchema);

const WorkflowLogSchema = new mongoose.Schema(
  {
    articleRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArticleRequest' },
    testoPreview: String, step: String, actor: String, message: String, requestStatus: String,
  },
  { timestamps: true, collection: 'workflow-logs' }
);
const WorkflowLog = mongoose.models['WorkflowLog']
  ?? mongoose.model('WorkflowLog', WorkflowLogSchema);

// ── Helpers ───────────────────────────────────────────────────────────────────

const SEPARATOR = '===== NUOVO ARTICOLO =====';
const PREVIEW   = 80;

async function log(
  id: string, step: string, message: string, requestStatus?: string
): Promise<void> {
  try {
    const req = await ArticleRequest.findById(id).select('testo status');
    if (!req) return;
    const testo        = req.testo as string;
    const testoPreview = testo.slice(0, PREVIEW) + (testo.length > PREVIEW ? '…' : '');
    const status       = requestStatus ?? req.status;
    await WorkflowLog.create({
      articleRequestId: new mongoose.Types.ObjectId(id),
      testoPreview, step, actor: 'local', message, requestStatus: status,
    });
    if (requestStatus) await ArticleRequest.findByIdAndUpdate(id, { status: requestStatus });
  } catch (err) {
    console.error('[Coworker] Errore log MongoDB:', err);
  }
}

async function markAll(ids: string[], status: string): Promise<void> {
  await ArticleRequest.updateMany({ _id: { $in: ids } }, { status });
}

async function notifyTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
  } catch (err) {
    console.error('[Coworker] Errore notifica Telegram:', err);
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function spawnCoworker(ids: string[], pubblica: boolean): Promise<void> {
  const requests = await ArticleRequest.find({ _id: { $in: ids } });
  if (requests.length === 0) {
    console.error('[Coworker] Nessuna ArticleRequest trovata.');
    return;
  }

  const coworkPath = process.env.COWORK_PROJECT_PATH || process.cwd();
  const inputFile  = join(coworkPath, 'input_articoli.md');

  // 1. Scrivi input_articoli.md con tutte le tracce
  const inputContent = requests
    .map((r) => `${SEPARATOR}\narticleRequestId ${r._id.toString()}\n\n${r.testo}`)
    .join('\n\n');
  writeFileSync(inputFile, inputContent, 'utf-8');
  console.log(`[Coworker] ${requests.length} tracce scritte su ${inputFile}`);

  // 2. Log + marca processing
  await markAll(ids, 'processing');
  await Promise.all(ids.map((id) =>
    log(id, 'coworker_started', `Batch avviato — ${ids.length} articolo/i`, 'processing')
  ));

  // 3. Prompt
  const prompt = pubblica
    ? 'Leggi le tracce in input_articoli.md, genera gli articoli e pubblicali sul blog.'
    : 'Leggi le tracce in input_articoli.md e genera gli articoli (non pubblicare).';

  console.log(`[Coworker] Avvio Claude Code per ${ids.length} articoli (pubblica: ${pubblica})...`);
  console.log(`[Coworker] Prompt: ${prompt}`);

  const proc = spawn('claude', ['--print', '--dangerously-skip-permissions'], {
    shell: true,
    cwd:   coworkPath,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  proc.stdin?.write(prompt + '\n');
  proc.stdin?.end();

  proc.stdout.on('data', (chunk) => { process.stdout.write(chunk); });
  proc.stderr.on('data', (chunk) => { process.stderr.write(chunk); });

  proc.on('close', async (code) => {
    if (code === 0) {
      await markAll(ids, 'done');
      await Promise.all(ids.map((id) =>
        log(id, 'coworker_done', 'Claude Code completato con successo', 'done')
      ));
      const msg = pubblica
        ? `✅ Completato e pubblicato — ${ids.length} articolo/i generati e pubblicati.`
        : `✅ Completato — ${ids.length} articolo/i generati (non pubblicati).`;
      console.log(`[Coworker] ${msg}`);
      await notifyTelegram(msg);
    } else {
      await markAll(ids, 'error');
      await Promise.all(ids.map((id) =>
        log(id, 'coworker_error', `Claude Code terminato con codice ${code}`, 'error')
      ));
      const msg = `❌ Errore — Claude Code terminato con codice ${code} (${ids.length} articolo/i).`;
      console.error(`[Coworker] ${msg}`);
      await notifyTelegram(msg);
    }
  });

  proc.on('error', async (err) => {
    await markAll(ids, 'error');
    await Promise.all(ids.map((id) =>
      log(id, 'coworker_error', `Errore spawn: ${err.message}`, 'error')
    ));
    const msg = `❌ Errore avvio Claude Code: ${err.message}`;
    console.error(`[Coworker] ${msg}`);
    await notifyTelegram(msg);
  });
}
