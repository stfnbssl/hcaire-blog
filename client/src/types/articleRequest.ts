export type ArticleRequestStatus = 'pending' | 'processing' | 'done' | 'error';

export type LogStep =
  | 'telegram_received'
  | 'redis_published'
  | 'coworker_started'
  | 'coworker_done'
  | 'coworker_error'
  | 'article_published';

export interface WorkflowLog {
  timestamp: string;
  step: LogStep;
  message: string;
  actor: 'server' | 'local' | 'coworker';
}

export interface ArticleRequest {
  _id: string;
  testo: string;
  pubblica: boolean;
  status: ArticleRequestStatus;
  logs: WorkflowLog[];
  createdAt: string;
  updatedAt: string;
}
