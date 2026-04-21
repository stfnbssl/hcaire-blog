// ─── Knowledge Base ───────────────────────────────────────────────────────────

export interface ConceptNode {
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
  // popolati nel dettaglio
  related_area_sheets?: AreaSheetSummary[];
  related_skills?: SkillSummary[];
  example_outputs?: OutputSummary[];
}

export interface DomainArea {
  bartlebyId: string;
  name: string;
  slug: string;
  description: string;
  purpose: string;
  language_style: string;
  risk_profile: string;
  status: string;
  version: string;
  // popolati nel dettaglio
  area_sheet?: AreaSheet;
  priority_nodes?: ConceptNodeSummary[];
}

export interface AreaSheet {
  bartlebyId: string;
  domain_area_id: string;
  title: string;
  scope: string;
  main_focus: string;
  translation_of_model: string;
  priority_dimensions: Array<{ name: string; priority: string; note: string }>;
  typical_configurations: Array<{ id: string; name: string; description: string; possible_reading: string }>;
  reduction_risks: Array<{ id: string; name: string; description: string }>;
  guiding_questions: string[];
  allowed_output_types: string[];
  language_rules: unknown;
  operational_cautions: string[];
  quality_indicators: unknown[];
  status: string;
  version: string;
}

export interface Skill {
  bartlebyId: string;
  name: string;
  slug: string;
  skill_type: string;
  description: string;
  instruction_payload: unknown;
  status: string;
  version: string;
  owner_type: string;
  // popolati nel dettaglio
  related_nodes?: ConceptNodeSummary[];
  related_areas?: DomainAreaSummary[];
}

export interface FoundationDocument {
  bartlebyId: string;
  type: string;
  title: string;
  slug: string;
  summary: string;
  body?: string;
  file_path?: string;
  status: string;
  version: string;
  // popolati nel dettaglio
  generated_nodes?: ConceptNodeSummary[];
}

export interface OutputTemplate {
  bartlebyId: string;
  name: string;
  slug: string;
  description: string;
  structure_schema: unknown;
  audience_type: string;
  language_constraints: unknown;
  applicable_areas?: string[];
  status: string;
  version: string;
}

// ─── Summaries (usate nelle relazioni) ────────────────────────────────────────

export interface ConceptNodeSummary {
  bartlebyId: string;
  name: string;
  slug: string;
  priority_level: string;
}

export interface SkillSummary {
  bartlebyId: string;
  name: string;
  slug: string;
  skill_type: string;
  description: string;
}

export interface AreaSheetSummary {
  bartlebyId: string;
  title: string;
  domain_area_id: string;
}

export interface DomainAreaSummary {
  bartlebyId: string;
  name: string;
  slug: string;
}

export interface OutputSummary {
  bartlebyId: string;
  title: string;
  output_type: string;
  audience: string;
  created_at: string;
}

// ─── Input / Output ───────────────────────────────────────────────────────────

export interface InputTrace {
  _id: string;
  bartlebyId?: string;
  corpus_id?: string;
  user_id?: string;
  title?: string;
  raw_text: string;
  context_notes?: string;
  target_output_type?: string;
  requested_area_id?: string;
  activated_nodes?: string[];
  status: string;
  createdAt?: string;
}

export interface OutputDocument {
  bartlebyId: string;
  input_trace_id: string;
  user_id?: string;
  output_type: string;
  title: string;
  body: string;
  body_summary?: string;
  audience: string;
  area_id: string;
  activated_nodes: string[];
  skills_used: string[];
  evaluation?: {
    score: number | null;
    notes: string;
    status: string;
  };
  status: string;
  version: string;
  created_at?: string;
  // popolati nel dettaglio
  trace?: InputTrace;
  area?: DomainAreaSummary;
  activated_nodes_detail?: ConceptNodeSummary[];
  skills_used_detail?: SkillSummary[];
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export interface TraceFormData {
  raw_text: string;
  context_notes?: string;
  target_output_type?: string;
  requested_area_id?: string;
}
