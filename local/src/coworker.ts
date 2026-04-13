import { spawn }                              from 'child_process';
import { writeFileSync, readFileSync }        from 'fs';
import { join }                              from 'path';
import mongoose                              from 'mongoose';

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

// Aggiorna la sezione "Pubblicazione articoli sul blog" nel CLAUDE.md del cowork
// con l'endpoint Railway corrente e l'API key, incluso l'articleRequestId per ogni articolo.
function patchCoworkClaudeMd(
  coworkPath: string,
  apiUrl: string,
  apiKey: string,
  ids: string[],
  pubblica: boolean
): void {
  const claudePath = join(coworkPath, 'claude.md');
  let content = readFileSync(claudePath, 'utf-8');

  const idsMap = ids.map((id, i) => `- articolo ${i + 1}: \`${id}\``).join('\n');

  const newSection = `## Pubblicazione articoli sul blog

Quando il prompt contiene "pubblicali sul blog", dopo aver generato ogni articolo
esegui una richiesta HTTP per pubblicarlo:

- **Endpoint**: POST ${apiUrl}/contents/import
- **Header**: Authorization: Bearer ${apiKey}
- **Header aggiuntivo**: Content-Type: application/json
- **isPublished**: ${pubblica}
- **isPinned**: false
- **autore**: "stfnbssl"
- **articleRequestId**: includi nel body il campo \`articleRequestId\` con l'id corrispondente all'articolo:
${idsMap}

Usa \`curl\` per la richiesta:
\`\`\`bash
curl -s -X POST ${apiUrl}/contents/import \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{ ...json articolo con articleRequestId... }'
\`\`\`

Se la risposta è HTTP 201, la pubblicazione è avvenuta con successo.
Se la risposta è HTTP 400 con "Slug già esistente", l'articolo è già pubblicato — prosegui.
Per altri errori, segnalali nel report finale.`;

  // Sostituisce la sezione esistente "Pubblicazione articoli sul blog" fino alla fine del file
  const marker = '## Pubblicazione articoli sul blog';
  const idx    = content.indexOf(marker);
  if (idx !== -1) {
    content = content.slice(0, idx) + newSection + '\n';
  } else {
    content = content + '\n' + newSection + '\n';
  }

  writeFileSync(claudePath, content, 'utf-8');
  console.log('[Coworker] claude.md aggiornato con endpoint Railway corrente.');
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function spawnCoworker(ids: string[], pubblica: boolean): Promise<void> {
  const requests = await ArticleRequest.find({ _id: { $in: ids } });
  if (requests.length === 0) {
    console.error('[Coworker] Nessuna ArticleRequest trovata.');
    return;
  }

  const apiUrl     = process.env.API_URL!;
  const apiKey     = process.env.COWORK_API_KEY!;
  const coworkPath = process.env.COWORK_PROJECT_PATH || process.cwd();
  const inputFile  = join(coworkPath, 'input_articoli.md');

  // 1. Scrivi input_articoli.md con tutte le tracce
  const inputContent = requests.map((r) => `${SEPARATOR}\n${r.testo}`).join('\n\n');
  writeFileSync(inputFile, inputContent, 'utf-8');
  console.log(`[Coworker] ${requests.length} tracce scritte su ${inputFile}`);

  // 2. Aggiorna claude.md del cowork con l'endpoint Railway corrente
  try {
    patchCoworkClaudeMd(coworkPath, apiUrl, apiKey, ids, pubblica);
  } catch (err) {
    console.error('[Coworker] Impossibile aggiornare claude.md:', err);
  }

  // 3. Log + marca processing
  await markAll(ids, 'processing');
  await Promise.all(ids.map((id) =>
    log(id, 'coworker_started', `Batch avviato — ${ids.length} articolo/i`, 'processing')
  ));

  // 4. Prompt semplice: cowork sa già come generare e pubblicare dal suo claude.md
  const prompt = pubblica
    ? 'Leggi le tracce in input_articoli.md, genera gli articoli e pubblicali sul blog.'
    : 'Leggi le tracce in input_articoli.md e genera gli articoli (non pubblicare).';

  console.log(`[Coworker] Avvio Claude Code per ${ids.length} articoli...`);

  const proc = spawn('claude', ['--print', prompt, '--dangerously-skip-permissions'], {
    shell: true,
    cwd:   coworkPath,
  });

  proc.stdout.on('data', (chunk) => { process.stdout.write(chunk); });
  proc.stderr.on('data', (chunk) => { process.stderr.write(chunk); });

  proc.on('close', async (code) => {
    if (code === 0) {
      await markAll(ids, 'done');
      await Promise.all(ids.map((id) =>
        log(id, 'coworker_done', 'Claude Code completato con successo', 'done')
      ));
      console.log(`[Coworker] Batch completato (${ids.length} articoli).`);
    } else {
      await markAll(ids, 'error');
      await Promise.all(ids.map((id) =>
        log(id, 'coworker_error', `Claude Code terminato con codice ${code}`, 'error')
      ));
      console.error(`[Coworker] Batch fallito (exit code ${code}).`);
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
