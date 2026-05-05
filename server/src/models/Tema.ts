// Modello del Tema — collection condivisa fra Archivio e Laboratorio (vedi
// hcaire-docs/docs/90-todo/laboratorio-d5b-backend.md §4.1.1).
//
// In questa fase MVP supporta solo l'Archivio (CRUD + promozione). Gli step_states
// della pipeline F2 e i campi di stato runtime (pending_decision, steps_completed,
// ecc.) saranno aggiunti col refactor Laboratorio (B1 in §7 del gap analysis).

import mongoose, { Schema, Document } from 'mongoose';

export type TemaStato =
  | 'bozza'
  | 'maturo'
  | 'promosso'
  | 'f2_in_corso'
  | 'f2_verificata'
  | 'parcheggiato'
  | 'abbandonato'
  | 'archiviato';

export const TEMA_STATI: TemaStato[] = [
  'bozza', 'maturo', 'promosso',
  'f2_in_corso', 'f2_verificata',
  'parcheggiato', 'abbandonato', 'archiviato',
];

// Stati in cui il record è modificabile dall'Archivio (CRUD admin).
export const TEMA_STATI_EDITABILI_ARCHIVIO: TemaStato[] = ['bozza', 'maturo'];

// Stati che vengono mostrati come "promuovibile" nella UI Archivio.
export const TEMA_STATI_PROMUOVIBILI: TemaStato[] = ['maturo'];

export const TEMA_ASSI = ['asse_1', 'asse_2', 'asse_3', 'asse_4', 'asse_5', 'asse_6'] as const;
export type TemaAsse = typeof TEMA_ASSI[number];

export interface ITema extends Document {
  tema_id: string;
  label: string;
  stato: TemaStato;

  descrizione: string;
  fonti: string[];
  asse_dominante: TemaAsse | null;
  note_ricercatore: string;

  // Timestamp di transizione di stato (popolati al cambio).
  promosso_at:    Date | null;
  parcheggiato_at: Date | null;
  abbandonato_at:  Date | null;
  archiviato_at:   Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const TemaSchema = new Schema<ITema>(
  {
    tema_id: { type: String, required: true, unique: true, trim: true },
    label:   { type: String, required: true, trim: true },
    stato:   { type: String, enum: TEMA_STATI, default: 'bozza', required: true },

    descrizione:      { type: String, default: '' },
    fonti:            { type: [String], default: [] },
    asse_dominante:   { type: String, enum: [...TEMA_ASSI, null], default: null },
    note_ricercatore: { type: String, default: '' },

    promosso_at:    { type: Date, default: null },
    parcheggiato_at: { type: Date, default: null },
    abbandonato_at:  { type: Date, default: null },
    archiviato_at:   { type: Date, default: null },
  },
  { timestamps: true, collection: 'temi' },
);

TemaSchema.index({ tema_id: 1 }, { unique: true });
TemaSchema.index({ stato: 1 });

export default mongoose.model<ITema>('Tema', TemaSchema);
