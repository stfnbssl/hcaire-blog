import mongoose, { Document, Schema } from 'mongoose';

export interface IInputTrace extends Document {
  bartlebyId?: string;
  corpus_id?: string;
  user_id?: string;
  title?: string;
  raw_text: string;
  context_notes?: string;
  target_output_type?: string;
  requested_area_id?: string;
  activated_nodes?: string[];
  trace_type?: string;
  status: string;
  created_at?: string;
}

const InputTraceSchema = new Schema<IInputTrace>({
  bartlebyId:          String,
  corpus_id:           String,
  user_id:             String,
  title:               String,
  raw_text:            { type: String, required: true },
  context_notes:       String,
  target_output_type:  String,
  requested_area_id:   String,
  activated_nodes:     [String],
  trace_type:          String,
  status:              { type: String, default: 'pending' },
  created_at:          String,
}, { collection: 'bartleby_input_traces', timestamps: true });

export default mongoose.model<IInputTrace>('BartlebyInputTrace', InputTraceSchema);
