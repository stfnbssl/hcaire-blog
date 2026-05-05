#!/usr/bin/env node
// heal-archivio-bridge — ripara i casi "orfani" del bridge Archivio→Laboratorio:
// temi che hanno stato `promosso` (o oltre) ma per cui non esiste il PipelineContext
// corrispondente. Si verifica solo se la promozione è avvenuta prima che il bridge
// fosse attivo (vedi archivioTemiController.promuoveTema).
//
// Idempotente: scansiona tutti i temi in stato di laboratorio, crea il
// PipelineContext mancante. Skippa se già presente.
//
// Esecuzione:
//   npm run heal:archivio-bridge

import 'dotenv/config';
import mongoose from 'mongoose';

const STATI_LABORATORIO = ['promosso', 'f2_in_corso', 'f2_verificata', 'parcheggiato', 'archiviato'];

// ─── Schema (locali, non importiamo i .ts) ────────────────────────────────

const TemaSchema = new mongoose.Schema(
  { tema_id: String, label: String, stato: String },
  { collection: 'temi', strict: false },
);
const Tema = mongoose.models['Tema'] ?? mongoose.model('Tema', TemaSchema);

const PipelineContextSchema = new mongoose.Schema(
  {
    context_type: String, context_id: String, label: String,
    theme_id: { type: String, default: null },
    ricerca_origine: { type: String, default: null },
    dispositivo_sorgente: { type: mongoose.Schema.Types.Mixed, default: null },
    step_states: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
    pending_decision: { type: mongoose.Schema.Types.Mixed, default: null },
    steps_completed: { type: [String], default: [] },
    steps_in_progress: { type: [String], default: [] },
    steps_failed: { type: [String], default: [] },
    robustezza: { type: String, default: null },
    correzioni_residue: { type: Number, default: 0 },
    has_revisioni: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'pipeline_contexts' },
);
const PipelineContext = mongoose.models['PipelineContext'] ?? mongoose.model('PipelineContext', PipelineContextSchema);

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━ Heal Archivio → Laboratorio bridge ━━━');

  const password = process.env.MONGODB_PASSWORD;
  const urlTpl = process.env.MONGODB_URL;
  if (!password || !urlTpl) {
    console.error('✗ MONGODB_PASSWORD o MONGODB_URL mancanti nell\'env');
    process.exit(1);
  }
  const url = urlTpl.replace('{password}', password).replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
  console.log('  ✓ MongoDB connesso');

  const temi = await Tema.find({ stato: { $in: STATI_LABORATORIO } }).lean();
  console.log(`  Temi in stato laboratorio: ${temi.length}`);

  let healed = 0;
  let alreadyOk = 0;
  for (const t of temi) {
    const ctx = await PipelineContext.findOne({ context_id: t.tema_id });
    if (ctx) {
      alreadyOk++;
      continue;
    }

    try {
      await PipelineContext.create({
        context_type: 'ricerca',
        context_id: t.tema_id,
        label: t.label,
        theme_id: null,
        ricerca_origine: null,
        dispositivo_sorgente: null,
        step_states: {},
        pending_decision: null,
        steps_completed: [],
        steps_in_progress: [],
        steps_failed: [],
        robustezza: null,
        correzioni_residue: 0,
        has_revisioni: false,
      });
      healed++;
      console.log(`  ✓ heal "${t.tema_id}" (stato: ${t.stato}) → PipelineContext creato`);
    } catch (e) {
      console.error(`  ✗ errore heal "${t.tema_id}":`, e.message);
    }
  }

  console.log('');
  console.log(`  Riepilogo: ${healed} riparati · ${alreadyOk} già ok · ${temi.length - healed - alreadyOk} errori`);

  await mongoose.disconnect();
  console.log('  ✓ MongoDB disconnesso');
}

main().catch((e) => {
  console.error('✗ Errore non gestito:', e);
  process.exit(1);
});
