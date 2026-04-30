import mongoose, { Schema, Document } from 'mongoose';

export type SupportedLang = 'it' | 'en';
export const SUPPORTED_LANGS: SupportedLang[] = ['it', 'en'];
export const DEFAULT_LANG: SupportedLang = 'it';

export type ContentType = 'plain' | 'markdown';
export const CONTENT_TYPES: ContentType[] = ['plain', 'markdown'];

export interface ISiteContent extends Document {
  key:          string;
  namespace:    string;
  type:         ContentType;
  description?: string;
  translations: Partial<Record<SupportedLang, string>>;
  updatedBy:    string;
  updatedAt:    Date;
  createdAt:    Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key:          { type: String, required: true, unique: true, index: true },
    namespace:    { type: String, required: true, default: 'common', index: true },
    type:         { type: String, enum: CONTENT_TYPES, default: 'plain' },
    description:  { type: String, default: '' },
    translations: {
      type: Map,
      of: String,
      default: {},
    },
    updatedBy:    { type: String, default: '' },
  },
  { timestamps: true, collection: 'site-content' }
);

export default mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
