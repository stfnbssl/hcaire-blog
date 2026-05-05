// ---------- index ----------

// f2_step_1 rimosso: la discovery temi è ora gestita dall'Archivio temi.
export type PipelineStepId =
  | 'f2_step_2' | 'f2_step_2a' | 'f2_step_3' | 'f2_step_4' | 'f2_step_4b' | 'f2_step_5' | 'f2_step_6'
  | 'f3_step_1' | 'f3_step_2' | 'f3_step_3' | 'f3_step_4' | 'f3_step_5'
  | 'f3_step_6' | 'f3_step_6b' | 'f3_step_7' | 'f3_step_8' | 'f3_step_9' | 'f3_step_10';

export type CanonicalDeviceShape = 'device' | 'corrected_device' | 'result_0';

export type RicercaIndexEntry = {
  id: string;
  label: string;
  steps_completed: PipelineStepId[];
  files: Partial<Record<PipelineStepId, string>>;
};

export type ExternalInput = {
  step: PipelineStepId;
  file: string;
  type: 'pipeline' | 'esterno_obbligatorio' | 'esterno_facoltativo' | 'dispositivo_sorgente';
  label: string;
};

export type StepSkipped = {
  step: PipelineStepId;
  reason: string;
};

export type DispositivoSorgente = {
  tema_id: string;
  file: string;
  device_id: string;
};

export type TemaIndexEntry = {
  id: string;
  label: string;
  steps_completed: PipelineStepId[];
  files: Partial<Record<PipelineStepId, string>>;
  canonical_device: { file: string; shape: CanonicalDeviceShape } | null;
  theme_id?: string | null;
  ricerca_origine?: string | null;
  dispositivo_sorgente?: DispositivoSorgente | null;
  steps_skipped?: StepSkipped[];
  external_inputs?: ExternalInput[];
  robustezza?: string | null;
  correzioni_residue?: number;
  has_revisioni?: boolean;
  revisioni_file?: string | null;
};

export type PipelineIndex = {
  generated_at: string;
  ricerche: RicercaIndexEntry[];
  temi: TemaIndexEntry[];
};

// ---------- shared ----------

export type StructuralReference = {
  core_configuration: string;
  axes: string[];
  nodes: string[];
  bridge_concepts: string[];
};

export type ReadingFocusEntry = {
  dimension: string;
  description: string;
};

export type AccessPoint = {
  label: string;
  description: string;
};

export type InterpretiveWarning = {
  risk_type: string;
  description: string;
};

export type ObservabilityRequirement = {
  id: string;
  dimension?: string;
  label: string;
  description: string;
  type?: string;
  observer_dependency?: string;
  required_for_proxy?: boolean;
  protocol_note?: string;
  how_to_document?: string;
  why_necessary?: string;
};

export type NonClassifiabilityRule = {
  id: string;
  dimension?: string;
  trigger: string;
  required_output: 'non_classificabile' | 'ambiguo' | string;
  rationale?: string;
  description?: string;
};

export type OperativeProxy = {
  proxy_id?: string;
  dimension?: string;
  proxy_name: string;
  what_it_measures: string;
  required_observations?: string[];
  applicability_conditions?: string[];
  non_applicability_conditions?: string[];
  decision_logic: string;
  allowed_outputs: string[];
  epistemic_limit?: string;
  supersedes?: string;
};

export type ValidationStructuralCheck = {
  configurational_logic_preserved?: boolean;
  configurational_logic_notes?: string;
  no_psychological_inference?: boolean;
  no_psychological_inference_notes?: string;
  no_circularity?: boolean;
  no_circularity_notes?: string;
  proxy_observable?: boolean;
  proxy_observable_notes?: string;
  self_limiting?: boolean;
  self_limiting_notes?: string;
};

// ---------- F3 device (normalized) ----------

export type DeviceSnapshot = {
  device_id: string;
  theme_id: string;
  domain?: string;
  device_type?: string;
  function: string;
  structural_reference: StructuralReference;
  reading_focus: ReadingFocusEntry[];
  access_points: AccessPoint[];
  structural_questions: string[];
  operative_proxies: OperativeProxy[];
  observability_requirements: ObservabilityRequirement[];
  non_classifiability_rules: NonClassifiabilityRule[];
  interpretive_warnings: InterpretiveWarning[];
  non_permitted_transformations: string[];
  validation_structural_check?: ValidationStructuralCheck;
};

// ---------- F3 step 1 (lettura-configurazionale) raw ----------

export type F3Step1Raw = {
  step: 'f3_step_1';
  domain_selected?: string;
  results: Array<{
    device_id: string;
    theme_id: string;
    domain?: string;
    device_type?: string;
    function: string;
    structural_reference: StructuralReference;
    reading_focus: ReadingFocusEntry[];
    access_points: AccessPoint[];
    structural_questions: string[];
    interpretive_warnings: InterpretiveWarning[];
    non_permitted_transformations: string[];
    operative_proxy?: OperativeProxy;
    observability_requirements?: ObservabilityRequirement[];
    non_classifiability_rules?: NonClassifiabilityRule[];
    validation_structural_check?: ValidationStructuralCheck;
  }>;
};

// ---------- F3 step 3 (correzione-strutturale) raw ----------

export type F3Step3Raw = {
  step: 'f3_step_3';
  corrected_device: Omit<DeviceSnapshot, 'operative_proxies'> & {
    operative_proxies?: OperativeProxy[];
  };
};

// ---------- F3 step 9 (dispositivo) raw ----------

export type F3Step9Raw = {
  step: 'f3_step_9';
  device: DeviceSnapshot;
  final_assessment?: string;
};

// ---------- F3 step 10 (stress test dispositivo) ----------

export type StressTestObservedConfiguration = {
  corporeity?: string;
  field?: string;
  co_regulation?: string;
  symbolic_mediation?: string;
  transformative_passage?: string;
};

export type StressTestProxyApplication = {
  applicable: boolean;
  reason?: string;
  required_observations_present?: string[];
  missing_observations?: string[];
  proxy_output?: string;
};

export type StressTestDevicePerformance = {
  readable: boolean;
  what_it_reads?: string;
  what_becomes_unclear?: string;
  ambiguity_level?: 'basso' | 'medio' | 'alto' | string;
};

export type StressTestBreakingPoint = {
  present: boolean;
  where?: string;
  why?: string;
};

export type StressTestFalsePositiveRisk = {
  risk_present: boolean;
  description?: string;
  mitigation?: string;
};

export type StressTestCase = {
  case_id: string;
  case_type: string;
  case_description: string;
  observed_configuration: StressTestObservedConfiguration;
  proxy_application: StressTestProxyApplication;
  device_performance: StressTestDevicePerformance;
  breaking_point: StressTestBreakingPoint;
  false_positive_risk: StressTestFalsePositiveRisk;
  test_verdict: 'regge' | 'regge_con_riserva' | 'fallisce' | string;
};

export type StressTestGlobalAssessment = {
  device_robustness: 'alta' | 'media' | 'bassa' | string;
  main_strengths?: string[];
  main_weaknesses?: string[];
  required_corrections?: string[];
};

export type F3Step10Raw = {
  step: 'f3_step_10';
  device_id: string;
  stress_test_results: StressTestCase[];
  global_assessment: StressTestGlobalAssessment;
};

// ---------- Corrections log (step 3, also 6/8 when present) ----------

export type CorrectionEntry = {
  breaking_point_ref?: string;
  breaking_point_summary?: string;
  correction_type: 'applicata' | 'rinviata' | 'non_applicata' | string;
  correction_scope?: string;
  correction_description: string;
  rationale?: string;
};

// ---------- Step config (D5 §13, mirror di D1 §7) ----------

export interface PipelineInputDep {
  step: string;
  role: string;
  required: boolean;
  requires_verifica?: boolean;
  note?: string;
}

export interface ExternalInputConfig {
  id: string;
  label: string;
  type: 'esterno_obbligatorio' | 'esterno_facoltativo';
  schema?: string | null;
  values?: string[];
  default?: string;
  file_template?: string;
  note?: string;
}

export interface DeviceSourceInput {
  required: boolean | string;
  description: string;
  path_template: string;
}

export interface StepConfig {
  id: string;
  label: string;
  phase: 'F2' | 'F3';
  output_prefix: string;
  output_suffix?: string;
  output_path_template: string;
  inputs_pipeline?: PipelineInputDep[];
  inputs_pipeline_standard?: PipelineInputDep[];
  inputs_pipeline_skip_8?: PipelineInputDep[];
  inputs_strutturali?: string[];
  inputs_esterni?: ExternalInputConfig[];
  inputs_dispositivo_sorgente?: DeviceSourceInput;
  verifica: boolean;
  can_skip: boolean;
  skip_condition?: string;
  overrides?: string[];
  blocks?: string[];
  note?: string;
}

// ---------- Execution / context state (D2) ----------

export type ExecutionStatus =
  | 'non_avviato' | 'attende_input' | 'attende_decisione'
  | 'in_coda' | 'in_esecuzione'
  | 'completato' | 'in_verifica' | 'verificato'
  | 'richiede_correzione' | 'saltato' | 'fallito';

export type VerificaOutcome = 'approvato' | 'richiede_correzione' | 'richiede_6c';

export type HumanDecisionType = 'f2_to_f3_tema_selection' | 'step7_context_selection';

export interface StepStateDoc {
  status: ExecutionStatus;
  current_run: number;
  last_execution_id: string | null;
  output_file: string | null;
  verifica_outcome: VerificaOutcome | null;
  updated_at: string;
}

export interface HumanDecision {
  type: HumanDecisionType;
  step_from: string;
  step_to: string;
  description: string;
  options: Record<string, unknown>[] | null;
  created_at: string;
  decided_at: string | null;
  decided_by: string | null;
  decision: Record<string, unknown> | null;
}

export interface PipelineContextDoc {
  _id: string;
  context_type: 'ricerca' | 'tema';
  context_id: string;
  label: string;
  theme_id: string | null;
  ricerca_origine: string | null;
  dispositivo_sorgente: DispositivoSorgente | null;
  step_states: Record<string, StepStateDoc>;
  pending_decision: HumanDecision | null;
  steps_completed: string[];
  steps_in_progress: string[];
  steps_failed: string[];
  robustezza: string | null;
  correzioni_residue: number;
  has_revisioni: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PipelineExternalInputDoc {
  _id: string;
  context_type: 'ricerca' | 'tema';
  context_id: string;
  step_id: string;
  input_id: string;
  label: string;
  provided_by: string;
  provided_at: string;
  data: Record<string, unknown>;
  file_path: string | null;
  is_superseded: boolean;
  superseded_by: string | null;
}

export interface PipelineStepExecutionDoc {
  _id: string;
  context_type: 'ricerca' | 'tema';
  context_id: string;
  step_id: string;
  run_number: number;
  status: ExecutionStatus;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
  output_file: string | null;
  log_lines?: { ts: string; text: string; level: 'info' | 'warn' | 'error' }[];
  error?: { message: string; source: string; detail: string | null } | null;
  verifica_required: boolean;
  verifica_notes: string | null;
  verifica_outcome: VerificaOutcome | null;
  verifica_feedback: string | null;
  is_skipped: boolean;
  skip_reason: string | null;
}

// ---------- Enriched state (calcolato lato client per la UI) ----------

export type StepAction =
  | 'launch'
  | 'provide_input'
  | 'awaiting_deps'
  | 'cancel'
  | 'view_logs'
  | 'verify'
  | 'relaunch'
  | 'decide'
  | 'none';

export interface MissingDependency {
  step_id: string;
  required_status: 'completato' | 'verificato';
  current_status: ExecutionStatus;
}

export interface MissingExternalInput {
  input_id: string;
  label: string;
}

export interface EnrichedStepState extends StepStateDoc {
  step_id: string;
  label: string;
  phase: 'F2' | 'F3';
  verifica_required: boolean;
  can_skip: boolean;
  missing_pipeline_deps: MissingDependency[];
  missing_external_inputs: MissingExternalInput[];
  is_launchable: boolean;
  action: StepAction;
  is_rollbackable: boolean;
  rollback_blocked_by: { step_id: string; status: ExecutionStatus }[];
}

export interface RunStepResult {
  execution_id: string;
  run_number: number;
  status: ExecutionStatus;
}

export interface VerifyResult {
  execution_id: string;
  new_status: ExecutionStatus;
  unlocked_steps: string[];
}

export interface SystemStatus {
  cowork_server: {
    active: boolean;
    active_executions: number;
    uptime_seconds: number;
    server_version: string;
  };
}

export interface TemaSelectionPayload {
  selected_theme: { theme_id: string; label: string; from_step: string; from_file: string };
  dispositivo_sorgente?: DispositivoSorgente;
}
