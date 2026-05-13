// Capitolo asse strutturale — Mongoose model.
// Source-of-truth (Fase A 2026-05-11): collection `assi_chapters`.
// I .md in normalized/ restano come backup git, rigenerati via dual-write export.
//
// Schema mirror del ChapterDocument (shared/types/assi.d.ts) con campi flat
// (no nested `frontmatter`) per facilitare query/index. Aggiunti:
//   - sections[] (slug+title H2 derivate dal body, sync on save)
//   - revision tracking
//   - _last_imported / _last_edited

import mongoose, { Schema, Document } from 'mongoose';

export interface IReference {
  id: string;
  footnoteId: string;
  authorIds: string[];
  bookIds: string[];
}

export interface IFootnote {
  id: string;
  num: string;
  text: string;
}

export interface IChapterSection {
  anchor: string;
  title: string;
  order: number;
}

export interface IAssiChapter extends Document {
  // identificazione
  axis_slug: string;       // es. "asse-1-ontologico-fenomenologico"
  axis_folder: string;     // es. "Asse 1 - Ontologico - fenomenologico" (filename .md)
  axis_number: number;     // 1..6
  slug: string;            // es. "capitolo-1-statuto-..."
  chapter_number: number;
  order: number;

  // contenuto
  title: string;
  body: string;            // markdown con token {{ref:rN}}
  references: IReference[];
  footnotes: IFootnote[];
  sections: IChapterSection[];   // derivate dal body

  // navigazione
  prev_slug: string | null;
  next_slug: string | null;

  // metadata
  is_published: boolean;
  source_filename: string | null;  // nome originale del .md sorgente
  _last_imported: Date | null;
  _last_edited: Date | null;
  _last_edited_by: string | null;  // Clerk userId
  _revision_count: number;

  createdAt: Date;
  updatedAt: Date;
}

const ReferenceSchema = new Schema<IReference>(
  {
    id: { type: String, required: true },
    footnoteId: { type: String, required: true },
    authorIds: { type: [String], default: [] },
    bookIds: { type: [String], default: [] },
  },
  { _id: false },
);

const FootnoteSchema = new Schema<IFootnote>(
  {
    id: { type: String, required: true },
    num: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const SectionSchema = new Schema<IChapterSection>(
  {
    anchor: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { _id: false },
);

const AssiChapterSchema = new Schema<IAssiChapter>(
  {
    axis_slug: { type: String, required: true, index: true },
    axis_folder: { type: String, required: true },
    axis_number: { type: Number, required: true, min: 1, max: 6 },
    slug: { type: String, required: true },
    chapter_number: { type: Number, required: true },
    order: { type: Number, required: true },

    title: { type: String, required: true },
    body: { type: String, required: true },
    references: { type: [ReferenceSchema], default: [] },
    footnotes: { type: [FootnoteSchema], default: [] },
    sections: { type: [SectionSchema], default: [] },

    prev_slug: { type: String, default: null },
    next_slug: { type: String, default: null },

    is_published: { type: Boolean, default: true },
    source_filename: { type: String, default: null },
    _last_imported: { type: Date, default: null },
    _last_edited: { type: Date, default: null },
    _last_edited_by: { type: String, default: null },
    _revision_count: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'assi_chapters' },
);

// Unicità slug capitolo nello stesso asse.
AssiChapterSchema.index({ axis_slug: 1, slug: 1 }, { unique: true });
// Ordinamento per asse.
AssiChapterSchema.index({ axis_slug: 1, order: 1 });
// Fulltext search su title + body (per editor admin search).
AssiChapterSchema.index({ title: 'text', body: 'text' });

export default mongoose.model<IAssiChapter>('AssiChapter', AssiChapterSchema);
