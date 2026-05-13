import mongoose, { Schema, Document } from 'mongoose';

export type AsseStatus = 'bozza' | 'consolidato' | 'in_revisione';

export interface INamedDescription {
  name: string;
  description: string;
}

export interface IBridgeConcept {
  concept: string;
  definition: string;
  linked_nodes?: string[];
}

export interface IStructuralNode {
  node: string;
  short_definition: string;
}

export interface IInternalArticulation {
  section: string;
  function: string;
}

export interface IReductionRisk {
  type: string;
  description: string;
}

export interface ISourceDocument {
  title: string;
  format: 'markdown' | 'pdf' | 'docx' | 'txt';
  language: 'it' | 'en';
}

export interface ICompilationNotes {
  confidence_level: 'bassa' | 'media' | 'alta';
  needs_human_review: boolean;
  notes?: string;
  open_issues?: string[];
}

export interface IAsseStrutturale extends Document {
  axis_id: string;
  axis_name: string;
  version: string;
  status: AsseStatus;
  source_document: ISourceDocument;
  structural_function: string;
  core_processes: INamedDescription[];
  bridge_concepts: IBridgeConcept[];
  structural_nodes: IStructuralNode[];
  internal_articulations: IInternalArticulation[];
  reduction_risks: IReductionRisk[];
  structural_questions: string[];
  methodological_constraints: string[];
  compilation_notes: ICompilationNotes;
  _last_rebuilt: Date | null;
  _source_version: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const NamedDescriptionSchema = new Schema<INamedDescription>(
  { name: { type: String, required: true }, description: { type: String, required: true } },
  { _id: false },
);

const BridgeConceptSchema = new Schema<IBridgeConcept>(
  {
    concept: { type: String, required: true },
    definition: { type: String, required: true },
    linked_nodes: { type: [String], default: undefined },
  },
  { _id: false },
);

const StructuralNodeSchema = new Schema<IStructuralNode>(
  { node: { type: String, required: true }, short_definition: { type: String, required: true } },
  { _id: false },
);

const InternalArticulationSchema = new Schema<IInternalArticulation>(
  { section: { type: String, required: true }, function: { type: String, required: true } },
  { _id: false },
);

const ReductionRiskSchema = new Schema<IReductionRisk>(
  { type: { type: String, required: true }, description: { type: String, required: true } },
  { _id: false },
);

const SourceDocumentSchema = new Schema<ISourceDocument>(
  {
    title: { type: String, required: true },
    format: { type: String, enum: ['markdown', 'pdf', 'docx', 'txt'], required: true },
    language: { type: String, enum: ['it', 'en'], required: true },
  },
  { _id: false },
);

const CompilationNotesSchema = new Schema<ICompilationNotes>(
  {
    confidence_level: { type: String, enum: ['bassa', 'media', 'alta'], required: true },
    needs_human_review: { type: Boolean, required: true },
    notes: { type: String, default: undefined },
    open_issues: { type: [String], default: undefined },
  },
  { _id: false },
);

const AsseStrutturaleSchema = new Schema<IAsseStrutturale>(
  {
    axis_id: { type: String, required: true, unique: true, match: /^asse_[1-6]$/ },
    axis_name: { type: String, required: true },
    version: { type: String, required: true },
    status: { type: String, enum: ['bozza', 'consolidato', 'in_revisione'], required: true },
    source_document: { type: SourceDocumentSchema, required: true },
    structural_function: { type: String, required: true },
    core_processes: { type: [NamedDescriptionSchema], default: [] },
    bridge_concepts: { type: [BridgeConceptSchema], default: [] },
    structural_nodes: { type: [StructuralNodeSchema], default: [] },
    internal_articulations: { type: [InternalArticulationSchema], default: [] },
    reduction_risks: { type: [ReductionRiskSchema], default: [] },
    structural_questions: { type: [String], default: [] },
    methodological_constraints: { type: [String], default: [] },
    compilation_notes: { type: CompilationNotesSchema, required: true },
    _last_rebuilt: { type: Date, default: null },
    _source_version: { type: String, default: null },
  },
  { timestamps: true, collection: 'assi_strutturali', strict: false },
);

AsseStrutturaleSchema.index({ status: 1 });
AsseStrutturaleSchema.index({ _last_rebuilt: -1 });

export default mongoose.model<IAsseStrutturale>('AsseStrutturale', AsseStrutturaleSchema);
