// Script di test: triggera un rebuild assi bypassando la route HTTP (no token Clerk).
// Crea un AssiRebuildExecution su Mongo + LPUSH del comando + polling stato.

import 'dotenv/config';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';

async function main(): Promise<void> {
  const password = process.env.MONGODB_PASSWORD!;
  const url = process.env.MONGODB_URL!
    .replace('{password}', password)
    .replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
  console.log('[test] Mongo connesso');

  const db = mongoose.connection.db;
  if (!db) throw new Error('Mongo non connesso');
  const executions = db.collection('assi_rebuild_executions');
  const axes = db.collection('assi_strutturali');

  // Pre-check: ce n'è già uno in coda/in_esecuzione?
  const pending = await executions.findOne({ status: { $in: ['in_coda', 'in_esecuzione'] } });
  if (pending) {
    console.log(`[test] ATTENZIONE: execution ${pending._id} è già ${pending.status}. Pulisco prima.`);
    await executions.updateOne(
      { _id: pending._id },
      { $set: { status: 'fallito', completed_at: new Date(), error: 'Pulito dallo script di test' } },
    );
  }

  // 1. Crea execution
  const now = new Date();
  const result = await executions.insertOne({
    status: 'in_coda',
    triggered_at: now,
    started_at: null,
    completed_at: null,
    log_lines: [{ ts: now, text: 'Rebuild triggerato da triggerAssiRebuild.ts', level: 'info' }],
    axes_updated: [],
    error: null,
    triggered_by: 'test-script',
    createdAt: now,
    updatedAt: now,
  });
  const executionId = result.insertedId.toString();
  console.log(`[test] Execution creata: ${executionId}`);

  // 2. LPUSH comando
  const redis = new Redis({
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || '11976', 10),
    password: process.env.REDIS_PASSWORD!,
    maxRetriesPerRequest: 3,
  });
  const cmd = {
    type: 'assi.rebuild',
    message_id: randomUUID(),
    timestamp: new Date().toISOString(),
    execution_id: executionId,
    payload: {},
  };
  await redis.lpush('hcaire:assi:commands', JSON.stringify(cmd));
  console.log('[test] Comando pubblicato su hcaire:assi:commands');

  // Snapshot iniziale di assi_strutturali per verificare il rebuild anche se
  // il server (eventi) non è up: confrontiamo _last_rebuilt prima/dopo.
  const before = await axes.findOne({ axis_id: 'asse_1' }, { projection: { _last_rebuilt: 1 } });
  const beforeRebuilt = before?._last_rebuilt as Date | null | undefined;
  console.log(`[test] asse_1._last_rebuilt PRIMA: ${beforeRebuilt ?? '(mai)'}`);

  // 3. Polling stato (max 3 minuti)
  let lastStatus = '';
  let logIdx = 0;
  const maxAttempts = 600; // 600 * 2s = 1200s = 20 min (Cowork reale può durare 3-8 min)
  let stopReason: 'status' | 'rebuilt' | 'timeout' = 'timeout';
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const doc = await executions.findOne({ _id: result.insertedId });
    if (!doc) {
      console.log('[test] Execution sparita?!');
      break;
    }
    if (doc.status !== lastStatus) {
      console.log(`[test] status → ${doc.status}`);
      lastStatus = doc.status;
    }
    const lines = (doc.log_lines as Array<{ ts: Date; text: string; level: string }>) || [];
    while (logIdx < lines.length) {
      const ln = lines[logIdx];
      console.log(`  [${ln.level.padEnd(5)}] ${ln.text}`);
      logIdx++;
    }
    if (doc.status === 'completato' || doc.status === 'fallito') {
      stopReason = 'status';
      break;
    }
    // Fallback: anche se il server non aggiorna lo status, local fa l'upsert
    // su assi_strutturali. Se _last_rebuilt è cambiato, il rebuild è andato.
    const now = await axes.findOne({ axis_id: 'asse_1' }, { projection: { _last_rebuilt: 1 } });
    const nowRebuilt = now?._last_rebuilt as Date | null | undefined;
    if (nowRebuilt && (!beforeRebuilt || nowRebuilt.getTime() !== beforeRebuilt.getTime())) {
      console.log(`[test] asse_1._last_rebuilt è cambiato → rebuild eseguito da local (status execution non aggiornato: server forse non in ascolto eventi)`);
      // do qualche secondo per far arrivare gli ultimi log
      await new Promise((r) => setTimeout(r, 3000));
      stopReason = 'rebuilt';
      break;
    }
  }

  console.log('───────────────────────────────────────');
  console.log(`[test] Fine polling (motivo: ${stopReason})`);
  const final = await executions.findOne({ _id: result.insertedId });
  if (final) {
    console.log(`[test] status: ${final.status}`);
    console.log(`[test] axes_updated: ${JSON.stringify(final.axes_updated)}`);
    if (final.error) console.log(`[test] error: ${final.error}`);
    console.log(`[test] log lines totali: ${(final.log_lines as unknown[])?.length ?? 0}`);
  }
  const count = await axes.countDocuments({});
  console.log(`[test] documenti in assi_strutturali: ${count}`);
  const sample = await axes.findOne(
    { axis_id: 'asse_1' },
    { projection: { axis_name: 1, version: 1, status: 1, _last_rebuilt: 1 } },
  );
  console.log(`[test] asse_1 sample: ${JSON.stringify(sample)}`);

  await redis.disconnect();
  await mongoose.disconnect();
  console.log('[test] Done');
}

main().catch((err) => {
  console.error('[test] ERROR:', err);
  process.exit(1);
});
