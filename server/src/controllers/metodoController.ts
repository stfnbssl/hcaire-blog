import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import {
  readMarkdownFile,
  splitByH1,
  getContentBase,
} from '../services/staticContentReader';

const METODO_LANDING_PATH = 'metodo/landing.md';
const METODO_ARCH_PATH = 'metodo/01 Introduzione/01 Architettura del Progetto Sviluppo Bambino.md';
const METODO_METODOLOGIA_PATH = 'metodo/01 Introduzione/02 Metodologia del progetto Sviluppo del bambino.md';
const FASI_BASE = 'metodo/fasi';

const FASI_META: Array<{ slug: string; numero: number; title: string; excerpt: string; filename: string }> = [
  { slug: 'f1-fondazione-ontologica',              numero: 1, title: 'Fondazione Ontologica',                  filename: 'f1-fondazione-ontologica.md',              excerpt: 'Definisce che tipo di realtà è lo sviluppo infantile e che tipo di soggetto è il bambino: i vincoli concettuali che rendono possibile ogni strumento successivo.' },
  { slug: 'f2-traduzione-interdisciplinare',        numero: 2, title: 'Traduzione Interdisciplinare',            filename: 'f2-traduzione-interdisciplinare.md',        excerpt: 'La pipeline di sette operatori che rendono lo sviluppo leggibile professionalmente: Nodi Trasversali, Grammatica delle Configurazioni, operatori di lettura.' },
  { slug: 'f3-strumenti-operativi',                 numero: 3, title: 'Strumenti Operativi Contestualizzati',   filename: 'f3-strumenti-operativi.md',                 excerpt: 'Il passaggio dalla leggibilità all\'azione: come la Configurazione Evolutiva genera micro-dispositivi contestualizzati senza produrre prescrizioni.' },
  { slug: 'f4-formazione-e-trasformazione-sistemica', numero: 4, title: 'Formazione e Trasformazione Sistemica', filename: 'f4-formazione-e-trasformazione-sistemica.md', excerpt: 'La formazione della capacità di lettura configurazionale negli operatori e la trasformazione dei servizi come sistemi in sviluppo.' },
  { slug: 'f5-valutazione-configurazionale',        numero: 5, title: 'Valutazione Configurazionale',           filename: 'f5-valutazione-configurazionale.md',        excerpt: 'Come valutare l\'efficacia osservando la variazione delle configurazioni nel tempo, senza scale quantitative né misure di outcome singoli.' },
  { slug: 'f6-posizionamento-e-adozione-istituzionale', numero: 6, title: 'Posizionamento e Adozione Istituzionale', filename: 'f6-posizionamento-e-adozione-istituzionale.md', excerpt: 'Il posizionamento epistemologico del progetto rispetto alle discipline e la strategia progressiva di adozione nei servizi.' },
  { slug: 'f7-architettura-integrata',              numero: 7, title: 'Architettura Integrata',                 filename: 'f7-architettura-integrata.md',              excerpt: 'La mappa complessiva del progetto: le versioni canoniche, i confini costituzionali, il perché questo framework era necessario.' },
];

function findMdByPrefix(relDir: string, prefix: string): string | null {
  const fullDir = path.join(getContentBase(), relDir);
  if (!fs.existsSync(fullDir)) return null;
  const found = fs.readdirSync(fullDir).find((f) => f.endsWith('.md') && f.startsWith(prefix));
  return found ? path.join(relDir, found) : null;
}

function readPage(relPath: string) {
  const { frontmatter, content, isEmpty } = readMarkdownFile(relPath);
  const body = isEmpty ? '' : (splitByH1(content)[0]?.content ?? content);
  return { frontmatter, body, isEmpty };
}

// GET /api/metodo  (landing)
export function getMetodo(_req: Request, res: Response) {
  try {
    const { frontmatter, body } = readPage(METODO_LANDING_PATH);
    const title = (frontmatter.title as string) ?? 'Il metodo';
    res.json({
      title,
      content: body,
      groups: [
        { title: 'Introduzione al progetto',              slug: 'introduzione',          excerpt: 'L\'architettura in sette livelli e la metodologia del progetto.' },
        { title: 'Rapporto con la ricerca scientifica',   slug: 'ricerca-scientifica',   excerpt: 'Il posizionamento epistemologico rispetto alla ricerca empirica.' },
        { title: 'Rapporto con l\'intelligenza artificiale', slug: 'rapporto-con-ia',    excerpt: 'Il rationale dell\'uso dell\'AI come supporto cognitivo al progetto.' },
      ],
    });
  } catch {
    res.status(500).json({ error: 'Errore lettura metodo' });
  }
}

// GET /api/metodo/introduzione
export function getMetodoIntroduzione(_req: Request, res: Response) {
  try {
    const relPath = 'metodo/01 Introduzione/introduzione-metodologia.md';
    const { content, isEmpty } = readMarkdownFile(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Introduzione non trovata' });
    const body = splitByH1(content)[0]?.content ?? content;
    res.json({ title: 'Introduzione alla metodologia', content: body, prev: null, next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura introduzione' });
  }
}

// GET /api/metodo/introduzione/architettura
export function getMetodoArchitettura(_req: Request, res: Response) {
  try {
    const { frontmatter, body, isEmpty } = readPage(METODO_ARCH_PATH);
    if (isEmpty) return res.status(404).json({ error: 'Architettura non trovata' });
    res.json({ title: (frontmatter.title as string) ?? 'Architettura del progetto', content: body, prev: null, next: 'metodologia' });
  } catch {
    res.status(500).json({ error: 'Errore lettura architettura' });
  }
}

// GET /api/metodo/introduzione/metodologia
export function getMetodoMetodologia(_req: Request, res: Response) {
  try {
    const { frontmatter, body, isEmpty } = readPage(METODO_METODOLOGIA_PATH);
    if (isEmpty) return res.status(404).json({ error: 'Metodologia non trovata' });
    res.json({ title: (frontmatter.title as string) ?? 'Metodologia del progetto', content: body, prev: 'architettura', next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura metodologia' });
  }
}

// GET /api/metodo/ricerca-scientifica
export function getMetodoRicercaScientifica(_req: Request, res: Response) {
  try {
    const relPath = 'metodo/02 rapporto con ricerca scientifica/rapporto-con-ricerca-scientifica.md';
    const { content, isEmpty } = readMarkdownFile(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Rapporto con ricerca scientifica non trovato' });
    const body = splitByH1(content)[0]?.content ?? content;
    res.json({ title: 'Rapporto con la ricerca scientifica', content: body, prev: null, next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura ricerca scientifica' });
  }
}

// GET /api/metodo/ricerca-scientifica/collocazione
export function getMetodoCollocazione(_req: Request, res: Response) {
  try {
    const relPath = findMdByPrefix('metodo/02 rapporto con ricerca scientifica', 'OM5 ');
    if (!relPath) return res.status(404).json({ error: 'File non trovato' });
    const { frontmatter, body, isEmpty } = readPage(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Collocazione non trovata' });
    res.json({ title: (frontmatter.title as string) ?? 'Collocazione', content: body, prev: null, next: 'statuto-epistemologico' });
  } catch {
    res.status(500).json({ error: 'Errore lettura collocazione' });
  }
}

// GET /api/metodo/ricerca-scientifica/statuto-epistemologico
export function getMetodoStatutoEpistemologico(_req: Request, res: Response) {
  try {
    const relPath = findMdByPrefix('metodo/02 rapporto con ricerca scientifica', 'OM5b');
    if (!relPath) return res.status(404).json({ error: 'File non trovato' });
    const { frontmatter, body, isEmpty } = readPage(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Statuto epistemologico non trovato' });
    res.json({ title: (frontmatter.title as string) ?? 'Statuto epistemologico', content: body, prev: 'collocazione', next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura statuto epistemologico' });
  }
}

// GET /api/metodo/fasi
// Le fasi 4-7 sono volutamente escluse dall'indice pubblico in attesa di implementazione completa;
// i file markdown restano in repo e l'endpoint di dettaglio resta accessibile.
export function getFasiIndex(_req: Request, res: Response) {
  try {
    res.json({
      fasi: FASI_META
        .filter((f) => f.numero <= 3)
        .map(({ slug, numero, title, excerpt }) => ({ slug, numero, title, excerpt })),
    });
  } catch {
    res.status(500).json({ error: 'Errore lettura fasi' });
  }
}

// GET /api/metodo/fasi/:faseSlug
export function getFase(req: Request, res: Response) {
  try {
    const { faseSlug } = req.params;
    const idx = FASI_META.findIndex((f) => f.slug === faseSlug);
    if (idx === -1) return res.status(404).json({ error: 'Fase non trovata' });
    const meta = FASI_META[idx];
    const relPath = path.join(FASI_BASE, meta.filename);
    const { content, isEmpty } = readMarkdownFile(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Contenuto fase non trovato' });
    const body = splitByH1(content)[0]?.content ?? content;
    res.json({
      slug: meta.slug,
      numero: meta.numero,
      title: `Fase ${meta.numero} — ${meta.title}`,
      content: body,
      prev: idx > 0 ? FASI_META[idx - 1].slug : null,
      next: idx < FASI_META.length - 1 ? FASI_META[idx + 1].slug : null,
    });
  } catch {
    res.status(500).json({ error: 'Errore lettura fase' });
  }
}

// GET /api/metodo/rapporto-con-ia
export function getMetodoRapportoConIA(_req: Request, res: Response) {
  try {
    const relPath = findMdByPrefix('metodo/03 rapporto con ia', 'OM3');
    if (!relPath) return res.status(404).json({ error: 'File non trovato' });
    const { frontmatter, body, isEmpty } = readPage(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Rapporto con IA non trovato' });
    res.json({ title: (frontmatter.title as string) ?? 'Rapporto con l\'intelligenza artificiale', content: body, prev: null, next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura rapporto con IA' });
  }
}
