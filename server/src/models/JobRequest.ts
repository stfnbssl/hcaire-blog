import mongoose, { Schema, Document, Types } from 'mongoose';
import type { JobStatus } from '../shared/types/jobs';

export interface IJobRequest extends Document {
  jobDefinitionId: Types.ObjectId;
  params: Record<string, unknown>;
  status: JobStatus;
  result?: string;
  error?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobRequestSchema = new Schema<IJobRequest>(
  {
    jobDefinitionId: {
      type: Schema.Types.ObjectId,
      ref: 'JobDefinition',
      required: true,
    },
    params:      { type: Schema.Types.Mixed, default: {} },
    status:      {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    result:      { type: String },
    error:       { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true, collection: 'job-requests' }
);

export default mongoose.model<IJobRequest>('JobRequest', JobRequestSchema);
