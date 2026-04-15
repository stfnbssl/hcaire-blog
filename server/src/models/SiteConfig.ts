import mongoose, { Schema, Document } from 'mongoose';

export type SiteStatus = 'test' | 'production';

export interface ISiteConfig extends Document {
  status:    SiteStatus;
  updatedBy: string;
  updatedAt: Date;
  createdAt: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    status:    { type: String, enum: ['test', 'production'], default: 'test' },
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true, collection: 'site-config' }
);

export default mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);
