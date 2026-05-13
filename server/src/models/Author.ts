// Catalogo autori — collection globale `authors`.
// Sostituisce il file statico client/public/data/authors.json (Fase 2 catalogo Mongo, 2026-05-12).
//
// `id` è uno slug stabile (es. "maurice-merleau-ponty") usato come FK nei capitoli
// (Reference.authorIds[]). L'immagine vive su Cloudflare R2: `image_url` è l'URL
// pubblico, `image_r2_key` la chiave dentro al bucket (serve per cancellare/sostituire).
// `projects[]` ammette rilevanza diversa per progetti diversi (sviluppo-bambino, hcaire, ...).

import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthorProjectScope {
  projectId: string;
  rilevanza: string;
}

export interface IAuthor extends Document {
  id: string;
  nome: string;

  // immagine R2
  image_url: string | null;
  image_r2_key: string | null;

  // metadata
  birth_year: number | null;
  death_year: number | null;
  bio_short: string | null;
  wikipedia: string | null;

  projects: IAuthorProjectScope[];
  tags: string[];

  _last_edited_by: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const ProjectScopeSchema = new Schema<IAuthorProjectScope>(
  {
    projectId: { type: String, required: true },
    rilevanza: { type: String, default: '' },
  },
  { _id: false },
);

const AuthorSchema = new Schema<IAuthor>(
  {
    id: { type: String, required: true, unique: true, index: true },
    nome: { type: String, required: true },

    image_url: { type: String, default: null },
    image_r2_key: { type: String, default: null },

    birth_year: { type: Number, default: null },
    death_year: { type: Number, default: null },
    bio_short: { type: String, default: null },
    wikipedia: { type: String, default: null },

    projects: { type: [ProjectScopeSchema], default: [] },
    tags: { type: [String], default: [] },

    _last_edited_by: { type: String, default: null },
  },
  { timestamps: true, collection: 'authors' },
);

// Fulltext search su nome + bio_short (per ricerca admin).
AuthorSchema.index({ nome: 'text', bio_short: 'text' });
// Filtro per progetto.
AuthorSchema.index({ 'projects.projectId': 1 });

export default mongoose.model<IAuthor>('Author', AuthorSchema);
