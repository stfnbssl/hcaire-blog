import mongoose, { Document, Schema } from 'mongoose';

export interface IConceptNode extends Document {
  bartlebyId: string;
  name: string;
  slug: string;
  definition: string;
  why_transversal: string;
  dimensions_involved: string[];
  typical_manifestations: string[];
  area_lexicons: Record<string, string>;
  guiding_questions: string[];
  reduction_risks: string[];
  presence_indicators: string[];
  impoverishment_indicators: string[];
  related_nodes: string[];
  priority_level: string;
  status: string;
  version: string;
  source_document_id?: string;
}

const ConceptNodeSchema = new Schema<IConceptNode>({
  bartlebyId:                { type: String, required: true, unique: true },
  name:                      { type: String, required: true },
  slug:                      { type: String, required: true },
  definition:                { type: String, required: true },
  why_transversal:           { type: String, required: true },
  dimensions_involved:       [String],
  typical_manifestations:    [String],
  area_lexicons:             { type: Schema.Types.Mixed, default: {} },
  guiding_questions:         [String],
  reduction_risks:           [String],
  presence_indicators:       [String],
  impoverishment_indicators: [String],
  related_nodes:             [String],
  priority_level:            { type: String, default: 'primario' },
  status:                    { type: String, default: 'approved' },
  version:                   { type: String, default: '1.0' },
  source_document_id:        String,
}, { collection: 'bartleby_concept_nodes' });

export default mongoose.model<IConceptNode>('BartlebyConceptNode', ConceptNodeSchema);
