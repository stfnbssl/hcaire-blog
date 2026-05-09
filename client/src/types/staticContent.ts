export interface HcaireSection {
  slug: string;
  title: string;
  content: string;
  isEmpty: boolean;
  frontmatter?: Record<string, unknown>;
}

export interface HcaireIndex {
  sections: HcaireSection[];
  fullContent: string;
}

export interface ChapterMeta {
  slug: string;
  title: string;
  chapter: number;
  order: number;
  asse?: string;
  asse_number?: number;
  prev?: string | null;
  next?: string | null;
}

export interface AsseMeta {
  slug: string;
  folderName: string;
  title: string;
  chapterCount: number;
  chapters: ChapterMeta[];
}

export interface AssiIndex {
  assi: AsseMeta[];
}

export interface AsseChapters {
  asseSlug: string;
  title: string;
  chapters: ChapterMeta[];
}

export interface AsseOverview {
  title: string;
  content: string;
  slug: string;
  order: number;
  prev: string | null;
  next: string | null;
  chaptersSlug: string;
}

export interface ModelloIndex {
  assi: Array<{ title: string; content: string; slug: string; order: number }>;
}

export interface ConcettiResponse {
  title: string;
  concetti: Array<{ title: string; content: string }>;
}

export interface NotaMetodologicaResponse {
  title: string;
  content: string;
}

export interface FinalitaResponse {
  title: string;
  content: string;
}

export interface MetodoResponse {
  title: string;
  premessaContent: string;
  ambitiContent: string;
}

export interface MetodoGroupCard {
  title: string;
  slug: string;
  excerpt: string;
}

export interface MetodoLandingResponse {
  title: string;
  content: string;
  groups: MetodoGroupCard[];
}

export interface MetodoGroupIndexResponse {
  title: string;
  pages: MetodoGroupCard[];
}

export interface MetodoPageResponse {
  title: string;
  content: string;
  prev: string | null;
  next: string | null;
}

export interface RiflessioniItem {
  filename: string;
  title: string;
  isEmpty: boolean;
  slug: string;
}

export interface InterlocuzioniItem {
  title: string;
  slug: string;
  count: number;
}

export interface DisciplinaMeta {
  slug: string;
  disciplina: string;
  assi: number[];
}

export interface InterlocuzioniSessione {
  id: string;
  label: string;
  discipline: DisciplinaMeta[];
}

export interface InterlocuzioniIndex {
  sessioni: InterlocuzioniSessione[];
}

export interface DisciplinaDetail {
  slug: string;
  disciplina: string;
  sessione: string;
  assi: number[];
  content: string;
  prev: string | null;
  next: string | null;
  prevLabel: string | null;
  nextLabel: string | null;
}

export interface FaseMeta {
  slug: string;
  numero: number;
  title: string;
  excerpt: string;
}

export interface FasiIndex {
  fasi: FaseMeta[];
}

export interface FaseDetail {
  slug: string;
  numero: number;
  title: string;
  content: string;
  prev: string | null;
  next: string | null;
}
