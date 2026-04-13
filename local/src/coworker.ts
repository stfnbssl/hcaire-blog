import { spawn }                    from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join }                     from 'path';
import mongoose                     from 'mongoose';

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
    testoPreview:     String,
    step:             String,
    actor:            String,
    message:          String,
    requestStatus:    String,
  },
  { timestamps: true, collection: 'workflow-logs' }
);
const WorkflowLog = mongoose.models['WorkflowLog']
  ?? mongoose.model('WorkflowLog', WorkflowLogSchema);

// ── Helpers ───────────────────────────────────────────────────────────────────

const SEPARATOR = '===== NUOVO ARTICOLO =====';
const PREVIEW   = 80;

async function log(
  id: string,
  step: string,
  message: string,
  requestStatus?: string
): Promise<void> {
  try {
    const req = await ArticleRequest.findById(id).select('testo status');
    if (!req) return;
    const testoPreview = (req.testo as string).slice(0, PREVIEW) + ((req.testo as string).length > PREVIEW ? '…' : '');
    const status = requestStatus ?? req.status;
    await WorkflowLog.create({
      articleRequestId: new mongoose.Types.ObjectId(id),
      testoPreview,
      step,
      actor: 'local',
      message,
      requestStatus: status,
    });
    if (requestStatus) {
      await ArticleRequest.findByIdAndUpdate(id, { status: requestStatus });
    }
  } catch (err) {
    console.error('[Coworker] Errore log MongoDB:', err);
  }
}

async function markAll(ids: string[], status: string): Promise<void> {
  await ArticleRequest.updateMany({ _id: { $in: ids } }, { status });
}

interface ArticleOutput {
  articleRequestId?: string;
  slug: string;
  titolo: string;
  descrizione: string;
  contenuto: string;
  autore?: string;
  categoria?: string;
  tags?: string[];
  isPublished?: boolean;
  isPinned?: boolean;
}

async function publishArticles(
  outputFile: string,
  ids: string[],
  pubblica: boolean
): Promise<void> {
  if (!existsSync(outputFile)) {
    console.warn('[Coworker] output_articoli.json non trovato, pubblicazione saltata.');
    await Promise.all(ids.map((id) => log(id, 'coworker_error', 'output_articoli.json non trovato', 'error')));
    return;
  }

  let articles: ArticleOutput[] = [];
  try {
    articles = JSON.parse(readFileSync(outputFile, 'utf-8'));
    if (!Array.isArray(articles)) articles = [articles];
  } catch (err) {
    console.error('[Coworker] Errore parsing output_articoli.json:', err);
    await Promise.all(ids.map((id) => log(id, 'coworker_error', 'Errore parsing output JSON', 'error')));
    return;
  }

  const apiUrl = process.env.API_URL!;
  const apiKey = process.env.COWORK_API_KEY!;

  for (const article of articles) {
    const requestId = article.articleRequestId ?? ids[articles.indexOf(article)] ?? ids[0];
    try {
      const body = { ...article, isPublished: pubblica, articleRequestId: requestId };
      const res  = await fetch(`${apiUrl}/contents/import`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body:    JSON.stringify(body),
      });
      if (res.ok) {
        console.log(`[Coworker] Articolo pubblicato: ${article.slug}`);
        await log(requestId, 'article_published', `Articolo pubblicato: "${article.titolo}"`, 'done');
      } else {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        console.error(`[Coworker] Errore pubblicazione ${article.slug}:`, err);
        await log(requestId, 'coworker_error', `Errore pubblicazione: ${JSON.stringify(err)}`, 'error');
      }
    } catch (err) {
      console.error('[Coworker] Errore fetch pubblicazione:', err);
      await log(requestId, 'coworker_error', `Errore rete pubblicazione: ${err}`, 'error');
    }
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
  const outputFile = join(coworkPath, 'output_articoli.json');

  // Scrivi input_articoli.md
  const content = requests.map((r) => `${SEPARATOR}\n${r.testo}`).join('\n\n');
  writeFileSync(inputFile, content, 'utf-8');
  console.log(`[Coworker] ${requests.length} tracce scritte su ${inputFile}`);

  // Marca processing + log
  await markAll(ids, 'processing');
  await Promise.all(ids.map((id) =>
    log(id, 'coworker_started', `Batch avviato — ${ids.length} articolo/i`, 'processing')
  ));

  const apiUrl = process.env.API_URL!;
  const apiKey = process.env.COWORK_API_KEY!;

  // Il prompt dice a Claude Code di scrivere l'output in output_articoli.json
  const idsMap = ids.map((id, i) => `articolo ${i + 1} → "${id}"`).join(', ');
  const prompt = `Leggi le tracce in input_articoli.md e genera gli articoli per il blog HCAIRE.
Scrivi il risultato in output_articoli.json come array JSON con questa struttura per ogni articolo:
{ "slug": "...", "titolo": "...", "descrizione": "...", "contenuto": "...(markdown)...", "categoria": "...", "tags": [...], "articleRequestId": "<id>" }

Associazione articolo→id: ${idsMap}
isPublished sarà impostato da chi legge il file (${pubblica ? 'true' : 'false'}).
NON chiamare API esterne. Scrivi solo output_articoli.json.`;

  console.log(`[Coworker] Avvio Claude Code per ${ids.length} articoli...`);

  const proc = spawn('claude', ['--print', prompt, '--dangerously-skip-permissions'], {
    shell: true,
    cwd:   coworkPath,
  });

  proc.stdout.on('data', (chunk) => { process.stdout.write(chunk); });
  proc.stderr.on('data', (chunk) => { process.stderr.write(chunk); });

  proc.on('close', async (code) => {
    if (code === 0) {
      await Promise.all(ids.map((id) =>
        log(id, 'coworker_done', 'Claude Code completato, avvio pubblicazione')
      ));
      console.log('[Coworker] Generazione completata. Pubblicazione in corso...');
      await publishArticles(outputFile, ids, pubblica);
    } else {
      await markAll(ids, 'error');
      await Promise.all(ids.map((id) =>
        log(id, 'coworker_error', `Claude Code terminato con codice ${code}`, 'error')
      ));
      console.error(`[Coworker] Generazione fallita (exit code ${code}).`);
    }
  });

  proc.on('error', async (err) => {
    await markAll(ids, 'error');
    await Promise.all(ids.map((id) =>
      log(id, 'coworker_error', `Errore spawn: ${err.message}`, 'error')
    ));
    console.error('[Coworker] Errore spawn Claude Code:', err.message);
  });
}
