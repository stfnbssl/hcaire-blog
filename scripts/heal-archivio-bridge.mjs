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
  {
    tema_id: String, label: String, stato: String,
    descrizione: String, fonti: [String], asse_dominante: String, note_ricercatore: String,
  },
  { collection: 'temi', strict: false },
);
const Tema = mongoose.models['Tema'] ?? mongoose.model('Tema', TemaSchema);

const PipelineExternalInputSchema = new mongoose.Schema(
  {
    context_type: String, context_id: String, step_id: String, input_id: String, label: String,
    provided_by: String, provided_at: Date,
    data: mongoose.Schema.Types.Mixed,
    file_path: { type: String, default: null },
    is_superseded: { type: Boolean, default: false },
    superseded_by: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { collection: 'pipeline_external_inputs', timestamps: false },
);
const PipelineExternalInput = mongoose.models['PipelineExternalInput']
  ?? mongoose.model('PipelineExternalInput', PipelineExternalInputSchema);

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

  let healedContext = 0;
  let healedSceltaTema = 0;
  for (const t of temi) {
    // 1. PipelineContext
    const ctx = await PipelineContext.findOne({ context_id: t.tema_id });
    if (!ctx) {
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
        healedContext++;
        console.log(`  ✓ "${t.tema_id}" → PipelineContext creato`);
      } catch (e) {
        console.error(`  ✗ errore PipelineContext "${t.tema_id}":`, e.message);
      }
    }

    // 2. PipelineExternalInput scelta_tema per f2_step_2
    const sceltaTema = await PipelineExternalInput.findOne({
      context_id: t.tema_id, step_id: 'f2_step_2', input_id: 'scelta_tema', is_superseded: false,
    });
    if (!sceltaTema) {
      try {
        await PipelineExternalInput.create({
          context_type: 'ricerca',
          context_id: t.tema_id,
          step_id: 'f2_step_2',
          input_id: 'scelta_tema',
          label: 'Scelta del tema (atto/fenomeno) — auto da Archivio (heal)',
          provided_by: 'archivio:heal',
          provided_at: new Date(),
          data: {
            tema_id: t.tema_id,
            tema_label: t.label,
            descrizione: t.descrizione || '',
            asse_dominante_presunto: t.asse_dominante || null,
            fonti: t.fonti || [],
            motivazione: t.note_ricercatore || '',
          },
          file_path: null,
          is_superseded: false,
          superseded_by: null,
        });
        healedSceltaTema++;
        console.log(`  ✓ "${t.tema_id}" → scelta_tema auto-popolato`);
      } catch (e) {
        console.error(`  ✗ errore scelta_tema "${t.tema_id}":`, e.message);
      }
    }
  }

  console.log('');
  console.log(`  Riepilogo: ${healedContext} PipelineContext riparati · ${healedSceltaTema} scelta_tema auto-popolati · su ${temi.length} temi totali`);

  await mongoose.disconnect();
  console.log('  ✓ MongoDB disconnesso');
}

main().catch((e) => {
  console.error('✗ Errore non gestito:', e);
  process.exit(1);
});
