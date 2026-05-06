#!/usr/bin/env node
// One-shot cleanup: azzera pending_decision di tipo 'f2_to_f3_tema_selection' sui
// pipeline_contexts dove f2_step_6 non è ancora 'completato'. Necessario perché il
// vecchio trigger (server/src/controllers/pipelineController.ts:verifyExecution)
// scriveva la decisione al verificato di f2_step_5; il nuovo trigger
// (server/src/services/pipelineEventSubscriber.ts:populateF2ToF3Decision) la
// scrive al completamento di f2_step_6, ma i record già presenti restano stale.
// Idempotente: se non trova candidati non fa modifiche.
//
// Uso:
//   node scripts/clear-stale-f2-pending-decision.mjs              # esegue
//   node scripts/clear-stale-f2-pending-decision.mjs --dry-run    # solo stampa
//   node scripts/clear-stale-f2-pending-decision.mjs --context X  # limita a un context

import 'dotenv/config';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(REPO_ROOT, 'server', '.env') });

const DRY_RUN = process.argv.includes('--dry-run');
const CTX_FILTER = (() => {
  const i = process.argv.indexOf('--context');
  return i >= 0 ? process.argv[i + 1] : null;
})();

async function main() {
  const url = process.env.MONGODB_URL
    .replace('{password}', process.env.MONGODB_PASSWORD)
    .replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
  const db = mongoose.connection.db;

  const filter = {
    'pending_decision.type': 'f2_to_f3_tema_selection',
  };
  if (CTX_FILTER) filter.context_id = CTX_FILTER;

  const candidates = await db.collection('pipeline_contexts').find(filter).toArray();
  console.log(`pipeline_contexts con pending_decision f2_to_f3_tema_selection: ${candidates.length}`);

  let toClear = 0;
  for (const ctx of candidates) {
    const step6Status = ctx.step_states?.f2_step_6?.status ?? 'non_avviato';
    const isStale = step6Status !== 'completato' && step6Status !== 'verificato';
    const tag = isStale ? 'STALE → clear' : 'ok (f2_step_6 ' + step6Status + ')';
    console.log(`  ${ctx.context_id} (f2_step_6: ${step6Status}) — ${tag}`);
    if (!isStale) continue;
    toClear++;
    if (DRY_RUN) continue;
    await db.collection('pipeline_contexts').updateOne(
      { _id: ctx._id },
      { $set: { pending_decision: null } },
    );
  }

  console.log(
    DRY_RUN
      ? `\n[dry-run] nessuna modifica scritta. Avrebbe ripulito ${toClear} contesti.`
      : `\nRipuliti ${toClear} pending_decision stale.`,
  );
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
