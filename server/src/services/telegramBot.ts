import { Telegraf } from 'telegraf';
import mongoose from 'mongoose';
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

    if (GENERA_PATTERN.test(testo)) {
      const pubblica = GENERA_PATTERN.test(testo) && PUBBLICA_PATTERN.test(testo);

      try {
        const request = await ArticleRequest.create({ testo, pubblica, status: 'pending' });
        const id = (request._id as mongoose.Types.ObjectId).toString();
        await logWorkflow(id, 'telegram_received', 'server', `Messaggio Telegram ricevuto (pubblica: ${pubblica})`);
        await redis.publish(CHANNEL_ARTICLE_NEW, JSON.stringify({ id, pubblica }));
        await logWorkflow(id, 'redis_published', 'server', 'Notifica pubblicata su Redis channel article:new');
        await ctx.reply(pubblica
          ? 'Traccia ricevuta. Generazione e pubblicazione avviate.'
          : 'Traccia ricevuta. Generazione avviata.'
        );
        console.log(`[Telegram] ArticleRequest ${id} salvata e notifica Redis inviata.`);
      } catch (err) {
        console.error('[Telegram] Errore salvataggio ArticleRequest:', err);
        await ctx.reply('Errore durante il salvataggio della traccia.');
      }
      return;
    }

    // Messaggio generico: salva come traccia senza avviare generazione
    try {
      const request = await ArticleRequest.create({ testo, pubblica: false, status: 'pending' });
      const id = (request._id as mongoose.Types.ObjectId).toString();
      await logWorkflow(id, 'telegram_received', 'server', 'Traccia salvata senza avvio generazione');
      await ctx.reply('Traccia salvata.');
      console.log(`[Telegram] Traccia ${id} salvata su MongoDB.`);
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
