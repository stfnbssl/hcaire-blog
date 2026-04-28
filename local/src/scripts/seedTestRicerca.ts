// Seed di un context "ricerca" di test per esercitare F2 partendo dallo step 2.
//
// Cosa fa:
//   1. (opzionale) elenca le ricerche già presenti in OUTPUT_ROOT da cui copiare il theme-discovery.
//   2. Copia il theme-discovery-v*.json scelto in OUTPUT_ROOT/ricerche/test-pipeline-fase2/theme-discovery-v1.json
//      (ricreando la cartella se non esiste).
//   3. Connette a MongoDB Atlas (stesso URL/password del local server) e upsert del PipelineContext
//      con step_states.f2_step_1 = 'completato' e output_file puntato al file copiato.
//
// Uso:
//   npm run seed:test-ricerca                                   # default ricerca-01-comunicazione-precoce
//   npm run seed:test-ricerca -- ricerca-02-pointing-precoce    # specifica la sorgente
//   npm run seed:test-ricerca -- --list                         # elenca le sorgenti disponibili e esce
//
// Il context "test-pipeline-fase2" diventa visibile nel PipelineMap perché getPipelineIndex
// (server/src/services/pipelineService.ts) legge da MongoDB. Niente da rigenerare staticamente.

import 'dotenv/config';
import { promises as fs } from 'fs';
import { join, basename } from 'path';
import mongoose from 'mongoose';

const OUTPUT_ROOT = process.env.PIPELINE_OUTPUT_ROOT
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/output/produzioni';

const TEST_CONTEXT_ID = 'test-pipeline-fase2';
const TEST_LABEL      = 'Test pipeline F2';
const DEFAULT_SOURCE  = 'ricerca-01-comunicazione-precoce';

async function listSources(): Promise<string[]> {
  const ricercheRoot = join(OUTPUT_ROOT, 'ricerche');
  let entries: string[];
  try {
    entries = await fs.readdir(ricercheRoot);
  } catch {
    console.error(`Nessuna cartella in ${ricercheRoot}`);
    return [];
  }
  const valid: string[] = [];
  for (const e of entries) {
    if (e === TEST_CONTEXT_ID) continue;
    const folder = join(ricercheRoot, e);
    const st = await fs.stat(folder).catch(() => null);
    if (!st || !st.isDirectory()) continue;
    const files = await fs.readdir(folder);
    if (files.some((f) => /^theme-discovery-v\d+\.json$/i.test(f))) {
      valid.push(e);
    }
  }
  return valid.sort();
}

async function findThemeDiscovery(sourceId: string): Promise<string> {
  const folder = join(OUTPUT_ROOT, 'ricerche', sourceId);
  const files = await fs.readdir(folder);
  const candidates = files.filter((f) => /^theme-discovery-v\d+\.json$/i.test(f)).sort();
  if (candidates.length === 0) {
    throw new Error(`Nessun theme-discovery-v*.json in ${folder}`);
  }
  // Prendi la versione più alta (es. v2 batte v1)
  candidates.sort((a, b) => {
    const va = Number(a.match(/v(\d+)/)?.[1] ?? 0);
    const vb = Number(b.match(/v(\d+)/)?.[1] ?? 0);
    return vb - va;
  });
  return join(folder, candidates[0]);
}

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

async function upsertContext(outputFileRel: string): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) throw new Error('Connessione Mongo non pronta');
  const coll = db.collection('pipeline_contexts');
  const now = new Date();
  const stepState = {
    status: 'completato',
    current_run: 1,
    last_execution_id: null,
    output_file: outputFileRel,
    verifica_outcome: null,
    updated_at: now,
  };
  const result = await coll.updateOne(
    { context_id: TEST_CONTEXT_ID },
    {
      $set: {
        context_type: 'ricerca',
        context_id: TEST_CONTEXT_ID,
        label: TEST_LABEL,
        theme_id: null,
        ricerca_origine: null,
        dispositivo_sorgente: null,
        'step_states.f2_step_1': stepState,
        pending_decision: null,
        updatedAt: now,
      },
      $addToSet: { steps_completed: 'f2_step_1' },
      $setOnInsert: {
        steps_in_progress: [],
        steps_failed: [],
        robustezza: null,
        correzioni_residue: 0,
        has_revisioni: false,
        createdAt: now,
      },
    },
    { upsert: true },
  );
  console.log(`[mongo] context "${TEST_CONTEXT_ID}" ${result.upsertedCount ? 'creato' : 'aggiornato'}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((a) => !!a);

  if (args.includes('--list')) {
    const sources = await listSources();
    console.log('Sorgenti disponibili:');
    for (const s of sources) console.log(`  - ${s}`);
    return;
  }

  const source = args[0] ?? DEFAULT_SOURCE;
  console.log(`Sorgente: ${source}`);

  const srcPath = await findThemeDiscovery(source);
  console.log(`File sorgente: ${srcPath}`);

  // Valida JSON
  const raw = await fs.readFile(srcPath, 'utf8');
  JSON.parse(raw);

  const destDir  = join(OUTPUT_ROOT, 'ricerche', TEST_CONTEXT_ID);
  const destPath = join(destDir, 'theme-discovery-v1.json');
  await fs.mkdir(destDir, { recursive: true });
  await fs.copyFile(srcPath, destPath);
  console.log(`File copiato → ${destPath}  (origine: ${basename(srcPath)})`);

  await connectMongo();
  try {
    await upsertContext(`ricerche/${TEST_CONTEXT_ID}/theme-discovery-v1.json`);
  } finally {
    await mongoose.disconnect();
    console.log('[mongo] disconnesso');
  }

  console.log('');
  console.log(`✓ Bootstrap completato.`);
  console.log(`  Apri: /sviluppo-bambino/produzioni/pipeline/ricerche/${TEST_CONTEXT_ID}`);
  console.log(`  La ricerca apparirà anche nella mappa pipeline (caricata da MongoDB).`);
  console.log(`  Step 2 richiede l'input esterno "scelta_tema" — fornisci il tema scelto`);
  console.log(`  tra i candidati di step 1 prima di lanciare.`);
}

main().catch((err) => {
  console.error('Errore:', err);
  process.exitCode = 1;
});
