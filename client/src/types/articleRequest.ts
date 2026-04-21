export type ArticleRequestStatus = 'pending' | 'processing' | 'done' | 'error';

export type LogStep =
  // article
  | 'telegram_received'
  | 'redis_published'
  | 'coworker_started'
  | 'coworker_done'
  | 'coworker_error'
  | 'article_published'
  // bartleby
  | 'trace_submitted'
  | 'trace_queued'
  | 'worker_started'
  | 'claude_called'
  | 'output_saved'
  | 'worker_error';

export interface WorkflowLog {
  _id: string;
  workflow_type: 'article' | 'bartleby';
  // article
  articleRequestId?: string;
  // bartleby
  traceId?: string;
  // common
  testoPreview: string;
  step: LogStep;
  actor: 'server' | 'local' | 'coworker' | 'worker';
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
