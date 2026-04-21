import mongoose, { Document, Schema } from 'mongoose';

// FoundationDocument ↔ ConceptNode
export interface IFoundationDocumentNode extends Document {
  foundation_document_id: string;
  concept_node_id: string;
  relation_type: string;
}
const FoundationDocumentNodeSchema = new Schema<IFoundationDocumentNode>({
  foundation_document_id: { type: String, required: true },
  concept_node_id:        { type: String, required: true },
  relation_type:          { type: String, required: true },
}, { collection: 'bartleby_foundation_document_nodes' });
export const FoundationDocumentNode = mongoose.model<IFoundationDocumentNode>(
  'BartlebyFoundationDocumentNode', FoundationDocumentNodeSchema
);

// AreaSheet ↔ ConceptNode
export interface IAreaSheetNode extends Document {
  area_sheet_id: string;
  concept_node_id: string;
  priority_in_area: string;
}
const AreaSheetNodeSchema = new Schema<IAreaSheetNode>({
  area_sheet_id:    { type: String, required: true },
  concept_node_id:  { type: String, required: true },
  priority_in_area: { type: String, required: true },
}, { collection: 'bartleby_area_sheet_nodes' });
export const AreaSheetNode = mongoose.model<IAreaSheetNode>(
  'BartlebyAreaSheetNode', AreaSheetNodeSchema
);

// Skill ↔ ConceptNode
export interface ISkillNode extends Document {
  skill_id: string;
  concept_node_id: string;
  relation_type: string;
}
const SkillNodeSchema = new Schema<ISkillNode>({
  skill_id:        { type: String, required: true },
  concept_node_id: { type: String, required: true },
  relation_type:   { type: String, required: true },
}, { collection: 'bartleby_skill_nodes' });
export const SkillNode = mongoose.model<ISkillNode>(
  'BartlebySkillNode', SkillNodeSchema
);

// Skill ↔ DomainArea
export interface ISkillArea extends Document {
  skill_id: string;
  domain_area_id: string;
  relation_type: string;
}
const SkillAreaSchema = new Schema<ISkillArea>({
  skill_id:       { type: String, required: true },
  domain_area_id: { type: String, required: true },
  relation_type:  { type: String, required: true },
}, { collection: 'bartleby_skill_areas' });
export const SkillArea = mongoose.model<ISkillArea>(
  'BartlebySkillArea', SkillAreaSchema
);
