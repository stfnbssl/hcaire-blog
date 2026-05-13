// Tipi client per gli endpoint admin del catalogo authors/books.
// Specchio dei modelli Mongo `Author` e `Book` (server/src/models/).

export interface ProjectScope {
  projectId: string;
  rilevanza: string;
}

export interface CatalogAuthor {
  _id: string;
  id: string;
  nome: string;

  image_url: string | null;
  image_r2_key: string | null;

  birth_year: number | null;
  death_year: number | null;
  bio_short: string | null;
  wikipedia: string | null;

  projects: ProjectScope[];
  tags: string[];

  _last_edited_by: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogBook {
  _id: string;
  id: string;
  titolo: string;
  titolo_originale: string | null;

  autoreIds: string[];

  cover_url: string | null;
  cover_r2_key: string | null;

  anno: number | null;
  editore: string | null;

  projects: ProjectScope[];
  tags: string[];

  _last_edited_by: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CitingChapter {
  axis_slug: string;
  axis_number: number;
  slug: string;
  chapter_number: number;
  title: string;
}

export interface CatalogListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  skip: number;
}
