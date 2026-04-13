import mongoose, { Schema, Document } from 'mongoose';
import type { LogStep, LogActor } from './ArticleRequest';

export interface IWorkflowLog extends Document {
  articleRequestId: mongoose.Types.ObjectId;
  testoPreview: string;
  step: LogStep;
  actor: LogActor;
  message: string;
  requestStatus: string;
  createdAt: Date;
}

const WorkflowLogSchema = new Schema<IWorkflowLog>(
  {
    articleRequestId: { type: Schema.Types.ObjectId, ref: 'ArticleRequest', required: true },
    testoPreview:     { type: String, default: '' },
    step:             { type: String, required: true },
    actor:            { type: String, required: true },
    message:          { type: String, required: true },
    requestStatus:    { type: String, default: 'pending' },
  },
  { timestamps: true, collection: 'workflow-logs' }
);

// Index per query rapide per richiesta o per data
WorkflowLogSchema.index({ articleRequestId: 1 });
WorkflowLogSchema.index({ createdAt: -1 });

export default mongoose.model<IWorkflowLog>('WorkflowLog', WorkflowLogSchema);
