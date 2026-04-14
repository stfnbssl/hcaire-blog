import { apiRequest } from './apiClient';
import { Content, ContentFormData, PaginatedResponse } from '../types/content';

export const contentService = {
  getAll: (page = 1, limit = 10) =>
    apiRequest<PaginatedResponse<Content>>(`/contents?page=${page}&limit=${limit}`),

  getBySlug: (slug: string, token?: string) =>
    apiRequest<Content>(`/contents/${slug}`, { token }),

  getAllAdmin: (token?: string) =>
    apiRequest<Content[]>('/contents/admin', { token }),

  create: (data: ContentFormData, token?: string) =>
    apiRequest<Content>('/contents', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (id: string, data: Partial<ContentFormData>, token?: string) =>
    apiRequest<Content>(`/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token?: string) =>
    apiRequest<{ message: string }>(`/contents/${id}`, {
      method: 'DELETE',
      token,
    }),
};
