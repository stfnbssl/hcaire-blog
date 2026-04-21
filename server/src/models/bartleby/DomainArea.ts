import mongoose, { Document, Schema } from 'mongoose';

export interface IDomainArea extends Document {
  bartlebyId: string;
  name: string;
  slug: string;
  description: string;
  purpose: string;
  language_style: string;
  risk_profile: string;
  status: string;
  version: string;
}

const DomainAreaSchema = new Schema<IDomainArea>({
  bartlebyId:     { type: String, required: true, unique: true },
  name:           { type: String, required: true },
  slug:           { type: String, required: true },
  description:    { type: String, required: true },
  purpose:        { type: String, required: true },
  language_style: { type: String, required: true },
  risk_profile:   { type: String, required: true },
  status:         { type: String, default: 'approved' },
  version:        { type: String, default: '1.0' },
}, { collection: 'bartleby_domain_areas' });

export default mongoose.model<IDomainArea>('BartlebyDomainArea', DomainAreaSchema);
