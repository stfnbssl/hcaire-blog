// Patch retroattiva: copia step_states F2 (e steps_completed F2) della ricerca
// dentro un tema già creato che è stato derivato dalla decisione F2→F3 quando
// ancora il backend lasciava il tema con step_states vuoto.
//
// Necessario perché:
//   - l'enablement di f3_step_1 richiede f2_step_5 verificato letto da tema.step_states.f2_step_5
//   - buildExecutionPlan legge l'output_file degli step F2 dagli step_states del tema
//
// Uso:
//   npm run inherit:f2-steps -- <temaId>
//   npm run inherit:f2-steps -- <temaId> --dry-run
//
// Lo script richiede che il tema abbia ricerca_origine valorizzato.

import 'dotenv/config';
import mongoose from 'mongoose';

async function connectMongo(): Promise<void> {
  const password = process.env.MONGODB_PASSWORD;
  const urlTpl = process.env.MONGODB_URL;
  if (!password || !urlTpl) {
    throw new Error('MONGODB_PASSWORD e MONGODB_URL devono essere settati in local/.env');
  }
  const url = urlTpl.replace('{password}', password).replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
  console.log('[mongo] connesso');
}

interface StepState {
  status: string;
  current_run?: number;
  last_execution_id?: unknown;
  output_file?: string | null;
  verifica_outcome?: string | null;
  updated_at?: Date;
}

interface ContextDoc {
  context_id: string;
  context_type: 'ricerca' | 'tema';
  ricerca_origine?: string | null;
  step_states?: Record<string, StepState>;
  steps_completed?: string[];
}

async function patchTema(temaId: string, dryRun: boolean): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) throw new Error('Connessione Mongo non pronta');
  const coll = db.collection<ContextDoc>('pipeline_contexts');

  const tema = await coll.findOne({ context_id: temaId, context_type: 'tema' });
  if (!tema) throw new Error(`Tema "${temaId}" non trovato (o non è un context di tipo "tema")`);
  if (!tema.ricerca_origine) {
    throw new Error(`Tema "${temaId}" non ha ricerca_origine: impossibile risalire alla ricerca sorgente`);
  }

  const ricerca = await coll.findOne({ context_id: tema.ricerca_origine, context_type: 'ricerca' });
  if (!ricerca) throw new Error(`Ricerca "${tema.ricerca_origine}" non trovata`);

  const ricercaSteps = (ricerca.step_states ?? {}) as Record<string, StepState>;
  const f2Entries = Object.entries(ricercaSteps).filter(([k]) => k.startsWith('f2_'));
  if (f2Entries.length === 0) {
    console.log(`[warn] La ricerca "${ricerca.context_id}" non ha step F2 in step_states. Niente da copiare.`);
    return;
  }

  const f2StepsCompleted = (ricerca.steps_completed ?? []).filter((s) => s.startsWith('f2_'));

  console.log(`Tema     : ${tema.context_id}`);
  console.log(`Ricerca  : ${ricerca.context_id}`);
  console.log(`Step F2 da copiare: ${f2Entries.length}`);
  for (const [stepId, st] of f2Entries) {
    console.log(`  - ${stepId}  status=${st.status}  output_file=${st.output_file ?? '(null)'}`);
  }
  console.log(`steps_completed F2: ${JSON.stringify(f2StepsCompleted)}`);

  if (dryRun) {
    console.log('\n[dry-run] nessuna modifica scritta.');
    return;
  }

  const set: Record<string, unknown> = {};
  for (const [stepId, st] of f2Entries) {
    set[`step_states.${stepId}`] = st;
  }

  const result = await coll.updateOne(
    { context_id: temaId, context_type: 'tema' },
    {
      $set: set,
      $addToSet: { steps_completed: { $each: f2StepsCompleted } },
    },
  );
  console.log(`\n[mongo] tema aggiornato. matched=${result.matchedCount} modified=${result.modifiedCount}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter(Boolean);
  const dryRun = args.includes('--dry-run');
  const temaId = args.find((a) => !a.startsWith('--'));
  if (!temaId) {
    console.error('Manca <temaId>. Uso: npm run inherit:f2-steps -- <temaId> [--dry-run]');
    process.exitCode = 1;
    return;
  }

  await connectMongo();
  try {
    await patchTema(temaId, dryRun);
  } finally {
    await mongoose.disconnect();
    console.log('[mongo] disconnesso');
  }
}

main().catch((err) => {
  console.error('Errore:', err);
  process.exitCode = 1;
});
