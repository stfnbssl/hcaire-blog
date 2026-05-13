// Catalogo libri — collection globale `books`.
// Sostituisce il file statico client/public/data/books.json (Fase 2 catalogo Mongo, 2026-05-12).
//
// `id` slug stabile usato come FK nei capitoli (Reference.bookIds[]).
// `autoreIds[]` è array di Author.id (slug) — un libro può avere più autori
// (curatori, antologie). La copertina vive su R2 come per gli autori.

import mongoose, { Schema, Document } from 'mongoose';

export interface IBookProjectScope {
  projectId: string;
  rilevanza: string;
}

export interface IBook extends Document {
  id: string;
  titolo: string;
  titolo_originale: string | null;

  // FK ai documenti Author (Author.id slug). Array per ammettere antologie/curatele.
  autoreIds: string[];

  // immagine R2 (copertina)
  cover_url: string | null;
  cover_r2_key: string | null;

  anno: number | null;
  editore: string | null;

  projects: IBookProjectScope[];
  tags: string[];

  _last_edited_by: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const ProjectScopeSchema = new Schema<IBookProjectScope>(
  {
    projectId: { type: String, required: true },
    rilevanza: { type: String, default: '' },
  },
  { _id: false },
);

const BookSchema = new Schema<IBook>(
  {
    id: { type: String, required: true, unique: true, index: true },
    titolo: { type: String, required: true },
    titolo_originale: { type: String, default: null },

    autoreIds: { type: [String], default: [] },

    cover_url: { type: String, default: null },
    cover_r2_key: { type: String, default: null },

    anno: { type: Number, default: null },
    editore: { type: String, default: null },

    projects: { type: [ProjectScopeSchema], default: [] },
    tags: { type: [String], default: [] },

    _last_edited_by: { type: String, default: null },
  },
  { timestamps: true, collection: 'books' },
);

BookSchema.index({ titolo: 'text', editore: 'text' });
BookSchema.index({ 'projects.projectId': 1 });
BookSchema.index({ autoreIds: 1 });

export default mongoose.model<IBook>('Book', BookSchema);
