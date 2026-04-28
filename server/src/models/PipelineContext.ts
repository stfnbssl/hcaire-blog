import mongoose, { Schema, Document, Types } from 'mongoose';

export type ExecutionStatus =
  | 'non_avviato'
  | 'attende_input'
  | 'attende_decisione'
  | 'in_coda'
  | 'in_esecuzione'
  | 'completato'
  | 'in_verifica'
  | 'verificato'
  | 'richiede_correzione'
  | 'saltato'
  | 'fallito';

export type VerificaOutcome = 'approvato' | 'richiede_correzione' | 'richiede_6c';

export interface IStepState {
  status: ExecutionStatus;
  current_run: number;
  last_execution_id: Types.ObjectId | null;
  output_file: string | null;
  verifica_outcome: VerificaOutcome | null;
  updated_at: Date;
}

export interface IDispositivoSorgente {
  tema_id: string;
  file: string;
  device_id: string;
}

export type HumanDecisionType = 'f2_to_f3_tema_selection' | 'step7_context_selection';

export interface IHumanDecision {
  type: HumanDecisionType;
  step_from: string;
  step_to: string;
  description: string;
  options: Record<string, unknown>[] | null;
  created_at: Date;
  decided_at: Date | null;
  decided_by: string | null;
  decision: Record<string, unknown> | null;
}

export interface IPipelineContext extends Document {
  context_type: 'ricerca' | 'tema';
  context_id: string;
  label: string;

  theme_id: string | null;
  ricerca_origine: string | null;
  dispositivo_sorgente: IDispositivoSorgente | null;

  step_states: Record<string, IStepState>;

  pending_decision: IHumanDecision | null;

  steps_completed: string[];
  steps_in_progress: string[];
  steps_failed: string[];
  robustezza: 'alta' | 'media' | 'bassa' | null;
  correzioni_residue: number;
  has_revisioni: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const DispositivoSorgenteSchema = new Schema<IDispositivoSorgente>(
  {
    tema_id:   { type: String, required: true },
    file:      { type: String, required: true },
    device_id: { type: String, required: true },
  },
  { _id: false },
);

const HumanDecisionSchema = new Schema<IHumanDecision>(
  {
    type:        { type: String, enum: ['f2_to_f3_tema_selection', 'step7_context_selection'], required: true },
    step_from:   { type: String, required: true },
    step_to:     { type: String, required: true },
    description: { type: String, default: '' },
    options:     { type: Schema.Types.Mixed, default: null },
    created_at:  { type: Date, default: Date.now },
    decided_at:  { type: Date, default: null },
    decided_by:  { type: String, default: null },
    decision:    { type: Schema.Types.Mixed, default: null },
  },
  { _id: false },
);

const PipelineContextSchema = new Schema<IPipelineContext>(
  {
    context_type: { type: String, enum: ['ricerca', 'tema'], required: true },
    context_id:   { type: String, required: true, unique: true },
    label:        { type: String, required: true },

    theme_id:             { type: String, default: null },
    ricerca_origine:      { type: String, default: null },
    dispositivo_sorgente: { type: DispositivoSorgenteSchema, default: null },

    // Mappa dinamica step_id -> StepState. Usiamo Mixed per supportare findOneAndUpdate
    // con $set puntuale su path tipo "step_states.f3_step_3.status" (vedi D2 §9).
    step_states: { type: Schema.Types.Mixed, default: () => ({}) },

    pending_decision: { type: HumanDecisionSchema, default: null },

    steps_completed:    { type: [String], default: [] },
    steps_in_progress:  { type: [String], default: [] },
    steps_failed:       { type: [String], default: [] },
    robustezza:         { type: String, enum: ['alta', 'media', 'bassa', null], default: null },
    correzioni_residue: { type: Number, default: 0 },
    has_revisioni:      { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'pipeline_contexts' },
);

PipelineContextSchema.index({ context_id: 1 }, { unique: true });
PipelineContextSchema.index({ context_type: 1 });
PipelineContextSchema.index({ ricerca_origine: 1 });

export default mongoose.model<IPipelineContext>('PipelineContext', PipelineContextSchema);
