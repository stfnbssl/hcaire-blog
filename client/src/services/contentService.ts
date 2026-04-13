import { apiRequest } from './apiClient';
import { Content, ContentFormData, PaginatedResponse } from '../types/content';

export const contentService = {
  getAll: (page = 1, limit = 10) =>
    apiRequest<PaginatedResponse<Content>>(`/contents?page=${page}&limit=${limit}`),

  getBySlug: (slug: string) =>
    apiRequest<Content>(`/contents/${slug}`),

  getAllAdmin: () =>
    apiRequest<Content[]>('/contents/admin', { auth: true }),

  create: (data: ContentFormData) =>
    apiRequest<Content>('/contents', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    }),

  update: (id: string, data: Partial<ContentFormData>) =>
    apiRequest<Content>(`/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      auth: true,
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/contents/${id}`, {
      method: 'DELETE',
      auth: true,
    }),
};
