import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPipelineExternalInput extends Document {
  context_type: 'ricerca' | 'tema';
  context_id: string;
  step_id: string;
  input_id: string;
  label: string;

  provided_by: string;
  provided_at: Date;

  data: Record<string, unknown>;
  file_path: string | null;

  is_superseded: boolean;
  superseded_by: Types.ObjectId | null;
}

const PipelineExternalInputSchema = new Schema<IPipelineExternalInput>(
  {
    context_type: { type: String, enum: ['ricerca', 'tema'], required: true },
    context_id:   { type: String, required: true },
    step_id:      { type: String, required: true },
    input_id:     { type: String, required: true },
    label:        { type: String, required: true },

    provided_by: { type: String, required: true },
    provided_at: { type: Date, default: Date.now },

    data:      { type: Schema.Types.Mixed, default: () => ({}) },
    file_path: { type: String, default: null },

    is_superseded: { type: Boolean, default: false },
    superseded_by: { type: Schema.Types.ObjectId, ref: 'PipelineExternalInput', default: null },
  },
  { collection: 'pipeline_external_inputs', timestamps: false },
);

// Lookup primario: "ho già un input non superseded per questo step?"
PipelineExternalInputSchema.index({ context_id: 1, step_id: 1, input_id: 1, is_superseded: 1 });

// Tutti gli input di un context (per DeviceLineage — sezione External Inputs)
PipelineExternalInputSchema.index({ context_id: 1 });

export default mongoose.model<IPipelineExternalInput>('PipelineExternalInput', PipelineExternalInputSchema);
