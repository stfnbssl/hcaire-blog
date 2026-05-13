// Tipi client per la sezione admin "Assi strutturali".
// Mirror dei modelli server (server/src/models/AsseStrutturale.ts e
// AssiRebuildExecution.ts). Non condivisi via `shared/`: server e client sono
// deployati separatamente.

export type AsseStatus = 'bozza' | 'consolidato' | 'in_revisione';

export interface NamedDescription {
  name: string;
  description: string;
}

export interface BridgeConcept {
  concept: string;
  definition: string;
  linked_nodes?: string[];
}

export interface StructuralNode {
  node: string;
  short_definition: string;
}

export interface InternalArticulation {
  section: string;
  function: string;
}

export interface ReductionRisk {
  type: string;
  description: string;
}

export interface SourceDocument {
  title: string;
  format: 'markdown' | 'pdf' | 'docx' | 'txt';
  language: 'it' | 'en';
}

export interface CompilationNotes {
  confidence_level: 'bassa' | 'media' | 'alta';
  needs_human_review: boolean;
  notes?: string;
  open_issues?: string[];
}

export interface AsseStrutturale {
  _id: string;
  axis_id: string;
  axis_name: string;
  version: string;
  status: AsseStatus;
  source_document: SourceDocument;
  structural_function: string;
  core_processes: NamedDescription[];
  bridge_concepts: BridgeConcept[];
  structural_nodes: StructuralNode[];
  internal_articulations: InternalArticulation[];
  reduction_risks: ReductionRisk[];
  structural_questions: string[];
  methodological_constraints: string[];
  compilation_notes: CompilationNotes;
  _last_rebuilt: string | null;
  _source_version: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------- rebuild executions ----------

export type AssiRebuildStatus = 'in_coda' | 'in_esecuzione' | 'completato' | 'fallito';
export type AssiLogLevel = 'info' | 'warn' | 'error';

export interface AssiLogLine {
  ts: string;
  text: string;
  level: AssiLogLevel;
}

export interface AssiRebuildExecution {
  _id: string;
  status: AssiRebuildStatus;
  triggered_at: string;
  started_at: string | null;
  completed_at: string | null;
  log_lines: AssiLogLine[];
  axes_updated: string[];
  error: string | null;
  triggered_by: string | null;
  createdAt: string;
  updatedAt: string;
}

// Versione "summary" senza log_lines (lista esecuzioni)
export type AssiRebuildExecutionSummary = Omit<AssiRebuildExecution, 'log_lines'>;
