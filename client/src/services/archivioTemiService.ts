import { apiRequest } from './apiClient';
import type { Tema, TemaFormData, TemaStato } from '../types/tema';

// Risposta envelope coerente con altri controller pipeline ({ ok, data }).
interface ApiEnvelope<T> {
  ok: boolean;
  data: T;
  error?: { code: string; message: string; detail?: unknown };
}

async function envelope<T>(promise: Promise<ApiEnvelope<T>>): Promise<T> {
  const res = await promise;
  if (!res.ok) {
    throw new Error(res.error?.message ?? 'Errore Archivio');
  }
  return res.data;
}

export async function listTemi(token: string, stato?: TemaStato): Promise<{ temi: Tema[] }> {
  const qs = stato ? `?stato=${encodeURIComponent(stato)}` : '';
  return envelope(apiRequest<ApiEnvelope<{ temi: Tema[] }>>(`/archivio/temi${qs}`, { token }));
}

export async function getTema(token: string, temaId: string): Promise<{ tema: Tema }> {
  return envelope(apiRequest<ApiEnvelope<{ tema: Tema }>>(`/archivio/temi/${temaId}`, { token }));
}

export async function createTema(token: string, data: TemaFormData): Promise<{ tema: Tema }> {
  return envelope(apiRequest<ApiEnvelope<{ tema: Tema }>>('/archivio/temi', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  }));
}

export async function updateTema(token: string, temaId: string, data: Partial<TemaFormData>): Promise<{ tema: Tema }> {
  return envelope(apiRequest<ApiEnvelope<{ tema: Tema }>>(`/archivio/temi/${temaId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  }));
}

export async function deleteTema(token: string, temaId: string): Promise<{ tema_id: string; deleted: boolean }> {
  return envelope(apiRequest<ApiEnvelope<{ tema_id: string; deleted: boolean }>>(`/archivio/temi/${temaId}`, {
    method: 'DELETE',
    token,
  }));
}

export async function promuoveTema(token: string, temaId: string): Promise<{ tema: Tema }> {
  return envelope(apiRequest<ApiEnvelope<{ tema: Tema }>>(`/archivio/temi/${temaId}/promuovi`, {
    method: 'POST',
    token,
  }));
}
