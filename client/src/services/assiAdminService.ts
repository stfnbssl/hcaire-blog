// Service client per /api/admin/assi/* — richiede sempre token Clerk admin.

import { apiRequest } from './apiClient';
import type {
  AsseStrutturale,
  AssiRebuildExecution,
  AssiRebuildExecutionSummary,
} from '../types/assiAdmin';

export interface ListResponse<T> { items: T[]; }

export interface TriggerRebuildResponse {
  execution_id: string;
  status: 'in_coda';
  triggered_at: string;
}

export function listAssi(token: string): Promise<ListResponse<AsseStrutturale>> {
  return apiRequest('/admin/assi', { token });
}

export function getAsse(token: string, axisId: string): Promise<AsseStrutturale> {
  return apiRequest(`/admin/assi/${encodeURIComponent(axisId)}`, { token });
}

export function triggerRebuild(token: string): Promise<TriggerRebuildResponse> {
  return apiRequest('/admin/assi/rebuild', { token, method: 'POST' });
}

export function listRebuildExecutions(
  token: string,
): Promise<ListResponse<AssiRebuildExecutionSummary>> {
  return apiRequest('/admin/assi/rebuild', { token });
}

export function getRebuildExecution(
  token: string,
  id: string,
): Promise<AssiRebuildExecution> {
  return apiRequest(`/admin/assi/rebuild/${encodeURIComponent(id)}`, { token });
}
