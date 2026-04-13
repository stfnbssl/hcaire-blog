import mongoose, { Schema, Document } from 'mongoose';

export type ArticleRequestStatus = 'pending' | 'processing' | 'done' | 'error';

export interface IArticleRequest extends Document {
  testo: string;
  pubblica: boolean;
  status: ArticleRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleRequestSchema = new Schema<IArticleRequest>(
  {
    testo:    { type: String, required: true },
    pubblica: { type: Boolean, default: false },
    status:   { type: String, enum: ['pending', 'processing', 'done', 'error'], default: 'pending' },
  },
  { timestamps: true, collection: 'article-requests' }
);

export default mongoose.model<IArticleRequest>('ArticleRequest', ArticleRequestSchema);
