import mongoose, { Document, Schema } from 'mongoose';

export interface IFoundationDocument extends Document {
  bartlebyId: string;
  type: string;
  title: string;
  slug: string;
  summary: string;
  body?: string;
  file_path?: string;
  status: string;
  version: string;
  created_by?: string;
  approved_by?: string;
  created_at?: string;
  updated_at?: string;
}

const FoundationDocumentSchema = new Schema<IFoundationDocument>({
  bartlebyId:  { type: String, required: true, unique: true },
  type:        { type: String, required: true },
  title:       { type: String, required: true },
  slug:        { type: String, required: true },
  summary:     { type: String, required: true },
  body:        String,
  file_path:   String,
  status:      { type: String, default: 'approved' },
  version:     { type: String, default: '1.0' },
  created_by:  String,
  approved_by: String,
  created_at:  String,
  updated_at:  String,
}, { collection: 'bartleby_foundation_documents' });

export default mongoose.model<IFoundationDocument>('BartlebyFoundationDocument', FoundationDocumentSchema);
