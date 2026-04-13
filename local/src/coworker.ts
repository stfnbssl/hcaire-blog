import { spawn } from 'child_process';
import mongoose from 'mongoose';

const ArticleRequestSchema = new mongoose.Schema(
  { testo: String, pubblica: Boolean, status: String },
  { collection: 'article-requests' }
);
const ArticleRequest = mongoose.models['ArticleRequest']
  ?? mongoose.model('ArticleRequest', ArticleRequestSchema);

async function writeLog(
  requestId: string,
  step: string,
  message: string,
  status?: string
): Promise<void> {
  const apiUrl = process.env.API_URL!;
  const apiKey = process.env.COWORK_API_KEY!;
  const body: Record<string, string> = { step, message, actor: 'local' };
  if (status) body['status'] = status;

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

export async function spawnCoworker(requestId: string, pubblica: boolean): Promise<void> {
  const request = await ArticleRequest.findById(requestId);
  if (!request) {
    console.error(`[Coworker] ArticleRequest ${requestId} non trovata.`);
    return;
  }

  const apiUrl = process.env.API_URL!;
  const apiKey = process.env.COWORK_API_KEY!;

  await writeLog(requestId, 'coworker_started', 'Claude Code avviato per generazione articolo', 'processing');

  const prompt = pubblica
    ? `Genera un articolo per il blog HCAIRE basandoti su questa traccia e pubblicalo tramite POST ${apiUrl}/contents/import con header "Authorization: Bearer ${apiKey}" e includi il campo "articleRequestId": "${requestId}" nel body JSON.\n\nTraccia:\n${request.testo}`
    : `Genera un articolo per il blog HCAIRE basandoti su questa traccia. Salvalo come bozza tramite POST ${apiUrl}/contents/import con header "Authorization: Bearer ${apiKey}", imposta isPublished=false e includi il campo "articleRequestId": "${requestId}" nel body JSON.\n\nTraccia:\n${request.testo}`;

  console.log(`[Coworker] Avvio Claude Code per ArticleRequest ${requestId}...`);

  const proc = spawn('claude', ['--print', prompt, '--dangerously-skip-permissions'], {
    shell: true,
    cwd:   process.env.COWORK_PROJECT_PATH || process.cwd(),
  });

  proc.stdout.on('data', (chunk) => { process.stdout.write(chunk); });
  proc.stderr.on('data', (chunk) => { process.stderr.write(chunk); });

  proc.on('close', async (code) => {
    if (code === 0) {
      await writeLog(requestId, 'coworker_done', 'Claude Code completato con successo');
      console.log(`[Coworker] ArticleRequest ${requestId} completata.`);
    } else {
      await writeLog(requestId, 'coworker_error', `Claude Code terminato con codice ${code}`, 'error');
      console.error(`[Coworker] ArticleRequest ${requestId} fallita (exit code ${code}).`);
    }
  });

  proc.on('error', async (err) => {
    await writeLog(requestId, 'coworker_error', `Errore spawn: ${err.message}`, 'error');
    console.error('[Coworker] Errore spawn Claude Code:', err.message);
  });
}
