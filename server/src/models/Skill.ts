import mongoose, { Schema, Document } from 'mongoose';
import type {
  SkillCategory,
  SkillParameter,
} from '../shared/types/jobs';

export interface ISkill extends Document {
  name: string;
  description: string;
  category: SkillCategory;
  parameters: SkillParameter[];
  claudeMdRef?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillParameterSchema = new Schema<SkillParameter>(
  {
    name:         { type: String, required: true },
    type:         {
      type: String,
      enum: ['string', 'number', 'boolean', 'array'],
      required: true,
    },
    required:     { type: Boolean, required: true },
    description:  { type: String, default: '' },
    defaultValue: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const SkillSchema = new Schema<ISkill>(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    category:    {
      type: String,
      enum: ['search', 'write'],
      required: true,
    },
    parameters:  { type: [SkillParameterSchema], default: [] },
    claudeMdRef: { type: String },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'skills' }
);

export default mongoose.model<ISkill>('Skill', SkillSchema);
