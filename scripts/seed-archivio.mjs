#!/usr/bin/env node
// seed-archivio — popola la collection `temi` con i candidati hardcoded usati
// oggi da SviluppoBambinoProduzioniTemiPage. Idempotente: skippa i record con
// tema_id già esistente, così può essere rieseguito senza causare duplicati.
//
// Origine: client/src/data/theme-discovery-v1.json (10 candidati vetted).
// Stato target: 'maturo' (sono temi già scelti, pronti alla promozione).
//
// Esecuzione:
//   node scripts/seed-archivio.mjs
//
// Richiede MONGODB_URL + MONGODB_PASSWORD nell'env (server/.env).

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── Config ───────────────────────────────────────────────────────────────

const SEED_FILE = resolve(ROOT, 'client/src/data/theme-discovery-v1.json');
const SEED_STATO = 'maturo';

// ─── Slugify (kebab-case alfanumerico) ────────────────────────────────────

function slugify(label) {
  return label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Schema (locale per non importare TS) ─────────────────────────────────

const TemaSchema = new mongoose.Schema(
  {
    tema_id: { type: String, required: true, unique: true, trim: true },
    label:   { type: String, required: true, trim: true },
    stato:   { type: String, default: 'bozza' },
    descrizione:      { type: String, default: '' },
    fonti:            { type: [String], default: [] },
    asse_dominante:   { type: String, default: null },
    note_ricercatore: { type: String, default: '' },
    promosso_at:    { type: Date, default: null },
    parcheggiato_at: { type: Date, default: null },
    abbandonato_at:  { type: Date, default: null },
    archiviato_at:   { type: Date, default: null },
  },
  { timestamps: true, collection: 'temi' },
);

const Tema = mongoose.models['Tema'] ?? mongoose.model('Tema', TemaSchema);

// ─── Mapping JSON candidato → record Tema ─────────────────────────────────

function candidateToTema(c) {
  const label = c.theme_label_provisional ?? '(senza titolo)';
  const tema_id = slugify(label);

  // descrizione = definition_draft ?? what_it_is
  const descrizione = c.definition_draft ?? c.what_it_is ?? '';

  // note_ricercatore: combinazione di starting_point + why_it_matters per dare contesto
  const noteParts = [];
  if (c.starting_point) noteParts.push(`**Starting point**\n${c.starting_point}`);
  if (c.why_it_matters) noteParts.push(`**Perché conta**\n${c.why_it_matters}`);
  if (c.what_it_is_not) noteParts.push(`**Cosa non è**\n${c.what_it_is_not}`);
  const note_ricercatore = noteParts.join('\n\n');

  // asse_dominante = primo asse in possible_axes_involved
  const asse_dominante = Array.isArray(c.possible_axes_involved) && c.possible_axes_involved[0]?.axis_id
    ? c.possible_axes_involved[0].axis_id
    : null;

  // fonti = source_title dei source_signals
  const fonti = Array.isArray(c.source_signals)
    ? c.source_signals
        .map((s) => (typeof s.source_title === 'string' ? s.source_title : null))
        .filter(Boolean)
    : [];

  return {
    tema_id,
    label,
    stato: SEED_STATO,
    descrizione,
    fonti,
    asse_dominante,
    note_ricercatore,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━ Seed Archivio temi ━━━');
  console.log(`  source: ${SEED_FILE}`);

  let raw;
  try {
    raw = readFileSync(SEED_FILE, 'utf8');
  } catch (e) {
    console.error(`✗ Impossibile leggere ${SEED_FILE}:`, e.message);
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error(`✗ JSON non valido:`, e.message);
    process.exit(1);
  }

  const candidati = Array.isArray(parsed.candidate_themes) ? parsed.candidate_themes : [];
  console.log(`  candidati nel file: ${candidati.length}`);

  // Connessione Mongo
  const password = process.env.MONGODB_PASSWORD;
  const urlTpl = process.env.MONGODB_URL;
  if (!password || !urlTpl) {
    console.error('✗ MONGODB_PASSWORD o MONGODB_URL mancanti nell\'env');
    process.exit(1);
  }
  const url = urlTpl.replace('{password}', password).replace('/?', '/hcaire_db?');
  await mongoose.connect(url);
  console.log('  ✓ MongoDB connesso');

  // Per ogni candidato: skip se tema_id già esistente
  let inserted = 0;
  let skipped = 0;
  for (const c of candidati) {
    const tema = candidateToTema(c);
    if (!tema.tema_id) {
      console.warn(`  ⚠ candidato senza label utilizzabile, skip`);
      continue;
    }

    const exists = await Tema.findOne({ tema_id: tema.tema_id });
    if (exists) {
      skipped++;
      console.log(`  · skip "${tema.tema_id}" (già esistente, stato attuale: ${exists.stato})`);
      continue;
    }

    try {
      await Tema.create(tema);
      inserted++;
      console.log(`  ✓ creato "${tema.tema_id}" (stato: ${tema.stato})`);
    } catch (e) {
      console.error(`  ✗ errore creando "${tema.tema_id}":`, e.message);
    }
  }

  console.log('');
  console.log(`  Riepilogo: ${inserted} inseriti · ${skipped} skip · ${candidati.length - inserted - skipped} errori`);

  await mongoose.disconnect();
  console.log('  ✓ MongoDB disconnesso');
}

main().catch((err) => {
  console.error('✗ Errore non gestito:', err);
  process.exit(1);
});
