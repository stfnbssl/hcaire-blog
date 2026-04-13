import { apiRequest } from './apiClient';
import type { ArticleRequest } from '../types/articleRequest';

export const getArticleRequests = (): Promise<ArticleRequest[]> =>
  apiRequest<ArticleRequest[]>('/article-requests', { auth: true });
