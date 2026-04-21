import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  bartlebyId: string;
  name: string;
  slug: string;
  skill_type: string;
  description: string;
  instruction_payload: Schema.Types.Mixed;
  status: string;
  version: string;
  owner_type: string;
  owner_id?: string;
}

const SkillSchema = new Schema<ISkill>({
  bartlebyId:          { type: String, required: true, unique: true },
  name:                { type: String, required: true },
  slug:                { type: String, required: true },
  skill_type:          { type: String, required: true },
  description:         String,
  instruction_payload: Schema.Types.Mixed,
  status:              { type: String, default: 'approved' },
  version:             { type: String, default: '1.0' },
  owner_type:          { type: String, default: 'hcaire' },
  owner_id:            String,
}, { collection: 'bartleby_skills' });

export default mongoose.model<ISkill>('BartlebySkill', SkillSchema);
