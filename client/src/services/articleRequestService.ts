import { apiRequest } from './apiClient';
import type { ArticleRequest, WorkflowLog } from '../types/articleRequest';

export const getArticleRequests = (): Promise<ArticleRequest[]> =>
  apiRequest<ArticleRequest[]>('/article-requests', { auth: true });

export const getWorkflowLogs = (limit = 200): Promise<WorkflowLog[]> =>
  apiRequest<WorkflowLog[]>(`/article-requests/logs?limit=${limit}`, { auth: true });
