import mongoose, { Document, Schema } from 'mongoose';

export interface IAreaSheet extends Document {
  bartlebyId: string;
  domain_area_id: string;
  title: string;
  scope: string;
  main_focus: string;
  translation_of_model: string;
  priority_dimensions: Schema.Types.Mixed[];
  typical_configurations: Schema.Types.Mixed[];
  reduction_risks: Schema.Types.Mixed[];
  guiding_questions: string[];
  allowed_output_types: string[];
  language_rules: Schema.Types.Mixed;
  operational_cautions: string[];
  quality_indicators: Schema.Types.Mixed[];
  status: string;
  version: string;
}

const AreaSheetSchema = new Schema<IAreaSheet>({
  bartlebyId:             { type: String, required: true, unique: true },
  domain_area_id:         { type: String, required: true },
  title:                  { type: String, required: true },
  scope:                  String,
  main_focus:             String,
  translation_of_model:   String,
  priority_dimensions:    [Schema.Types.Mixed],
  typical_configurations: [Schema.Types.Mixed],
  reduction_risks:        [Schema.Types.Mixed],
  guiding_questions:      [String],
  allowed_output_types:   [String],
  language_rules:         Schema.Types.Mixed,
  operational_cautions:   [String],
  quality_indicators:     [Schema.Types.Mixed],
  status:                 { type: String, default: 'approved' },
  version:                { type: String, default: '1.0' },
}, { collection: 'bartleby_area_sheets' });

export default mongoose.model<IAreaSheet>('BartlebyAreaSheet', AreaSheetSchema);
