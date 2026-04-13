import mongoose, { Schema, Document } from 'mongoose';

export type ArticleRequestStatus = 'pending' | 'processing' | 'done' | 'error';
export type LogStep =
  | 'telegram_received'
  | 'redis_published'
  | 'coworker_started'
  | 'coworker_done'
  | 'coworker_error'
  | 'article_published';
export type LogActor = 'server' | 'local' | 'coworker';

export interface IWorkflowLog {
  timestamp: Date;
  step: LogStep;
  message: string;
  actor: LogActor;
}

export interface IArticleRequest extends Document {
  testo: string;
  pubblica: boolean;
  status: ArticleRequestStatus;
  logs: IWorkflowLog[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowLogSchema = new Schema<IWorkflowLog>(
  {
    timestamp: { type: Date,   default: () => new Date() },
    step:      { type: String, required: true },
    message:   { type: String, required: true },
    actor:     { type: String, required: true },
  },
  { _id: false }
);

const ArticleRequestSchema = new Schema<IArticleRequest>(
  {
    testo:    { type: String,  required: true },
    pubblica: { type: Boolean, default: false },
    status:   { type: String,  enum: ['pending', 'processing', 'done', 'error'], default: 'pending' },
    logs:     [WorkflowLogSchema],
  },
  { timestamps: true, collection: 'article-requests' }
);

export default mongoose.model<IArticleRequest>('ArticleRequest', ArticleRequestSchema);
