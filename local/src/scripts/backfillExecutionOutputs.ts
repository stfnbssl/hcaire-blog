// Backfill di pipeline_step_executions.output_data per execution preesistenti
// alla feature di mirroring su MongoDB.
//
// Cosa fa:
//   1. Connette a MongoDB Atlas (stesse credenziali del local server).
//   2. Cerca tutte le execution con output_file valorizzato ma output_data null/undefined.
//   3. Per ognuna risolve il path sotto OUTPUT_ROOT, legge il file, valida come JSON
//      e scrive il contenuto parsato in output_data.
//   4. Skippa con warning se il file manca o non è JSON valido.
//
// Uso:
//   npm run backfill:outputs               # backfill completo
//   npm run backfill:outputs -- --dry-run  # mostra cosa farebbe senza scrivere
//
// Sicuro da rilanciare: idempotente (scrive solo se output_data è ancora null).

import 'dotenv/config';
import { promises as fs } from 'fs';
import { join, isAbsolute } from 'path';
import mongoose from 'mongoose';

const OUTPUT_ROOT = process.env.PIPELINE_OUTPUT_ROOT
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/output/produzioni';

async function connectMongo(): Promise<void> {
  const password = process.env.MONGODB_PASSWORD;
  const urlTpl = process.env.MONGODB_URL;
  if (!password || !urlTpl) {
    throw new Error('MONGODB_PASSWORD e MONGODB_URL devono essere settati in local/.env');
  }
  const url = urlTpl.replace('{password}', password).replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
}

function resolveAbs(rel: string): string {
  if (isAbsolute(rel)) return rel;
  return join(OUTPUT_ROOT, rel);
}

async function main(): Promise<void> {
  const dryRun = process.argv.slice(2).includes('--dry-run');

  await connectMongo();
  const db = mongoose.connection.db;
  if (!db) throw new Error('Connessione Mongo non pronta');
  const coll = db.collection('pipeline_step_executions');

  const cursor = coll.find({
    output_file: { $ne: null },
    $or: [{ output_data: null }, { output_data: { $exists: false } }],
  }, { projection: { _id: 1, context_id: 1, step_id: 1, run_number: 1, output_file: 1 } });

  let scanned = 0;
  let updated = 0;
  let skippedMissing = 0;
  let skippedInvalid = 0;

  while (await cursor.hasNext()) {
    const exec = await cursor.next();
    if (!exec) break;
    scanned++;

    const rel = exec.output_file as string;
    const abs = resolveAbs(rel);
    const tag = `${exec.context_id}/${exec.step_id} run#${exec.run_number}`;

    let raw: string;
    try {
      raw = await fs.readFile(abs, 'utf8');
    } catch {
      console.warn(`  [skip] ${tag}: file non trovato (${abs})`);
      skippedMissing++;
      continue;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn(`  [skip] ${tag}: JSON non valido (${(err as Error).message})`);
      skippedInvalid++;
      continue;
    }

    if (dryRun) {
      console.log(`  [dry] ${tag}: pronto (${raw.length.toLocaleString()} char)`);
    } else {
      await coll.updateOne({ _id: exec._id }, { $set: { output_data: parsed } });
      console.log(`  [ok ] ${tag}: backfillato`);
    }
    updated++;
  }

  await mongoose.disconnect();

  console.log('');
  console.log(`Scansionate: ${scanned}`);
  console.log(`${dryRun ? 'Da aggiornare' : 'Aggiornate'}: ${updated}`);
  if (skippedMissing) console.log(`Skip per file mancante: ${skippedMissing}`);
  if (skippedInvalid) console.log(`Skip per JSON invalido: ${skippedInvalid}`);
}

main().catch((err) => {
  console.error('Errore:', err);
  process.exitCode = 1;
});
