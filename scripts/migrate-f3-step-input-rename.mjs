#!/usr/bin/env node
// One-shot migration (D7 / v3.0): per ogni tema F3 promosso col vecchio bridge
// ambiti, rinomina i `PipelineExternalInput` da `step_id: 'f3_step_7'` (vecchio
// step Trasferibilità, ora rimosso) a `step_id: 'f3_step_1'` (nuovo step Nodo
// dominante e funzione, dove l'ambito è ora raccolto come input obbligatorio
// `contesto_ambito`).
//
// Aggiorna anche il `file_path` se contiene il vecchio segmento `f3-step-7-`
// (sostituito con `f3-step-1-`) — nota: il file fisico su disco NON viene
// rinominato; tipicamente i file su disco appartengono a esecuzioni precedenti
// che il ricercatore può abbandonare (D7 §3.4).
//
// Idempotente: se non trova candidati non fa modifiche.
//
// Uso:
//   node scripts/migrate-f3-step-input-rename.mjs              # esegue
//   node scripts/migrate-f3-step-input-rename.mjs --dry-run    # solo stampa
//   node scripts/migrate-f3-step-input-rename.mjs --context X  # limita a un context

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

  const filter = { step_id: 'f3_step_7', input_id: 'contesto_ambito' };
  if (CTX_FILTER) filter.context_id = CTX_FILTER;

  const candidates = await db.collection('pipeline_external_inputs').find(filter).toArray();
  console.log(`pipeline_external_inputs candidati al rename (f3_step_7 → f3_step_1): ${candidates.length}`);

  let renamed = 0;
  for (const doc of candidates) {
    const oldFilePath = doc.file_path;
    const newFilePath = typeof oldFilePath === 'string'
      ? oldFilePath.replace('/f3-step-7-', '/f3-step-1-')
      : oldFilePath;
    console.log(`  ${doc.context_id} (${doc._id}) — file_path: ${oldFilePath ?? '<null>'} → ${newFilePath ?? '<null>'}`);
    if (DRY_RUN) continue;
    await db.collection('pipeline_external_inputs').updateOne(
      { _id: doc._id },
      { $set: { step_id: 'f3_step_1', file_path: newFilePath } },
    );
    renamed++;
  }

  console.log(
    DRY_RUN
      ? `\n[dry-run] nessuna modifica scritta. Avrebbe rinominato ${candidates.length} record.`
      : `\nRinominati ${renamed} record.`,
  );
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
