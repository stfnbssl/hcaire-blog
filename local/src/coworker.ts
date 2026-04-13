import { spawn } from 'child_process';
import mongoose from 'mongoose';

// Schema minimo per leggere ArticleRequest senza importare il model del server
const ArticleRequestSchema = new mongoose.Schema(
  { testo: String, pubblica: Boolean, status: String },
  { collection: 'article-requests' }
);
const ArticleRequest = mongoose.models['ArticleRequest']
  ?? mongoose.model('ArticleRequest', ArticleRequestSchema);

export async function spawnCoworker(requestId: string, pubblica: boolean): Promise<void> {
  const request = await ArticleRequest.findById(requestId);
  if (!request) {
    console.error(`[Coworker] ArticleRequest ${requestId} non trovata.`);
    return;
  }

  await ArticleRequest.findByIdAndUpdate(requestId, { status: 'processing' });

  const apiUrl  = process.env.API_URL!;
  const apiKey  = process.env.COWORK_API_KEY!;
  const prompt  = pubblica
    ? `Genera un articolo per il blog HCAIRE basandoti su questa traccia e pubblicalo tramite POST ${apiUrl}/contents con API key "${apiKey}".\n\nTraccia:\n${request.testo}`
    : `Genera un articolo per il blog HCAIRE basandoti su questa traccia. Salvalo come bozza tramite POST ${apiUrl}/contents con API key "${apiKey}" e isPublished=false.\n\nTraccia:\n${request.testo}`;

  console.log(`[Coworker] Avvio Claude Code per ArticleRequest ${requestId}...`);

  const proc = spawn('claude', ['--print', prompt, '--dangerously-skip-permissions'], {
    shell: true,
    cwd:   process.env.COWORK_PROJECT_PATH || process.cwd(),
  });

  let output = '';
  proc.stdout.on('data', (chunk) => { output += chunk.toString(); process.stdout.write(chunk); });
  proc.stderr.on('data', (chunk) => { process.stderr.write(chunk); });

  proc.on('close', async (code) => {
    const status = code === 0 ? 'done' : 'error';
    await ArticleRequest.findByIdAndUpdate(requestId, { status });
    console.log(`[Coworker] ArticleRequest ${requestId} completata con status: ${status}`);
  });

  proc.on('error', async (err) => {
    console.error('[Coworker] Errore spawn Claude Code:', err.message);
    await ArticleRequest.findByIdAndUpdate(requestId, { status: 'error' });
  });
}
