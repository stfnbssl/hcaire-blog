// Tipi condivisi per il sistema "assi strutturali" del progetto Sviluppo
// Bambino. Modello ibrido: corpo capitolo in markdown con token {{ref:rN}},
// riferimenti (autori/libri) e footnote estratti in array strutturati,
// catalogo autori/libri su MongoDB (collection `authors`/`books`).

// ── catalogo: autori e libri ────────────────────────────────────────────────
//
// Shape "legacy" esposta dal server al client via GET /api/sviluppo-bambino/
// catalogo/{authors,books}: il controller appiattisce il documento Mongo nei
// campi storici (`image`/`cover`/`rilevanza`/`birthYear`/...) per non rompere
// i consumer esistenti (Bibliografia, Chapter renderer, admin editor).

export interface Author {
  /** slug stabile, FK usata dai capitoli (Reference.authorIds[]) */
  id: string;
  /** nome in forma di citazione, es. "Maurice Merleau-Ponty" */
  nome: string;
  /** URL pubblico dell'immagine ritratto (Cloudflare R2). Stringa vuota se mancante. */
  image: string;
  /** testo markdown sulla rilevanza dell'autore nel progetto */
  rilevanza: string;
  /** anno di nascita, opzionale */
  birthYear?: number;
  /** anno di morte, opzionale */
  deathYear?: number;
}

export interface Book {
  /** slug stabile, FK usata dai capitoli (Reference.bookIds[]) */
  id: string;
  /** titolo in lingua di citazione, es. "Fenomenologia della percezione" */
  titolo: string;
  /** URL pubblico della copertina (Cloudflare R2). Stringa vuota se mancante. */
  cover: string;
  /** testo markdown sulla rilevanza del libro nel progetto */
  rilevanza: string;
  /** id degli autori (Author.id slug) */
  authorIds?: string[];
  /** anno di pubblicazione (originale), opzionale */
  anno?: number;
  /** titolo originale se diverso dal `titolo` di citazione */
  titoloOriginale?: string;
}

/** metadata della risposta catalogo */
export interface CatalogMeta {
  generatedAt: string;
  /** identifica la fonte ("mongo" dal Fase 4 catalogo) */
  source: string;
}

export interface AuthorsFile {
  _meta: CatalogMeta;
  authors: Author[];
}

export interface BooksFile {
  _meta: CatalogMeta;
  books: Book[];
}

// ── capitolo strutturato ────────────────────────────────────────────────────

export interface ChapterFrontmatter {
  title: string;
  asse: string;
  asse_number: number;
  asse_slug: string;
  chapter: number;
  order: number;
  slug: string;
  prev: string | null;
  next: string | null;
}

/** Riferimento bibliografico inline. Il body ha {{ref:<id>}} dove un riferimento appare. */
export interface Reference {
  /** id univoco nel capitolo, es. "r1", "r2" — assegnati nell'ordine di apparizione */
  id: string;
  /** id della footnote associata, es. "fn-1" */
  footnoteId: string;
  /** id degli autori citati a questo riferimento (può essere vuoto) */
  authorIds: string[];
  /** id dei libri citati a questo riferimento (può essere vuoto) */
  bookIds: string[];
}

/** Definizione di una footnote del capitolo. */
export interface Footnote {
  /** id univoco nel capitolo, es. "fn-1" */
  id: string;
  /** numero originale del marker nel markdown sorgente, es. "1" */
  num: string;
  /** testo della nota in markdown */
  text: string;
}

/** Riferimento sintetico a un capitolo, usato negli indici di citazione. */
export interface ChapterRef {
  asseSlug: string;
  asseTitle: string;
  asseNumber: number;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
}

/**
 * Indice delle citazioni: per ogni id (autore o libro) la lista dei capitoli
 * in cui appare almeno una `Reference`. Usato dalla pagina Bibliografia e dal
 * pannello rilevanza per "vedi capitoli che lo citano".
 */
export interface CitationsIndex {
  /** id autore → lista capitoli ordinata per (asseNumber, chapterNumber) */
  authors: Record<string, ChapterRef[]>;
  /** id libro → lista capitoli */
  books: Record<string, ChapterRef[]>;
  /** metadata di generazione */
  _meta: {
    generatedAt: string;
    totalChapters: number;
  };
}

/** Capitolo nella forma JSON ibrida: body markdown + arrays strutturati. */
export interface ChapterDocument {
  frontmatter: ChapterFrontmatter;
  /**
   * Markdown del corpo del capitolo. I marker [^N] e i tag <img class="ref-..."> originali
   * sono stati sostituiti da token nella forma {{ref:rN}}, uno per ogni `Reference`.
   */
  body: string;
  references: Reference[];
  footnotes: Footnote[];
  /** stato del file generato (per debugging della pipeline di conversione) */
  _meta?: {
    generatedAt: string;
    sourceFile: string;
  };
}
