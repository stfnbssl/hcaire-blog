import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPlugin extends Document {
  name: string;
  description: string;
  config: Record<string, unknown>;
  compatibleSkills: Types.ObjectId[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PluginSchema = new Schema<IPlugin>(
  {
    name:             { type: String, required: true, unique: true, trim: true },
    description:      { type: String, default: '' },
    config:           { type: Schema.Types.Mixed, default: {} },
    compatibleSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill', default: [] }],
    active:           { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'plugins' }
);

export default mongoose.model<IPlugin>('Plugin', PluginSchema);
