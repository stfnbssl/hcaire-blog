// Service client per /api/admin/assi-chapters/* (Clerk admin).

import { apiRequest } from './apiClient';
import type {
  AssiChapter,
  AssiChapterSummary,
  UpdateChapterResponse,
  ValidationIssue,
} from '../types/assiChapter';

export interface ListResponse<T> { items: T[]; }

export function listChapters(
  token: string,
  axisSlug?: string,
): Promise<ListResponse<AssiChapterSummary>> {
  const q = axisSlug ? `?axis=${encodeURIComponent(axisSlug)}` : '';
  return apiRequest(`/admin/assi-chapters${q}`, { token });
}

export function getChapter(
  token: string,
  axisSlug: string,
  slug: string,
): Promise<AssiChapter> {
  return apiRequest(`/admin/assi-chapters/${encodeURIComponent(axisSlug)}/${encodeURIComponent(slug)}`, { token });
}

export interface UpdateChapterInput {
  body?: string;
  title?: string;
  references?: AssiChapter['references'];
  footnotes?: AssiChapter['footnotes'];
  is_published?: boolean;
}

export function updateChapter(
  token: string,
  axisSlug: string,
  slug: string,
  input: UpdateChapterInput,
): Promise<UpdateChapterResponse> {
  return apiRequest(
    `/admin/assi-chapters/${encodeURIComponent(axisSlug)}/${encodeURIComponent(slug)}`,
    { token, method: 'PATCH', body: JSON.stringify(input) },
  );
}

export interface ValidationResponse {
  valid: boolean;
  issues: ValidationIssue[];
}

export function validateChapter(
  token: string,
  axisSlug: string,
  slug: string,
  input: UpdateChapterInput,
): Promise<ValidationResponse> {
  return apiRequest(
    `/admin/assi-chapters/${encodeURIComponent(axisSlug)}/${encodeURIComponent(slug)}/validate`,
    { token, method: 'POST', body: JSON.stringify(input) },
  );
}

export interface ExportAllResponse {
  exported_count: number;
  exported: string[];
  errors: { slug: string; error: string }[];
}

export function exportAllChapters(token: string): Promise<ExportAllResponse> {
  return apiRequest('/admin/assi-chapters/export-all', { token, method: 'POST' });
}
