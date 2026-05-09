import { API_URL } from '../utils/constants';
import type {
  HcaireIndex,
  HcaireSection,
  AssiIndex,
  AsseChapters,
  AsseOverview,
  ModelloIndex,
  ConcettiResponse,
  NotaMetodologicaResponse,
  FinalitaResponse,
  MetodoResponse,
  MetodoLandingResponse,
  MetodoGroupIndexResponse,
  MetodoPageResponse,
  RiflessioniItem,
  InterlocuzioniItem,
  InterlocuzioniIndex,
  DisciplinaDetail,
  FasiIndex,
  FaseDetail,
} from '../types/staticContent';
import type {
  ChapterDocument,
  AuthorsFile,
  BooksFile,
  CitationsIndex,
} from '@shared/types/assi';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// HCAIRE
export const hcaireApi = {
  getIndex: () => get<HcaireIndex>('/hcaire'),
  getSection: (slug: string) => get<HcaireSection>(`/hcaire/${slug}`),
  getSubsection: (section: string, slug: string) => get<HcaireSection>(`/hcaire/${section}/${slug}`),
};

// Sviluppo bambino
export const sviluppoBambinoApi = {
  getFinalita: () => get<FinalitaResponse>('/sviluppo-bambino/finalita'),
  getMetodo: () => get<MetodoLandingResponse>('/sviluppo-bambino/metodo'),
  getMetodoIntroduzione: () => get<MetodoPageResponse>('/sviluppo-bambino/metodo/introduzione'),
  getMetodoRicercaScientifica: () => get<MetodoPageResponse>('/sviluppo-bambino/metodo/ricerca-scientifica'),
  getMetodoRapportoConIA: () => get<MetodoPageResponse>('/sviluppo-bambino/metodo/rapporto-con-ia'),
  getMetodoFasiIndex: () => get<FasiIndex>('/sviluppo-bambino/metodo/fasi'),
  getMetodoFase: (faseSlug: string) => get<FaseDetail>(`/sviluppo-bambino/metodo/fasi/${faseSlug}`),
  getModello: () => get<ModelloIndex>('/sviluppo-bambino/modello'),
  getModelloAsse: (asseSlug: string) => get<AsseOverview>(`/sviluppo-bambino/modello/${asseSlug}`),
  getConcetti: () => get<ConcettiResponse>('/sviluppo-bambino/concetti'),
  getNotaMetodologica: () => get<NotaMetodologicaResponse>('/sviluppo-bambino/nota-metodologica'),
  getAssiIndex: () => get<AssiIndex>('/sviluppo-bambino/assi'),
  getAsseChapters: (asseSlug: string) => get<AsseChapters>(`/sviluppo-bambino/assi/${asseSlug}`),
  getChapter: (asseSlug: string, chapterSlug: string) =>
    get<ChapterDocument>(`/sviluppo-bambino/assi/${asseSlug}/${chapterSlug}`),
  getCatalogoAuthors: () => get<AuthorsFile>('/sviluppo-bambino/catalogo/authors'),
  getCatalogoBooks: () => get<BooksFile>('/sviluppo-bambino/catalogo/books'),
  getCitations: () => get<CitationsIndex>('/sviluppo-bambino/assi/citazioni'),
  getRiflessioni: () => get<{ items: RiflessioniItem[] }>('/sviluppo-bambino/riflessioni'),
  getInterlocuzioni: () => get<{ ambiti: InterlocuzioniItem[] }>('/sviluppo-bambino/interlocuzioni'),
  getInterlocuzioniIndex: () => get<InterlocuzioniIndex>('/sviluppo-bambino/interlocuzioni'),
  getInterlocuzioneDisciplina: (slug: string) => get<DisciplinaDetail>(`/sviluppo-bambino/interlocuzioni/${slug}`),
  getProduzioniGuidaPipeline: () => get<{ title: string; content: string }>('/sviluppo-bambino/produzioni/guida-pipeline'),
  getProduzioniNuovaRicercaInfo: () => get<{ title: string; content: string }>('/sviluppo-bambino/produzioni/nuova-ricerca-info'),
};
