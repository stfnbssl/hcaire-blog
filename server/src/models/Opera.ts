import mongoose, { Schema, Document } from 'mongoose';

export type OperaStato = 'in_attesa' | 'in_corso' | 'completata' | 'sospesa';
export type OperaStepStato = 'non_avviato' | 'in_coda' | 'in_esecuzione' | 'completato' | 'errore';
export type OperaTipologia = 'romanzo' | 'racconto' | 'film' | 'opera teatrale' | 'saggio narrativo' | 'altro';

export const LETTURE_TIPOLOGIE: OperaTipologia[] = [
  'romanzo', 'racconto', 'film', 'opera teatrale', 'saggio narrativo', 'altro',
];

export const LETTURE_STEP_STATI: OperaStepStato[] = [
  'non_avviato', 'in_coda', 'in_esecuzione', 'completato', 'errore',
];

export const LETTURE_STATI: OperaStato[] = ['in_attesa', 'in_corso', 'completata', 'sospesa'];

// Step ID convention: usata in API e su Redis. L'ordine dichiara la sequenza canonica.
export const LETTURE_STEP_IDS = [
  'step_1', 'step_2', 'step_3', 'step_4',
  'step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f',
] as const;
export type LettureStepId = typeof LETTURE_STEP_IDS[number];

// Step che producono un Markdown affiancato al JSON. Solo per questi `testo` è popolato.
export const LETTURE_STEP_IDS_CON_TESTO: LettureStepId[] = ['step_5d', 'step_5e', 'step_5f'];

export type OperaLogLevel = 'info' | 'warn' | 'error';

export interface IOperaLogLine {
  ts: Date;
  text: string;
  level: OperaLogLevel;
}

export interface IOperaStepBase {
  stato: OperaStepStato;
  completato_il: Date | null;
  started_at: Date | null;
  output: unknown;
  errore: string | null;
  log_lines: IOperaLogLine[];
}

export interface IOperaStepConTesto extends IOperaStepBase {
  testo: string | null;
}

export interface IOperaPipeline {
  step_1:  IOperaStepBase;
  step_2:  IOperaStepBase;
  step_3:  IOperaStepBase;
  step_4:  IOperaStepBase;
  step_5a: IOperaStepBase;
  step_5b: IOperaStepBase;
  step_5c: IOperaStepBase;
  step_5d: IOperaStepConTesto;
  step_5e: IOperaStepConTesto;
  step_5f: IOperaStepConTesto;
}

export interface IOpera extends Document {
  slug: string;
  titolo: string;
  autore: string;
  anno: number | null;
  tipologia: OperaTipologia;
  lingua_originale: string | null;

  stato: OperaStato;
  priorita: number | null;
  note_di_ingresso: string;

  pipeline: IOperaPipeline;

  createdAt: Date;
  updatedAt: Date;
}

const LogLineSchema = new Schema<IOperaLogLine>(
  {
    ts:    { type: Date, required: true, default: Date.now },
    text:  { type: String, required: true },
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  },
  { _id: false },
);

const StepBaseSchema = new Schema<IOperaStepBase>(
  {
    stato:         { type: String, enum: LETTURE_STEP_STATI, default: 'non_avviato' },
    completato_il: { type: Date, default: null },
    started_at:    { type: Date, default: null },
    output:        { type: Schema.Types.Mixed, default: null },
    errore:        { type: String, default: null },
    log_lines:     { type: [LogLineSchema], default: [] },
  },
  { _id: false },
);

const StepConTestoSchema = new Schema<IOperaStepConTesto>(
  {
    stato:         { type: String, enum: LETTURE_STEP_STATI, default: 'non_avviato' },
    completato_il: { type: Date, default: null },
    started_at:    { type: Date, default: null },
    output:        { type: Schema.Types.Mixed, default: null },
    errore:        { type: String, default: null },
    log_lines:     { type: [LogLineSchema], default: [] },
    testo:         { type: String, default: null },
  },
  { _id: false },
);

const PipelineSchema = new Schema<IOperaPipeline>(
  {
    step_1:  { type: StepBaseSchema,    default: () => ({}) },
    step_2:  { type: StepBaseSchema,    default: () => ({}) },
    step_3:  { type: StepBaseSchema,    default: () => ({}) },
    step_4:  { type: StepBaseSchema,    default: () => ({}) },
    step_5a: { type: StepBaseSchema,    default: () => ({}) },
    step_5b: { type: StepBaseSchema,    default: () => ({}) },
    step_5c: { type: StepBaseSchema,    default: () => ({}) },
    step_5d: { type: StepConTestoSchema, default: () => ({}) },
    step_5e: { type: StepConTestoSchema, default: () => ({}) },
    step_5f: { type: StepConTestoSchema, default: () => ({}) },
  },
  { _id: false },
);

const OperaSchema = new Schema<IOpera>(
  {
    slug:             { type: String, required: true, unique: true, trim: true },
    titolo:           { type: String, required: true, trim: true },
    autore:           { type: String, required: true, trim: true },
    anno:             { type: Number, default: null },
    tipologia:        { type: String, enum: LETTURE_TIPOLOGIE, required: true },
    lingua_originale: { type: String, default: null, trim: true },

    stato:            { type: String, enum: LETTURE_STATI, default: 'in_attesa' },
    priorita:         { type: Number, min: 1, max: 5, default: null },
    note_di_ingresso: { type: String, default: '' },

    pipeline: { type: PipelineSchema, default: () => ({}) },
  },
  { timestamps: true, collection: 'opere' },
);

// Ordinamento coda admin (priorità asc, opere senza priorità in coda).
OperaSchema.index({ stato: 1, priorita: 1 });

// Filtro opere pubbliche: pagina indice carica solo step_5d completato.
OperaSchema.index({ 'pipeline.step_5d.stato': 1, 'pipeline.step_5d.completato_il': -1 });

export default mongoose.model<IOpera>('Opera', OperaSchema);
