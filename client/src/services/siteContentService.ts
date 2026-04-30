import { apiRequest } from './apiClient';

export type SupportedLang = 'it' | 'en';
export const SUPPORTED_LANGS: SupportedLang[] = ['it', 'en'];
export const DEFAULT_LANG: SupportedLang = 'it';

export type ContentType = 'plain' | 'markdown';
export const CONTENT_TYPES: ContentType[] = ['plain', 'markdown'];

export interface SiteContentItem {
  key:          string;
  namespace:    string;
  type:         ContentType;
  description?: string;
  translations: Partial<Record<SupportedLang, string>>;
  updatedAt:    string;
}

export async function fetchSiteContent(): Promise<SiteContentItem[]> {
  const { items } = await apiRequest<{ items: SiteContentItem[] }>('/site-content');
  return items;
}

export async function fetchAdminSiteContent(token: string): Promise<SiteContentItem[]> {
  const { items } = await apiRequest<{ items: SiteContentItem[] }>('/admin/site-content', { token });
  return items;
}

export interface UpsertPayload {
  key?:          string;
  namespace?:    string;
  type?:         ContentType;
  description?:  string;
  translations?: Partial<Record<SupportedLang, string>>;
}

export async function createSiteContent(token: string, payload: UpsertPayload): Promise<SiteContentItem> {
  return apiRequest<SiteContentItem>('/admin/site-content', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function updateSiteContent(token: string, key: string, payload: UpsertPayload): Promise<SiteContentItem> {
  return apiRequest<SiteContentItem>(`/admin/site-content/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  });
}

export async function deleteSiteContent(token: string, key: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/admin/site-content/${encodeURIComponent(key)}`, {
    method: 'DELETE',
    token,
  });
}

export interface SyncResult {
  created: number;
  skipped: number;
  total:   number;
  source:  string;
}

export async function syncSiteContentFromDefaults(token: string): Promise<SyncResult> {
  return apiRequest<SyncResult>('/admin/site-content/sync', {
    method: 'POST',
    token,
  });
}
