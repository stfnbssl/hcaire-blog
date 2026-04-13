import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  slug: string;
  titolo: string;
  descrizione: string;
  contenuto: string;
  autore: string;
  categoria: string;
  tags: string[];
  isPublished: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    slug:        { type: String, required: true, unique: true, trim: true },
    titolo:      { type: String, required: true, trim: true },
    descrizione: { type: String, default: '' },
    contenuto:   { type: String, default: '' },
    autore:      { type: String, default: 'admin' },
    categoria:   { type: String, default: 'general' },
    tags:        [{ type: String }],
    isPublished: { type: Boolean, default: true },
    isPinned:    { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'hcaire-content' }
);

export default mongoose.model<IContent>('Content', ContentSchema);
