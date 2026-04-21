import mongoose, { Document, Schema } from 'mongoose';

export interface IOutputDocument extends Document {
  bartlebyId: string;
  input_trace_id: string;
  generation_plan_id?: string;
  user_id?: string;
  output_type: string;
  title: string;
  body: string;
  body_summary?: string;
  audience: string;
  area_id: string;
  activated_nodes: string[];
  skills_used: string[];
  evaluation?: Schema.Types.Mixed;
  status: string;
  version: string;
  created_at?: string;
}

const OutputDocumentSchema = new Schema<IOutputDocument>({
  bartlebyId:         { type: String, required: true, unique: true },
  input_trace_id:     { type: String, required: true },
  generation_plan_id: String,
  user_id:            String,
  output_type:        { type: String, required: true },
  title:              { type: String, required: true },
  body:               { type: String, required: true },
  body_summary:       String,
  audience:           String,
  area_id:            String,
  activated_nodes:    [String],
  skills_used:        [String],
  evaluation:         Schema.Types.Mixed,
  status:             { type: String, default: 'revisionato' },
  version:            { type: String, default: '1.0' },
  created_at:         String,
}, { collection: 'bartleby_output_documents' });

export default mongoose.model<IOutputDocument>('BartlebyOutputDocument', OutputDocumentSchema);
