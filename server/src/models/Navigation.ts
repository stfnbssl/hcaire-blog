import mongoose, { Schema, Document } from 'mongoose';

export interface INavigation extends Document {
  titolo: string;
  slug: string;
  isSpecial: boolean;
  order: number;
  isVisible: boolean;
}

const NavigationSchema = new Schema<INavigation>(
  {
    titolo:    { type: String, required: true },
    slug:      { type: String, required: true, unique: true },
    isSpecial: { type: Boolean, default: false },
    order:     { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { collection: 'navigation' }
);

export default mongoose.model<INavigation>('Navigation', NavigationSchema);
