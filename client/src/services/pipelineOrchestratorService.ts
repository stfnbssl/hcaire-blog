import { API_URL } from '../utils/constants';
import type {
  PipelineContextDoc,
  PipelineExternalInputDoc,
  PipelineStepExecutionDoc,
  StepConfig,
  RunStepResult,
  VerifyResult,
  VerificaOutcome,
  SystemStatus,
  TemaSelectionPayload,
  PipelineIndex,
} from '../types/pipeline';

// Tipo della funzione che restituisce il token Clerk corrente (provided dal hook chiamante).
export type TokenGetter = () => Promise<string | null>;

interface ApiOk<T> { ok: true; data: T }
interface ApiErr { ok: false; error: { code: string; message: string; detail: unknown } }
type ApiResponse<T> = ApiOk<T> | ApiErr;

async function request<T>(
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  body?: unknown,
  getToken?: TokenGetter,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (getToken) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let parsed: ApiResponse<T> | { error?: string } | null = null;
  try { parsed = (await res.json()) as ApiResponse<T>; } catch { /* */ }
  if (!res.ok) {
    const code = (parsed as ApiErr | null)?.error?.code ?? `HTTP_${res.status}`;
    const msg = (parsed as ApiErr | null)?.error?.message ?? `HTTP ${res.status}`;
    const detail = (parsed as ApiErr | null)?.error?.detail ?? null;
    const e = new Error(msg) as Error & { code?: string; status?: number; detail?: unknown };
    e.code = code; e.status = res.status; e.detail = detail;
    throw e;
  }
  if (!parsed || !('ok' in parsed) || !parsed.ok) {
    throw new Error('Risposta API malformata');
  }
  return parsed.data;
}

export const pipelineOrchestratorService = {
  // ---- Lettura (public) ----
  getIndex: () => request<PipelineIndex>('GET', '/pipeline/index'),
  getStepConfig: () => request<{ steps: StepConfig[] }>('GET', '/pipeline/step-config'),
  getTema: (temaId: string) =>
    request<{ context: PipelineContextDoc; step_config: StepConfig[]; external_inputs: PipelineExternalInputDoc[] }>(
      'GET', `/pipeline/temi/${encodeURIComponent(temaId)}`,
    ),
  getRicerca: (ricercaId: string) =>
    request<{ context: PipelineContextDoc; step_config: StepConfig[]; external_inputs: PipelineExternalInputDoc[] }>(
      'GET', `/pipeline/ricerche/${encodeURIComponent(ricercaId)}`,
    ),
  getStepHistory: (temaId: string, stepId: string) =>
    request<{ executions: PipelineStepExecutionDoc[] }>(
      'GET', `/pipeline/temi/${encodeURIComponent(temaId)}/steps/${stepId}/history`,
    ),
  getExecutionOutput: (executionId: string) =>
    request<{
      execution_id: string; step_id: string; context_id: string; run_number: number;
      status: string; completed_at: string | null; output_file: string | null; output_data: unknown;
    }>('GET', `/pipeline/executions/${executionId}/output`),
  getStepInputs: (temaId: string, stepId: string) =>
    request<{ inputs: PipelineExternalInputDoc[]; step_config_inputs: StepConfig['inputs_esterni']; all_required_provided: boolean }>(
      'GET', `/pipeline/temi/${encodeURIComponent(temaId)}/steps/${stepId}/inputs`,
    ),
  getTemaPendingDecision: (temaId: string) =>
    request<{ decision: PipelineContextDoc['pending_decision'] }>(
      'GET', `/pipeline/temi/${encodeURIComponent(temaId)}/pending-decision`,
    ),
  getRicercaPendingDecision: (ricercaId: string) =>
    request<{ decision: PipelineContextDoc['pending_decision'] }>(
      'GET', `/pipeline/ricerche/${encodeURIComponent(ricercaId)}/pending-decision`,
    ),

  // ---- Orchestrazione (admin) ----
  runStep: (temaId: string, stepId: string, extraParams: Record<string, unknown> = {}, getToken?: TokenGetter) =>
    request<RunStepResult>('POST', `/pipeline/temi/${encodeURIComponent(temaId)}/steps/${stepId}/run`,
      { extra_params: extraParams }, getToken,
    ),
  cancelExecution: (executionId: string, reason = '', getToken?: TokenGetter) =>
    request<{ execution_id: string; status: string }>(
      'DELETE', `/pipeline/executions/${executionId}`, { reason }, getToken,
    ),
  verifyExecution: (executionId: string, outcome: VerificaOutcome, notes = '', feedback = '', getToken?: TokenGetter) =>
    request<VerifyResult>('POST', `/pipeline/executions/${executionId}/verify`,
      { outcome, notes, feedback }, getToken,
    ),
  skipStep: (temaId: string, stepId: string, reason: string, getToken?: TokenGetter) =>
    request<{ step_id: string; status: string; unlocked_steps: string[] }>(
      'POST', `/pipeline/temi/${encodeURIComponent(temaId)}/steps/${stepId}/skip`, { reason }, getToken,
    ),
  resetStep: (temaId: string, stepId: string, getToken?: TokenGetter) =>
    request<{ step_id: string; new_status: string; unlocked_steps: string[] }>(
      'POST', `/pipeline/temi/${encodeURIComponent(temaId)}/steps/${stepId}/reset`, {}, getToken,
    ),

  // ---- Input esterni (admin) ----
  submitExternalInput: (temaId: string, stepId: string, inputId: string, data: Record<string, unknown>, getToken?: TokenGetter) =>
    request<{ input_id: string; external_input_doc_id: string; file_path: string | null; all_required_provided: boolean }>(
      'POST', `/pipeline/temi/${encodeURIComponent(temaId)}/steps/${stepId}/inputs`,
      { input_id: inputId, data }, getToken,
    ),
  deleteExternalInput: (inputDocId: string, getToken?: TokenGetter) =>
    request<{ input_doc_id: string; superseded: boolean }>('DELETE', `/pipeline/external-inputs/${inputDocId}`, undefined, getToken),

  // ---- Decisioni umane (admin) ----
  submitTemaSelection: (ricercaId: string, payload: TemaSelectionPayload, getToken?: TokenGetter) =>
    request<{ created_tema_id: string; tema_context: PipelineContextDoc }>(
      'POST', `/pipeline/ricerche/${encodeURIComponent(ricercaId)}/decisions`,
      { decision_type: 'f2_to_f3_tema_selection', ...payload }, getToken,
    ),
  submitContextDecision: (temaId: string, confirmed: boolean, notes = '', getToken?: TokenGetter) =>
    request<{ decision_resolved: boolean; step_now_launchable: boolean }>(
      'POST', `/pipeline/temi/${encodeURIComponent(temaId)}/decisions`,
      { decision_type: 'step7_context_selection', confirmed, notes }, getToken,
    ),

  // ---- System ----
  getSystemStatus: (getToken?: TokenGetter) =>
    request<SystemStatus>('GET', '/pipeline/system/status', undefined, getToken),

  createRicerca: (ricercaId: string, label: string, getToken?: TokenGetter) =>
    request<{ context: PipelineContextDoc }>('POST', '/pipeline/ricerche',
      { ricerca_id: ricercaId, label }, getToken,
    ),
};

export type PipelineOrchestratorService = typeof pipelineOrchestratorService;
