// Tipi client per i capitoli admin degli assi strutturali (Fase A 2026-05-11).

export interface ChapterReference {
  id: string;
  footnoteId: string;
  authorIds: string[];
  bookIds: string[];
}

export interface ChapterFootnote {
  id: string;
  num: string;
  text: string;
}

export interface ChapterSection {
  anchor: string;
  title: string;
  order: number;
}

export interface AssiChapter {
  _id: string;
  axis_slug: string;
  axis_folder: string;
  axis_number: number;
  slug: string;
  chapter_number: number;
  order: number;

  title: string;
  body: string;
  references: ChapterReference[];
  footnotes: ChapterFootnote[];
  sections: ChapterSection[];

  prev_slug: string | null;
  next_slug: string | null;

  is_published: boolean;
  source_filename: string | null;
  _last_imported: string | null;
  _last_edited: string | null;
  _last_edited_by: string | null;
  _revision_count: number;

  createdAt: string;
  updatedAt: string;
}

export type AssiChapterSummary = Omit<AssiChapter, 'body' | 'references' | 'footnotes'> & {
  reference_count?: number;
};

export interface ValidationIssue {
  kind: 'missing_ref' | 'orphan_ref' | 'missing_footnote' | 'orphan_footnote' | 'duplicate_ref' | 'duplicate_footnote';
  detail: string;
}

export interface UpdateChapterResponse {
  chapter: AssiChapter;
  exported_to: string | null;
  export_error: string | null;
}
