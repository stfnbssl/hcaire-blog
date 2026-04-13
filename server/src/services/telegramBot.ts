import { Telegraf } from 'telegraf';
import ArticleRequest from '../models/ArticleRequest';
import { getRedisClient, CHANNEL_ARTICLE_NEW } from '../config/redis';
import { logWorkflow } from './workflowLogger';

const GENERA_PATTERN   = /\b(genera|crea|scrivi|produci)\b.{0,30}\barticol/i;
const PUBBLICA_PATTERN = /\be\s+pubblica\b/i;

export function startTelegramBot(): void {
  const token     = process.env.TELEGRAM_TOKEN;
  const allowedId = process.env.TELEGRAM_ID;

  if (!token || !allowedId) {
    console.warn('[Telegram] Variabili TELEGRAM_TOKEN o TELEGRAM_ID mancanti — bot non avviato.');
    return;
  }

  const allowedUserId = parseInt(allowedId, 10);
  const bot           = new Telegraf(token);
  const redis         = getRedisClient();

  bot.on('text', async (ctx) => {
    if (ctx.from.id !== allowedUserId) {
      console.warn(`[Telegram] Messaggio ignorato da utente non autorizzato: ${ctx.from.id}`);
      return;
    }

    const testo = ctx.message.text;

    // Comando generazione: raccoglie tutti i pending e avvia coworker
    if (GENERA_PATTERN.test(testo)) {
      const pubblica = PUBBLICA_PATTERN.test(testo);

      try {
        const pending = await ArticleRequest.find({ status: 'pending' }).select('_id');
        if (pending.length === 0) {
          await ctx.reply('Nessuna traccia in attesa. Invia prima le tracce degli articoli da generare.');
          return;
        }

        const ids = pending.map((r) => r._id.toString());

        // Log su ogni ArticleRequest coinvolta
        await Promise.all(ids.map((id) =>
          logWorkflow(id, 'redis_published', 'server',
            `Generazione avviata da Telegram (pubblica: ${pubblica}, batch: ${ids.length} articoli)`)
        ));

        await redis.publish(CHANNEL_ARTICLE_NEW, JSON.stringify({ ids, pubblica }));

        await ctx.reply(pubblica
          ? `Generazione e pubblicazione avviate per ${ids.length} articolo/i.`
          : `Generazione avviata per ${ids.length} articolo/i.`
        );
        console.log(`[Telegram] Batch generazione: ${ids.length} ArticleRequest pending → Redis.`);
      } catch (err) {
        console.error('[Telegram] Errore avvio generazione:', err);
        await ctx.reply('Errore durante l\'avvio della generazione.');
      }
      return;
    }

    // Messaggio normale: salva come traccia articolo (pending)
    try {
      const request = await ArticleRequest.create({ testo, status: 'pending' });
      const id = request._id.toString();
      await logWorkflow(id, 'telegram_received', 'server', 'Traccia articolo salvata');
      await ctx.reply('Traccia salvata.');
      console.log(`[Telegram] Traccia ${id} salvata.`);
    } catch (err) {
      console.error('[Telegram] Errore salvataggio traccia:', err);
      await ctx.reply('Errore durante il salvataggio della traccia.');
    }
  });

  bot.launch()
    .then(() => console.log('[Telegram] Bot avviato.'))
    .catch((err) => console.error('[Telegram] Errore avvio bot:', err));

  process.once('SIGINT',  () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
