import mongoose, { Schema, Document } from 'mongoose';

export type ArticleRequestStatus = 'pending' | 'processing' | 'done' | 'error';
export type LogStep =
  // ─── Article workflow ───────────────────────────────────────────────────────
  | 'telegram_received'
  | 'redis_published'
  | 'coworker_started'
  | 'coworker_done'
  | 'coworker_error'
  | 'article_published'
  // ─── Bartleby workflow ──────────────────────────────────────────────────────
  | 'trace_submitted'   // traccia salvata (POST /api/bartleby/traces)
  | 'trace_queued'      // job pubblicato su Redis
  | 'worker_started'    // worker ha preso il job
  | 'claude_called'     // richiesta inviata all'API Claude
  | 'output_saved'      // OutputDocument salvato in MongoDB
  | 'worker_error';     // errore in qualsiasi punto del worker
export type LogActor = 'server' | 'local' | 'coworker' | 'worker';

export interface IArticleRequest extends Document {
  testo: string;
  pubblica: boolean;
  status: ArticleRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleRequestSchema = new Schema<IArticleRequest>(
  {
    testo:    { type: String,  required: true },
    pubblica: { type: Boolean, default: false },
    status:   { type: String,  enum: ['pending', 'processing', 'done', 'error'], default: 'pending' },
  },
  { timestamps: true, collection: 'article-requests' }
);

export default mongoose.model<IArticleRequest>('ArticleRequest', ArticleRequestSchema);
