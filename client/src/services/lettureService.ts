// Service client per la sezione Letture. Tutte le route admin richiedono token Clerk
// passato via Bearer (vedi apiClient.ts). Le route pubbliche non hanno token.

import { apiRequest } from './apiClient';
import type {
  LettureStepId,
  Opera,
  OperaSummary,
  OperaStato,
  OperaTipologia,
  RunStepResponse,
} from '../types/letture';

// ---------- pubblici ----------

export interface OperaPubblicaSummary {
  slug: string;
  titolo: string;
  autore: string;
  anno: number | null;
  tipologia: OperaTipologia;
  pubblicata_il: string | null;
  ha_resoconto: boolean;
  ha_saggio: boolean;
}

export interface OperaPubblicaDetail {
  slug: string;
  titolo: string;
  autore: string;
  anno: number | null;
  tipologia: OperaTipologia;
  lingua_originale: string | null;
  pubblicata_il: string | null;
  articolo: string | null;
  resoconto: { testo: string | null; completato_il: string | null } | null;
  saggio:    { testo: string | null; completato_il: string | null } | null;
}

export function fetchLetturePubbliche(): Promise<OperaPubblicaSummary[]> {
  return apiRequest('/letture');
}
export function fetchOperaPubblica(slug: string): Promise<OperaPubblicaDetail> {
  return apiRequest(`/letture/${encodeURIComponent(slug)}`);
}

// ---------- admin ----------

export interface ListAdminFilters {
  stato?: OperaStato;
  tipologia?: OperaTipologia;
  priorita?: number;
}

export function listOpereAdmin(token: string, filters: ListAdminFilters = {}): Promise<OperaSummary[]> {
  const qs = new URLSearchParams();
  if (filters.stato)     qs.set('stato', filters.stato);
  if (filters.tipologia) qs.set('tipologia', filters.tipologia);
  if (filters.priorita)  qs.set('priorita', String(filters.priorita));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest(`/admin/letture${suffix}`, { token });
}

export function getOperaAdmin(token: string, slug: string): Promise<Opera> {
  return apiRequest(`/admin/letture/${encodeURIComponent(slug)}`, { token });
}

export interface CreateOperaInput {
  titolo: string;
  autore: string;
  anno?: number | null;
  tipologia: OperaTipologia;
  lingua_originale?: string | null;
  priorita?: number | null;
  note_di_ingresso?: string;
}

export function createOpera(token: string, body: CreateOperaInput): Promise<Opera> {
  return apiRequest('/admin/letture', {
    token,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export type UpdateOperaInput = Partial<{
  titolo: string;
  autore: string;
  anno: number | null;
  tipologia: OperaTipologia;
  lingua_originale: string | null;
  priorita: number | null;
  note_di_ingresso: string;
  stato: OperaStato;
}>;

export function updateOpera(token: string, slug: string, patch: UpdateOperaInput): Promise<Opera> {
  return apiRequest(`/admin/letture/${encodeURIComponent(slug)}`, {
    token,
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export function deleteOpera(token: string, slug: string): Promise<void> {
  return apiRequest(`/admin/letture/${encodeURIComponent(slug)}`, {
    token,
    method: 'DELETE',
  });
}

export function runStep(token: string, slug: string, stepId: LettureStepId): Promise<RunStepResponse> {
  return apiRequest(`/admin/letture/${encodeURIComponent(slug)}/steps/${stepId}/run`, {
    token,
    method: 'POST',
  });
}
