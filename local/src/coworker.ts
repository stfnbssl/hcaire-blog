import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';

const ArticleRequestSchema = new mongoose.Schema(
  { testo: String, pubblica: Boolean, status: String },
  { collection: 'article-requests' }
);
const ArticleRequest = mongoose.models['ArticleRequest']
  ?? mongoose.model('ArticleRequest', ArticleRequestSchema);

const SEPARATOR = '===== NUOVO ARTICOLO =====';

async function writeLog(
  requestId: string,
  step: string,
  message: string,
  requestStatus?: string
): Promise<void> {
  const apiUrl = process.env.API_URL!;
  const apiKey = process.env.COWORK_API_KEY!;
  const body: Record<string, string> = { step, message, actor: 'local' };
  if (requestStatus) body['requestStatus'] = requestStatus;

  try {
    await fetch(`${apiUrl}/article-requests/${requestId}/log`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body:    JSON.stringify(body),
    });
  } catch (err) {
    console.error('[Coworker] Errore scrittura log:', err);
  }
}

async function markAll(ids: string[], status: string): Promise<void> {
  await Promise.all(ids.map((id) =>
    ArticleRequest.findByIdAndUpdate(id, { status })
  ));
}

export async function spawnCoworker(ids: string[], pubblica: boolean): Promise<void> {
  const requests = await ArticleRequest.find({ _id: { $in: ids } });
  if (requests.length === 0) {
    console.error('[Coworker] Nessuna ArticleRequest trovata per i forniti IDs.');
    return;
  }

  const apiUrl     = process.env.API_URL!;
  const apiKey     = process.env.COWORK_API_KEY!;
  const coworkPath = process.env.COWORK_PROJECT_PATH || process.cwd();
  const inputFile  = join(coworkPath, 'input_articoli.md');

  // Scrivi tutti i testi in input_articoli.md con il separatore
  const content = requests
    .map((r) => `${SEPARATOR}\n${r.testo}`)
    .join('\n\n');
  writeFileSync(inputFile, content, 'utf-8');
  console.log(`[Coworker] ${requests.length} tracce scritte su ${inputFile}`);

  // Marca tutti processing e scrivi log
  await markAll(ids, 'processing');
  await Promise.all(ids.map((id) =>
    writeLog(id, 'coworker_started',
      `Claude Code avviato — batch di ${ids.length} articolo/i`, 'processing')
  ));

  const prompt = pubblica
    ? `Genera e pubblica gli articoli descritti in input_articoli.md sul blog HCAIRE. Per ogni articolo usa POST ${apiUrl}/contents/import con header "Authorization: Bearer ${apiKey}". Includi nel body il campo "articleRequestId" con l'id corrispondente: ${ids.map((id, i) => `articolo ${i + 1} → "${id}"`).join(', ')}.`
    : `Genera gli articoli descritti in input_articoli.md come bozze (isPublished: false) sul blog HCAIRE. Per ogni articolo usa POST ${apiUrl}/contents/import con header "Authorization: Bearer ${apiKey}". Includi nel body il campo "articleRequestId" con l'id corrispondente: ${ids.map((id, i) => `articolo ${i + 1} → "${id}"`).join(', ')}.`;

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
        writeLog(id, 'coworker_done', 'Claude Code completato con successo', 'done')
      ));
      console.log(`[Coworker] Batch completato (${ids.length} articoli).`);
    } else {
      await markAll(ids, 'error');
      await Promise.all(ids.map((id) =>
        writeLog(id, 'coworker_error', `Claude Code terminato con codice ${code}`, 'error')
      ));
      console.error(`[Coworker] Batch fallito (exit code ${code}).`);
    }
  });

  proc.on('error', async (err) => {
    await markAll(ids, 'error');
    await Promise.all(ids.map((id) =>
      writeLog(id, 'coworker_error', `Errore spawn: ${err.message}`, 'error')
    ));
    console.error('[Coworker] Errore spawn Claude Code:', err.message);
  });
}
