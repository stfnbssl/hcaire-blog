import mongoose, { Document, Schema } from 'mongoose';

export interface IOutputTemplate extends Document {
  bartlebyId: string;
  name: string;
  slug: string;
  description: string;
  structure_schema: Schema.Types.Mixed;
  audience_type: string;
  language_constraints: Schema.Types.Mixed;
  applicable_areas?: string[];
  status: string;
  version: string;
}

const OutputTemplateSchema = new Schema<IOutputTemplate>({
  bartlebyId:           { type: String, required: true, unique: true },
  name:                 { type: String, required: true },
  slug:                 { type: String, required: true },
  description:          String,
  structure_schema:     Schema.Types.Mixed,
  audience_type:        String,
  language_constraints: Schema.Types.Mixed,
  applicable_areas:     [String],
  status:               { type: String, default: 'approved' },
  version:              { type: String, default: '1.0' },
}, { collection: 'bartleby_output_templates' });

export default mongoose.model<IOutputTemplate>('BartlebyOutputTemplate', OutputTemplateSchema);
