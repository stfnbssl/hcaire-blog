import mongoose, { Schema, Document, Types } from 'mongoose';
import type { ExecutionStatus, VerificaOutcome } from './PipelineContext';

export type LogLevel = 'info' | 'warn' | 'error';

export interface ILogLine {
  ts: Date;
  text: string;
  level: LogLevel;
}

export interface IExecutionInputPipeline {
  step_id: string;
  run_number: number;
  file: string;
}

export interface IExecutionInputEsterno {
  input_id: string;
  external_input_doc_id: Types.ObjectId;
  file: string | null;
}

export interface IExecutionDispositivoSorgente {
  tema_id: string;
  file: string;
}

export interface IExecutionInputs {
  pipeline: IExecutionInputPipeline[];
  esterni: IExecutionInputEsterno[];
  strutturali: string[];
  dispositivo_sorgente: IExecutionDispositivoSorgente | null;
}

export type ExecutionErrorSource = 'cowork' | 'sistema' | 'timeout';

export interface IExecutionError {
  message: string;
  source: ExecutionErrorSource;
  detail: string | null;
}

export interface IPipelineStepExecution extends Document {
  context_type: 'ricerca' | 'tema';
  context_id: string;
  step_id: string;
  run_number: number;

  status: ExecutionStatus;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  verified_at: Date | null;
  verified_by: string | null;

  inputs: IExecutionInputs;

  output_file: string | null;
  output_data: unknown;

  cowork_message_id: string | null;
  cowork_session_id: string | null;

  log_lines: ILogLine[];

  error: IExecutionError | null;

  verifica_required: boolean;
  verifica_notes: string | null;
  verifica_outcome: VerificaOutcome | null;
  verifica_feedback: string | null;

  is_skipped: boolean;
  skip_reason: string | null;
}

const LogLineSchema = new Schema<ILogLine>(
  {
    ts:    { type: Date, required: true, default: Date.now },
    text:  { type: String, required: true },
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  },
  { _id: false },
);

const InputPipelineSchema = new Schema<IExecutionInputPipeline>(
  {
    step_id:    { type: String, required: true },
    run_number: { type: Number, required: true },
    file:       { type: String, required: true },
  },
  { _id: false },
);

const InputEsternoSchema = new Schema<IExecutionInputEsterno>(
  {
    input_id:              { type: String, required: true },
    external_input_doc_id: { type: Schema.Types.ObjectId, ref: 'PipelineExternalInput', required: true },
    file:                  { type: String, default: null },
  },
  { _id: false },
);

const DispositivoSorgenteRefSchema = new Schema<IExecutionDispositivoSorgente>(
  {
    tema_id: { type: String, required: true },
    file:    { type: String, required: true },
  },
  { _id: false },
);

const ExecutionInputsSchema = new Schema<IExecutionInputs>(
  {
    pipeline:             { type: [InputPipelineSchema], default: [] },
    esterni:              { type: [InputEsternoSchema], default: [] },
    strutturali:          { type: [String], default: [] },
    dispositivo_sorgente: { type: DispositivoSorgenteRefSchema, default: null },
  },
  { _id: false },
);

const ExecutionErrorSchema = new Schema<IExecutionError>(
  {
    message: { type: String, required: true },
    source:  { type: String, enum: ['cowork', 'sistema', 'timeout'], required: true },
    detail:  { type: String, default: null },
  },
  { _id: false },
);

const PipelineStepExecutionSchema = new Schema<IPipelineStepExecution>(
  {
    context_type: { type: String, enum: ['ricerca', 'tema'], required: true },
    context_id:   { type: String, required: true },
    step_id:      { type: String, required: true },
    run_number:   { type: Number, required: true },

    status:      { type: String, required: true, default: 'non_avviato' },
    created_at:  { type: Date, default: Date.now },
    started_at:  { type: Date, default: null },
    completed_at:{ type: Date, default: null },
    verified_at: { type: Date, default: null },
    verified_by: { type: String, default: null },

    inputs: { type: ExecutionInputsSchema, default: () => ({}) },

    output_file: { type: String, default: null },
    output_data: { type: Schema.Types.Mixed, default: null },

    cowork_message_id: { type: String, default: null },
    cowork_session_id: { type: String, default: null },

    log_lines: { type: [LogLineSchema], default: [] },

    error: { type: ExecutionErrorSchema, default: null },

    verifica_required: { type: Boolean, default: false },
    verifica_notes:    { type: String, default: null },
    verifica_outcome:  { type: String, default: null },
    verifica_feedback: { type: String, default: null },

    is_skipped:  { type: Boolean, default: false },
    skip_reason: { type: String, default: null },
  },
  { collection: 'pipeline_step_executions', timestamps: false },
);

// Lookup primario: ultima esecuzione di uno step per un context (ordinato decrescente per run_number)
PipelineStepExecutionSchema.index({ context_id: 1, step_id: 1, run_number: -1 });

// Esecuzioni attive (per il polling del server di orchestrazione)
PipelineStepExecutionSchema.index(
  { status: 1 },
  { partialFilterExpression: { status: { $in: ['in_coda', 'in_esecuzione'] } } },
);

// Lookup per cowork_message_id (per ricevere le risposte dal server locale)
PipelineStepExecutionSchema.index({ cowork_message_id: 1 }, { sparse: true });

// Audit trail di un context
PipelineStepExecutionSchema.index({ context_id: 1, created_at: -1 });

export default mongoose.model<IPipelineStepExecution>('PipelineStepExecution', PipelineStepExecutionSchema);
