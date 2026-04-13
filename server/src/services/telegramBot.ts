import { Telegraf } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

const GENERA_PATTERN  = /\b(genera|crea|scrivi|produci)\b.{0,30}\barticol/i;
const PUBBLICA_PATTERN = /\be\s+pubblica\b/i;

function isGeneraCommand(testo: string): boolean {
  return GENERA_PATTERN.test(testo);
}

function isPublishCommand(testo: string): boolean {
  return GENERA_PATTERN.test(testo) && PUBBLICA_PATTERN.test(testo);
}

function runCowork(projectPath: string, pubblica: boolean, onDone: (err: Error | null, output: string) => void): void {
  const prompt = pubblica
    ? 'crea gli articoli descritti in input_articoli.md e pubblicali sul blog'
    : 'crea gli articoli descritti in input_articoli.md';
  const proc = spawn('claude', ['--print', prompt, '--dangerously-skip-permissions'], {
    cwd: projectPath,
    shell: true,
  });

  let output = '';
  proc.stdout.on('data', (chunk) => { output += chunk.toString(); });
  proc.stderr.on('data', (chunk) => { output += chunk.toString(); });

  proc.on('close', (code) => {
    if (code === 0) {
      onDone(null, output);
    } else {
      onDone(new Error(`Claude Code uscito con codice ${code}`), output);
    }
  });

  proc.on('error', (err) => onDone(err, output));
}

export function startTelegramBot(): void {
  const token = process.env.TELEGRAM_TOKEN;
  const allowedId = process.env.TELEGRAM_ID;
  const coworkFile = process.env.COWORK_FILE_ARTICOLO;
  const coworkPath = process.env.COWORK_PROJECT_PATH;

  if (!token || !allowedId || !coworkFile) {
    console.warn('[Telegram] Variabili TELEGRAM_TOKEN, TELEGRAM_ID o COWORK_FILE_ARTICOLO mancanti — bot non avviato.');
    return;
  }

  const allowedUserId = parseInt(allowedId, 10);
  const filePath = path.resolve(coworkFile);

  const bot = new Telegraf(token);

  bot.on('text', async (ctx) => {
    if (ctx.from.id !== allowedUserId) {
      console.warn(`[Telegram] Messaggio ignorato da utente non autorizzato: ${ctx.from.id}`);
      return;
    }

    const testo = ctx.message.text;

    // Comando generazione articoli (con o senza pubblicazione)
    if (isGeneraCommand(testo)) {
      if (!coworkPath) {
        await ctx.reply('Errore: COWORK_PROJECT_PATH non configurato nel server.');
        return;
      }
      const pubblica = isPublishCommand(testo);
      await ctx.reply(pubblica
        ? 'Generazione e pubblicazione avviate... ti avviso quando ho finito.'
        : 'Generazione avviata... ti avviso quando ho finito.'
      );
      console.log(`[Telegram] Avvio generazione articoli con Claude Code (pubblica: ${pubblica}).`);

      runCowork(coworkPath, pubblica, async (err) => {
        if (err) {
          console.error('[Telegram] Errore generazione:', err.message);
          await ctx.reply(`Errore durante la generazione: ${err.message}`);
        } else {
          console.log('[Telegram] Generazione completata.');
          await ctx.reply(pubblica
            ? 'Articoli generati e pubblicati con successo.'
            : 'Articoli generati con successo.'
          );
        }
      });

      return;
    }

    // Traccia articolo
    const blocco = `\`\`\`\n===== NUOVO ARTICOLO =====\n\`\`\`\n${testo}\n`;
    try {
      fs.appendFileSync(filePath, blocco, 'utf-8');
      await ctx.reply('Traccia salvata.');
      console.log(`[Telegram] Traccia aggiunta a ${filePath}`);
    } catch (err) {
      console.error('[Telegram] Errore scrittura file:', err);
      await ctx.reply('Errore durante il salvataggio della traccia.');
    }
  });

  bot.launch()
    .then(() => console.log('[Telegram] Bot avviato.'))
    .catch((err) => console.error('[Telegram] Errore avvio bot:', err));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
