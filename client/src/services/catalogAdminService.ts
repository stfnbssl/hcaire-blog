// Service client per /api/admin/catalog/{authors,books} (Clerk admin).

import { API_URL } from '../utils/constants';
import { apiRequest } from './apiClient';
import type {
  CatalogAuthor,
  CatalogBook,
  CatalogListResponse,
  CitingChapter,
} from '../types/catalog';

// ── authors ────────────────────────────────────────────────────────────────

export interface AuthorListFilters {
  q?: string;
  project?: string;
  tag?: string;
  limit?: number;
  skip?: number;
}

function buildQuery(params: object): string {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join('&')}` : '';
}

export function listAuthors(
  token: string,
  filters: AuthorListFilters = {},
): Promise<CatalogListResponse<CatalogAuthor>> {
  return apiRequest(`/admin/catalog/authors${buildQuery(filters)}`, { token });
}

export function getAuthor(
  token: string,
  id: string,
): Promise<{ author: CatalogAuthor; citing: CitingChapter[] }> {
  return apiRequest(`/admin/catalog/authors/${encodeURIComponent(id)}`, { token });
}

export interface AuthorCreateInput {
  id?: string;
  nome: string;
  birth_year?: number | null;
  death_year?: number | null;
  bio_short?: string | null;
  wikipedia?: string | null;
  projects?: Array<{ projectId: string; rilevanza?: string }>;
  tags?: string[];
}

export function createAuthor(
  token: string,
  input: AuthorCreateInput,
): Promise<{ author: CatalogAuthor }> {
  return apiRequest('/admin/catalog/authors', {
    token,
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export type AuthorUpdateInput = Partial<AuthorCreateInput>;

export function updateAuthor(
  token: string,
  id: string,
  input: AuthorUpdateInput,
): Promise<{ author: CatalogAuthor }> {
  return apiRequest(`/admin/catalog/authors/${encodeURIComponent(id)}`, {
    token,
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteAuthor(
  token: string,
  id: string,
  force = false,
): Promise<{ deleted: true; id: string; was_cited_in: number }> {
  const q = force ? '?force=true' : '';
  return apiRequest(`/admin/catalog/authors/${encodeURIComponent(id)}${q}`, {
    token,
    method: 'DELETE',
  });
}

export async function uploadAuthorImage(
  token: string,
  id: string,
  file: File,
): Promise<{ author: CatalogAuthor }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(
    `${API_URL}/admin/catalog/authors/${encodeURIComponent(id)}/image`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function deleteAuthorImage(
  token: string,
  id: string,
): Promise<{ author: CatalogAuthor }> {
  return apiRequest(`/admin/catalog/authors/${encodeURIComponent(id)}/image`, {
    token,
    method: 'DELETE',
  });
}

// ── books ──────────────────────────────────────────────────────────────────

export interface BookListFilters extends AuthorListFilters {
  autore?: string;
}

export function listBooks(
  token: string,
  filters: BookListFilters = {},
): Promise<CatalogListResponse<CatalogBook>> {
  return apiRequest(`/admin/catalog/books${buildQuery(filters)}`, { token });
}

export function getBook(
  token: string,
  id: string,
): Promise<{ book: CatalogBook; citing: CitingChapter[] }> {
  return apiRequest(`/admin/catalog/books/${encodeURIComponent(id)}`, { token });
}

export interface BookCreateInput {
  id?: string;
  titolo: string;
  titolo_originale?: string | null;
  autoreIds?: string[];
  anno?: number | null;
  editore?: string | null;
  projects?: Array<{ projectId: string; rilevanza?: string }>;
  tags?: string[];
}

export function createBook(
  token: string,
  input: BookCreateInput,
): Promise<{ book: CatalogBook }> {
  return apiRequest('/admin/catalog/books', {
    token,
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export type BookUpdateInput = Partial<BookCreateInput>;

export function updateBook(
  token: string,
  id: string,
  input: BookUpdateInput,
): Promise<{ book: CatalogBook }> {
  return apiRequest(`/admin/catalog/books/${encodeURIComponent(id)}`, {
    token,
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteBook(
  token: string,
  id: string,
  force = false,
): Promise<{ deleted: true; id: string; was_cited_in: number }> {
  const q = force ? '?force=true' : '';
  return apiRequest(`/admin/catalog/books/${encodeURIComponent(id)}${q}`, {
    token,
    method: 'DELETE',
  });
}

export async function uploadBookImage(
  token: string,
  id: string,
  file: File,
): Promise<{ book: CatalogBook }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(
    `${API_URL}/admin/catalog/books/${encodeURIComponent(id)}/image`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function deleteBookImage(
  token: string,
  id: string,
): Promise<{ book: CatalogBook }> {
  return apiRequest(`/admin/catalog/books/${encodeURIComponent(id)}/image`, {
    token,
    method: 'DELETE',
  });
}
