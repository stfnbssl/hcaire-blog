import { apiRequest } from './apiClient';
import type { ArticleRequest, WorkflowLog } from '../types/articleRequest';

export const getArticleRequests = (token?: string): Promise<ArticleRequest[]> =>
  apiRequest<ArticleRequest[]>('/article-requests', { token });

export const getWorkflowLogs = (limit = 200, token?: string, type?: 'article' | 'bartleby'): Promise<WorkflowLog[]> =>
  apiRequest<WorkflowLog[]>(
    `/article-requests/logs?limit=${limit}${type ? `&type=${type}` : ''}`,
    { token }
  );
