import mongoose, { Schema, Document, Types } from 'mongoose';
import type { JobType } from '../shared/types/jobs';

export interface IJobDefinition extends Document {
  name: string;
  type: JobType;
  description: string;
  skills: Types.ObjectId[];
  plugins: Types.ObjectId[];
  defaultParams: Record<string, unknown>;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobDefinitionSchema = new Schema<IJobDefinition>(
  {
    name:          { type: String, required: true, unique: true, trim: true },
    type:          {
      type: String,
      enum: ['research', 'write', 'research-and-write'],
      required: true,
    },
    description:   { type: String, default: '' },
    skills:        [{ type: Schema.Types.ObjectId, ref: 'Skill', default: [] }],
    plugins:       [{ type: Schema.Types.ObjectId, ref: 'Plugin', default: [] }],
    defaultParams: { type: Schema.Types.Mixed, default: {} },
    active:        { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'job-definitions' }
);

export default mongoose.model<IJobDefinition>('JobDefinition', JobDefinitionSchema);
