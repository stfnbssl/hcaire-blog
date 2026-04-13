export type ArticleRequestStatus = 'pending' | 'processing' | 'done' | 'error';

export type LogStep =
  | 'telegram_received'
  | 'redis_published'
  | 'coworker_started'
  | 'coworker_done'
  | 'coworker_error'
  | 'article_published';

export interface WorkflowLog {
  _id: string;
  articleRequestId: string;
  testoPreview: string;
  step: LogStep;
  actor: 'server' | 'local' | 'coworker';
  message: string;
  requestStatus: string;
  createdAt: string;
}

export interface ArticleRequest {
  _id: string;
  testo: string;
  pubblica: boolean;
  status: ArticleRequestStatus;
  createdAt: string;
  updatedAt: string;
}
