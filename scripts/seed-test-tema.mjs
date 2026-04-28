#!/usr/bin/env node
// Crea un PipelineContext tema di test con f3_step_1 già 'verificato', pronto per
// lanciare f3_step_2 dalla UI admin.
//
// Uso:
//   node scripts/seed-test-tema.mjs --id test-pipeline-fase3 --label "Test pipeline F3"
//   node scripts/seed-test-tema.mjs --id test-pipeline-fase3 --label "..." --source-tema pointing
//   node scripts/seed-test-tema.mjs --id test-pipeline-fase3 --copy   (duplica il file di lettura)
//   node scripts/seed-test-tema.mjs --delete test-pipeline-fase3
//
// Default: source-tema = "pointing" (riusa il suo file di lettura).

import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(REPO_ROOT, 'server', '.env') });

const PUBLIC_PIPELINE_DIR = path.join(REPO_ROOT, 'client', 'public', 'pipeline');

function arg(name, defaultValue = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return defaultValue;
  return process.argv[idx + 1] ?? true;
}

const ID = arg('id');
const LABEL = arg('label');
const SOURCE_TEMA = arg('source-tema', 'pointing');
const COPY = process.argv.includes('--copy');
const DELETE_ID = arg('delete');

if (!DELETE_ID && (!ID || !LABEL)) {
  console.error('Uso: --id <slug> --label "<testo>"  oppure  --delete <slug>');
  process.exit(1);
}

async function connectMongo() {
  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL.replace('{password}', password).replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
}

async function main() {
  await connectMongo();
  const db = mongoose.connection.db;
  const ctxCol = db.collection('pipeline_contexts');
  const execCol = db.collection('pipeline_step_executions');
  const inputsCol = db.collection('pipeline_external_inputs');

  if (DELETE_ID) {
    const ctx = await ctxCol.findOne({ context_id: DELETE_ID });
    if (!ctx) { console.log(`Nessun context con id "${DELETE_ID}".`); await mongoose.disconnect(); return; }
    await ctxCol.deleteOne({ context_id: DELETE_ID });
    await execCol.deleteMany({ context_id: DELETE_ID });
    await inputsCol.deleteMany({ context_id: DELETE_ID });
    // rimuove file copiato (se c'era)
    const copiedFile = path.join(PUBLIC_PIPELINE_DIR, 'temi', DELETE_ID, 'lettura-configurazionale-test-v1.json');
    await fs.rm(copiedFile, { force: true }).catch(() => {});
    await fs.rm(path.join(PUBLIC_PIPELINE_DIR, 'temi', DELETE_ID), { recursive: true, force: true }).catch(() => {});
    console.log(`Rimosso tema "${DELETE_ID}" e tutti i suoi documenti.`);
    await mongoose.disconnect();
    return;
  }

  // Validazione id
  if (!/^[a-z0-9-]+$/.test(ID)) {
    console.error('id deve essere kebab-case (a-z, 0-9, -)');
    process.exit(1);
  }
  const exists = await ctxCol.findOne({ context_id: ID });
  if (exists) {
    console.error(`Context "${ID}" già esistente. Usa --delete prima per ricrearlo.`);
    process.exit(1);
  }

  // Trova file di lettura sorgente
  const sourceCtx = await ctxCol.findOne({ context_id: SOURCE_TEMA });
  if (!sourceCtx) {
    console.error(`Tema sorgente "${SOURCE_TEMA}" non trovato. Specifica --source-tema <id_esistente>.`);
    process.exit(1);
  }
  const sourceLetturaFile = sourceCtx.step_states?.f3_step_1?.output_file;
  if (!sourceLetturaFile) {
    console.error(`Il tema sorgente "${SOURCE_TEMA}" non ha output_file per f3_step_1.`);
    process.exit(1);
  }

  // Eventuale copia del file
  let outputFileRel = sourceLetturaFile;
  if (COPY) {
    const fromAbs = path.join(PUBLIC_PIPELINE_DIR, sourceLetturaFile);
    const toRel = `temi/${ID}/lettura-configurazionale-test-v1.json`;
    const toAbs = path.join(PUBLIC_PIPELINE_DIR, toRel);
    await fs.mkdir(path.dirname(toAbs), { recursive: true });
    await fs.copyFile(fromAbs, toAbs);
    outputFileRel = toRel;
    console.log(`File copiato in ${toAbs}`);
  } else {
    console.log(`File di lettura riusato da "${SOURCE_TEMA}": ${sourceLetturaFile}`);
  }

  // Crea execution f3_step_1 status='verificato'
  const now = new Date();
  const execId = new mongoose.Types.ObjectId();
  await execCol.insertOne({
    _id: execId,
    context_type: 'tema',
    context_id: ID,
    step_id: 'f3_step_1',
    run_number: 1,
    status: 'verificato',
    created_at: now,
    started_at: now,
    completed_at: now,
    verified_at: now,
    verified_by: 'seed-test-tema',
    inputs: { pipeline: [], esterni: [], strutturali: [], dispositivo_sorgente: null },
    output_file: outputFileRel,
    cowork_message_id: null,
    cowork_session_id: null,
    log_lines: [],
    error: null,
    verifica_required: true,
    verifica_notes: null,
    verifica_outcome: 'approvato',
    verifica_feedback: null,
    is_skipped: false,
    skip_reason: null,
  });

  // Crea context con step_states.f3_step_1 verificato
  await ctxCol.insertOne({
    context_type: 'tema',
    context_id: ID,
    label: LABEL,
    theme_id: null,
    ricerca_origine: null,
    dispositivo_sorgente: null,
    step_states: {
      f3_step_1: {
        status: 'verificato',
        current_run: 1,
        last_execution_id: execId,
        output_file: outputFileRel,
        verifica_outcome: 'approvato',
        updated_at: now,
      },
    },
    pending_decision: null,
    steps_completed: ['f3_step_1'],
    steps_in_progress: [],
    steps_failed: [],
    robustezza: null,
    correzioni_residue: 0,
    has_revisioni: false,
    createdAt: now,
    updatedAt: now,
  });

  console.log(`\nTema test creato: "${ID}"`);
  console.log(`URL admin: http://localhost:5173/sviluppo-bambino/produzioni/pipeline/temi/${ID}`);
  console.log(`Vai sulla tab "Esegui" e lancia f3_step_2.\n`);

  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
