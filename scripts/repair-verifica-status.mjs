#!/usr/bin/env node
// Repair script: porta a 'in_verifica' tutte le execution attualmente in 'completato'
// per step che hanno verifica:true in pipeline-step-config.json.
// Idempotente: se non c'è nulla da riparare, non fa modifiche.
//
// Uso:
//   node scripts/repair-verifica-status.mjs                  # esegue
//   node scripts/repair-verifica-status.mjs --dry-run        # solo stampa cosa farebbe
//   node scripts/repair-verifica-status.mjs --context <id>   # limita a un context
//
// Risolve il sintomo: "Errore durante la verifica — Execution in stato completato,
// non verificabile" che capita quando un'execution è stata creata prima del fix
// che inserisce verifica_required nel payload Redis.

import 'dotenv/config';
import path from 'node:path';
import { promises as fs } from 'node:fs';
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
  // 1. Carica step config per scoprire quali step hanno verifica:true
  const cfgPath = path.join(REPO_ROOT, 'server', 'pipeline-step-config.json');
  const cfg = JSON.parse(await fs.readFile(cfgPath, 'utf8'));
  const stepsWithVerifica = new Set(
    cfg.steps.filter((s) => s.verifica === true).map((s) => s.id),
  );
  console.log(`Step con verifica:true → ${[...stepsWithVerifica].join(', ')}`);

  // 2. Connetti Mongo
  const url = process.env.MONGODB_URL
    .replace('{password}', process.env.MONGODB_PASSWORD)
    .replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
  const db = mongoose.connection.db;

  // 3. Trova execution candidate
  const filter = {
    status: 'completato',
    step_id: { $in: [...stepsWithVerifica] },
  };
  if (CTX_FILTER) filter.context_id = CTX_FILTER;
  const candidates = await db.collection('pipeline_step_executions').find(filter).toArray();

  console.log(`Trovate ${candidates.length} execution da riparare${CTX_FILTER ? ` (context: ${CTX_FILTER})` : ''}.`);

  if (candidates.length === 0) {
    await mongoose.disconnect();
    return;
  }

  for (const exec of candidates) {
    console.log(`  ${exec.context_id} / ${exec.step_id} run #${exec.run_number} (exec ${exec._id})`);
    if (DRY_RUN) continue;

    // Per ogni execution: cambia status execution + step_state context
    await db.collection('pipeline_step_executions').updateOne(
      { _id: exec._id },
      { $set: { status: 'in_verifica', verifica_required: true } },
    );
    await db.collection('pipeline_contexts').updateOne(
      { context_id: exec.context_id },
      {
        $set: {
          [`step_states.${exec.step_id}.status`]: 'in_verifica',
          [`step_states.${exec.step_id}.updated_at`]: new Date(),
        },
        $pull: { steps_completed: exec.step_id },
      },
    );
  }

  console.log(DRY_RUN ? '\n[dry-run] nessuna modifica scritta.' : `\nRiparate ${candidates.length} execution.`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
