import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import {
  readMarkdownFile,
  readChaptersInDir,
  listSubdirectories,
  splitByH1,
  splitByH2,
  getContentBase,
} from '../services/staticContentReader';

const MODELLO_PATH = "progetti/sviluppo bambino/metodo/riflessioni/01 Modello assi strutturali di sviluppo del bambino (0-13 anni) .md";
const FINALITA_PATH = "progetti/sviluppo bambino/finalità/01 - Natura e finalità del progetto \u201cSviluppo del bambino\u201d.md";
const NORMALIZED_BASE = "progetti/sviluppo bambino/assi strutturali/normalized";
const RIFLESSIONI_BASE = "progetti/sviluppo bambino/metodo/riflessioni";
const INTERLOCUZIONI_BASE = "progetti/sviluppo bambino/interlocuzioni disciplinari";

const METODO_LANDING_PATH = "progetti/sviluppo bambino/metodo/landing.md";
const FASI_BASE = "progetti/sviluppo bambino/metodo/fasi";

const FASI_META: Array<{ slug: string; numero: number; title: string; excerpt: string; filename: string }> = [
  { slug: 'f1-fondazione-ontologica',              numero: 1, title: 'Fondazione Ontologica',                  filename: 'f1-fondazione-ontologica.md',              excerpt: 'Definisce che tipo di realtà è lo sviluppo infantile e che tipo di soggetto è il bambino: i vincoli concettuali che rendono possibile ogni strumento successivo.' },
  { slug: 'f2-traduzione-interdisciplinare',        numero: 2, title: 'Traduzione Interdisciplinare',            filename: 'f2-traduzione-interdisciplinare.md',        excerpt: 'La pipeline di sette operatori che rendono lo sviluppo leggibile professionalmente: Nodi Trasversali, Grammatica delle Configurazioni, operatori di lettura.' },
  { slug: 'f3-strumenti-operativi',                 numero: 3, title: 'Strumenti Operativi Contestualizzati',   filename: 'f3-strumenti-operativi.md',                 excerpt: 'Il passaggio dalla leggibilità all\'azione: come la Configurazione Evolutiva genera micro-dispositivi contestualizzati senza produrre prescrizioni.' },
  { slug: 'f4-formazione-e-trasformazione-sistemica', numero: 4, title: 'Formazione e Trasformazione Sistemica', filename: 'f4-formazione-e-trasformazione-sistemica.md', excerpt: 'La formazione della capacità di lettura configurazionale negli operatori e la trasformazione dei servizi come sistemi in sviluppo.' },
  { slug: 'f5-valutazione-configurazionale',        numero: 5, title: 'Valutazione Configurazionale',           filename: 'f5-valutazione-configurazionale.md',        excerpt: 'Come valutare l\'efficacia osservando la variazione delle configurazioni nel tempo, senza scale quantitative né misure di outcome singoli.' },
  { slug: 'f6-posizionamento-e-adozione-istituzionale', numero: 6, title: 'Posizionamento e Adozione Istituzionale', filename: 'f6-posizionamento-e-adozione-istituzionale.md', excerpt: 'Il posizionamento epistemologico del progetto rispetto alle discipline e la strategia progressiva di adozione nei servizi.' },
  { slug: 'f7-architettura-integrata',              numero: 7, title: 'Architettura Integrata',                 filename: 'f7-architettura-integrata.md',              excerpt: 'La mappa complessiva del progetto: le versioni canoniche, i confini costituzionali, il perché questo framework era necessario.' },
];
const METODO_ARCH_PATH = "progetti/sviluppo bambino/metodo/01 Introduzione/01 Architettura del Progetto Sviluppo Bambino.md";
const METODO_METODOLOGIA_PATH = "progetti/sviluppo bambino/metodo/01 Introduzione/02 Metodologia del progetto Sviluppo del bambino.md";

// Maps folder names to URL slugs
const ASSE_FOLDER_TO_SLUG: Record<string, string> = {
  'Asse 1 - Ontologico - fenomenologico': 'asse-1-ontologico-fenomenologico',
  'Asse 2 - Affettivo -morale': 'asse-2-affettivo-morale',
  'Asse 3 - Normativo - educativo': 'asse-3-normativo-educativo',
  'Asse 4 - Separazione e Limite': 'asse-4-separazione-e-limite',
  'Asse 5 - Desiderio': 'asse-5-desiderio',
  'Asse 6 - Storico - culturale': 'asse-6-storico-culturale',
};

const ASSE_SLUG_TO_FOLDER: Record<string, string> = Object.fromEntries(
  Object.entries(ASSE_FOLDER_TO_SLUG).map(([k, v]) => [v, k])
);

function parseModello() {
  const { content } = readMarkdownFile(MODELLO_PATH);
  // The file has no frontmatter; content is the full text
  // Split by H1 to get: main body, Concetti, Nota critica, Nota metodologica
  const h1sections = splitByH1(content);
  return h1sections;
}

function getModelloH1(title: string) {
  const sections = parseModello();
  return sections.find((s) => s.title.toLowerCase().includes(title.toLowerCase()));
}

function getAssiFromModello() {
  const h1sections = parseModello();
  // First H1 (or preamble) contains the assi as ## headings
  const mainSection = h1sections[0];
  if (!mainSection) return { premessa: null, assi: [] };

  const h2 = splitByH2(mainSection.content);
  const premessa = h2.find((s) => s.title.toLowerCase().includes('premessa')) ?? null;
  const assi = h2.filter((s) => /^\d+[\\.]\s/.test(s.title) || /^asse/i.test(s.title));
  return { premessa, assi };
}

// GET /api/sviluppo-bambino/modello
export function getModello(req: Request, res: Response) {
  try {
    const { assi } = getAssiFromModello();
    const assiWithSlugs = assi.map((a, i) => ({
      title: a.title,
      content: a.content,
      slug: `asse-${i + 1}-${slugifyAsseName(a.title, i + 1)}`,
      order: i + 1,
    }));
    res.json({ assi: assiWithSlugs });
  } catch {
    res.status(500).json({ error: 'Errore lettura modello' });
  }
}

// GET /api/sviluppo-bambino/modello/:asseSlug
export function getModelloAsse(req: Request, res: Response) {
  try {
    const { asseSlug } = req.params;
    const { assi } = getAssiFromModello();
    const idx = assi.findIndex((_, i) => `asse-${i + 1}-${slugifyAsseName(assi[i].title, i + 1)}` === asseSlug);
    if (idx === -1) return res.status(404).json({ error: 'Asse non trovato' });
    const asse = assi[idx];
    res.json({
      title: asse.title,
      content: asse.content,
      slug: asseSlug,
      order: idx + 1,
      prev: idx > 0 ? `asse-${idx}-${slugifyAsseName(assi[idx - 1].title, idx)}` : null,
      next: idx < assi.length - 1 ? `asse-${idx + 2}-${slugifyAsseName(assi[idx + 1].title, idx + 2)}` : null,
      chaptersSlug: ASSE_FOLDER_TO_SLUG[Object.keys(ASSE_FOLDER_TO_SLUG)[idx]] ?? asseSlug,
    });
  } catch {
    res.status(500).json({ error: 'Errore lettura asse' });
  }
}

// GET /api/sviluppo-bambino/finalita
export function getFinalita(req: Request, res: Response) {
  try {
    const { frontmatter, content, isEmpty } = readMarkdownFile(FINALITA_PATH);
    if (isEmpty) return res.status(404).json({ error: 'Finalità non trovata' });
    const h1sections = splitByH1(content);
    const body = h1sections[0]?.content ?? content;
    const title = (frontmatter.title as string) ?? 'Natura e finalità del progetto';
    res.json({ title, content: body });
  } catch {
    res.status(500).json({ error: 'Errore lettura finalità' });
  }
}

// Helper: find first .md file in a dir whose name starts with prefix
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

// GET /api/sviluppo-bambino/metodo  (landing)
export function getMetodo(req: Request, res: Response) {
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

// GET /api/sviluppo-bambino/metodo/introduzione
export function getMetodoIntroduzione(req: Request, res: Response) {
  try {
    const relPath = 'progetti/sviluppo bambino/metodo/01 Introduzione/introduzione-metodologia.md';
    const { content, isEmpty } = readMarkdownFile(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Introduzione non trovata' });
    const body = splitByH1(content)[0]?.content ?? content;
    res.json({ title: 'Introduzione alla metodologia', content: body, prev: null, next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura introduzione' });
  }
}

// GET /api/sviluppo-bambino/metodo/introduzione/architettura
export function getMetodoArchitettura(req: Request, res: Response) {
  try {
    const { frontmatter, body, isEmpty } = readPage(METODO_ARCH_PATH);
    if (isEmpty) return res.status(404).json({ error: 'Architettura non trovata' });
    res.json({ title: (frontmatter.title as string) ?? 'Architettura del progetto', content: body, prev: null, next: 'metodologia' });
  } catch {
    res.status(500).json({ error: 'Errore lettura architettura' });
  }
}

// GET /api/sviluppo-bambino/metodo/introduzione/metodologia
export function getMetodoMetodologia(req: Request, res: Response) {
  try {
    const { frontmatter, body, isEmpty } = readPage(METODO_METODOLOGIA_PATH);
    if (isEmpty) return res.status(404).json({ error: 'Metodologia non trovata' });
    res.json({ title: (frontmatter.title as string) ?? 'Metodologia del progetto', content: body, prev: 'architettura', next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura metodologia' });
  }
}

// GET /api/sviluppo-bambino/metodo/ricerca-scientifica
export function getMetodoRicercaScientifica(req: Request, res: Response) {
  try {
    const relPath = 'progetti/sviluppo bambino/metodo/02 rapporto con ricerca scientifica/rapporto-con-ricerca-scientifica.md';
    const { content, isEmpty } = readMarkdownFile(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Rapporto con ricerca scientifica non trovato' });
    const body = splitByH1(content)[0]?.content ?? content;
    res.json({ title: 'Rapporto con la ricerca scientifica', content: body, prev: null, next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura ricerca scientifica' });
  }
}

// GET /api/sviluppo-bambino/produzioni/guida-pipeline
export function getProduzioniGuidaPipeline(req: Request, res: Response) {
  try {
    const relPath = 'progetti/sviluppo bambino/metodologia/guida-pipeline.md';
    const { content, isEmpty } = readMarkdownFile(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Guida pipeline non trovata' });
    res.json({ title: 'Guida alla pipeline F2/F3', content });
  } catch {
    res.status(500).json({ error: 'Errore lettura guida pipeline' });
  }
}

// GET /api/sviluppo-bambino/produzioni/nuova-ricerca-info
// Testo esplicativo per la pagina di avvio di una nuova ricerca tematica F2.
export function getProduzioniNuovaRicercaInfo(req: Request, res: Response) {
  try {
    const relPath = 'progetti/sviluppo bambino/metodologia/nuova-ricerca-temi.md';
    const { content, isEmpty } = readMarkdownFile(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Testo nuova ricerca non trovato' });
    res.json({ title: 'Avviare una nuova ricerca', content });
  } catch {
    res.status(500).json({ error: 'Errore lettura testo nuova ricerca' });
  }
}

// GET /api/sviluppo-bambino/metodo/ricerca-scientifica/collocazione
export function getMetodoCollocazione(req: Request, res: Response) {
  try {
    const relPath = findMdByPrefix('progetti/sviluppo bambino/metodo/02 rapporto con ricerca scientifica', 'OM5 ');
    if (!relPath) return res.status(404).json({ error: 'File non trovato' });
    const { frontmatter, body, isEmpty } = readPage(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Collocazione non trovata' });
    res.json({ title: (frontmatter.title as string) ?? 'Collocazione', content: body, prev: null, next: 'statuto-epistemologico' });
  } catch {
    res.status(500).json({ error: 'Errore lettura collocazione' });
  }
}

// GET /api/sviluppo-bambino/metodo/ricerca-scientifica/statuto-epistemologico
export function getMetodoStatutoEpistemologico(req: Request, res: Response) {
  try {
    const relPath = findMdByPrefix('progetti/sviluppo bambino/metodo/02 rapporto con ricerca scientifica', 'OM5b');
    if (!relPath) return res.status(404).json({ error: 'File non trovato' });
    const { frontmatter, body, isEmpty } = readPage(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Statuto epistemologico non trovato' });
    res.json({ title: (frontmatter.title as string) ?? 'Statuto epistemologico', content: body, prev: 'collocazione', next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura statuto epistemologico' });
  }
}

// GET /api/sviluppo-bambino/metodo/fasi
// Le fasi 4, 5, 6 e 7 sono volutamente escluse dall'indice pubblico in attesa di implementazione completa;
// i file markdown corrispondenti restano nel repository e l'endpoint di dettaglio resta accessibile.
export function getFasiIndex(req: Request, res: Response) {
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

// GET /api/sviluppo-bambino/metodo/fasi/:faseSlug
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

// GET /api/sviluppo-bambino/metodo/rapporto-con-ia
export function getMetodoRapportoConIA(req: Request, res: Response) {
  try {
    const relPath = findMdByPrefix('progetti/sviluppo bambino/metodo/03 rapporto con ia', 'OM3');
    if (!relPath) return res.status(404).json({ error: 'File non trovato' });
    const { frontmatter, body, isEmpty } = readPage(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Rapporto con IA non trovato' });
    res.json({ title: (frontmatter.title as string) ?? 'Rapporto con l\'intelligenza artificiale', content: body, prev: null, next: null });
  } catch {
    res.status(500).json({ error: 'Errore lettura rapporto con IA' });
  }
}

// GET /api/sviluppo-bambino/concetti
export function getConcetti(req: Request, res: Response) {
  try {
    const concettiSection = getModelloH1('concetti strutturali');
    if (!concettiSection) return res.status(404).json({ error: 'Concetti non trovati' });
    const items = splitByH2(concettiSection.content).filter((s) => s.title && s.title !== '__preamble__');
    res.json({ title: 'Concetti strutturali del modello', concetti: items });
  } catch {
    res.status(500).json({ error: 'Errore lettura concetti' });
  }
}

// GET /api/sviluppo-bambino/nota-metodologica
export function getNotaMetodologica(req: Request, res: Response) {
  try {
    const section = getModelloH1('nota metodologico');
    if (!section) return res.status(404).json({ error: 'Nota metodologica non trovata' });
    res.json({ title: 'Nota metodologico-lessicale', content: section.content });
  } catch {
    res.status(500).json({ error: 'Errore lettura nota metodologica' });
  }
}

// GET /api/sviluppo-bambino/assi
export function getAssiIndex(req: Request, res: Response) {
  try {
    const folders = listSubdirectories(NORMALIZED_BASE);
    const assi = folders
      .filter((f) => ASSE_FOLDER_TO_SLUG[f])
      .map((folderName) => {
        const slug = ASSE_FOLDER_TO_SLUG[folderName];
        const chapters = readChaptersInDir(path.join(NORMALIZED_BASE, folderName));
        return {
          slug,
          folderName,
          title: folderName,
          chapterCount: chapters.length,
          chapters: chapters.map((c) => ({
            slug: c.frontmatter.slug,
            title: c.frontmatter.title,
            chapter: c.frontmatter.chapter,
            order: c.frontmatter.order,
          })),
        };
      });
    res.json({ assi });
  } catch {
    res.status(500).json({ error: 'Errore lettura assi' });
  }
}

// GET /api/sviluppo-bambino/assi/:asseSlug
export function getAsseChapters(req: Request, res: Response) {
  try {
    const { asseSlug } = req.params;
    const folderName = ASSE_SLUG_TO_FOLDER[asseSlug];
    if (!folderName) return res.status(404).json({ error: 'Asse non trovato' });
    const chapters = readChaptersInDir(path.join(NORMALIZED_BASE, folderName));
    res.json({
      asseSlug,
      title: folderName,
      chapters: chapters.map((c) => ({
        slug: c.frontmatter.slug,
        title: c.frontmatter.title,
        chapter: c.frontmatter.chapter,
        order: c.frontmatter.order,
        asse: c.frontmatter.asse,
        asse_number: c.frontmatter.asse_number,
        prev: c.frontmatter.prev,
        next: c.frontmatter.next,
      })),
    });
  } catch {
    res.status(500).json({ error: 'Errore lettura capitoli asse' });
  }
}

// GET /api/sviluppo-bambino/assi/:asseSlug/:chapterSlug
export function getChapter(req: Request, res: Response) {
  try {
    const { asseSlug, chapterSlug } = req.params;
    const folderName = ASSE_SLUG_TO_FOLDER[asseSlug];
    if (!folderName) return res.status(404).json({ error: 'Asse non trovato' });

    const chapters = readChaptersInDir(path.join(NORMALIZED_BASE, folderName));
    const chapter = chapters.find((c) => c.frontmatter.slug === chapterSlug);
    if (!chapter) return res.status(404).json({ error: 'Capitolo non trovato' });

    res.json({
      frontmatter: chapter.frontmatter,
      content: chapter.content,
      isEmpty: chapter.isEmpty,
    });
  } catch {
    res.status(500).json({ error: 'Errore lettura capitolo' });
  }
}

// GET /api/sviluppo-bambino/riflessioni
export function getRiflessioni(req: Request, res: Response) {
  try {
    // List all .md files except the 01 Modello (already used in other routes)
    const fullPath = path.join(getContentBase(), RIFLESSIONI_BASE);
    if (!fs.existsSync(fullPath)) return res.json({ items: [] });
    const files = fs.readdirSync(fullPath)
      .filter((f: string) => f.endsWith('.md') && !f.startsWith('01 '));
    const items = files.map((filename: string) => {
      const parsed = readMarkdownFile(path.join(RIFLESSIONI_BASE, filename));
      return {
        filename,
        title: parsed.frontmatter.title ?? filename.replace(/^\d+\s+/, '').replace('.md', ''),
        isEmpty: parsed.isEmpty,
        slug: filename.toLowerCase().replace(/^\d+\s+/, '').replace('.md', '').replace(/\s+/g, '-'),
      };
    });
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'Errore lettura riflessioni' });
  }
}

// ── Interlocuzioni ────────────────────────────────────────────────────────────

const DISCIPLINE_META: Array<{
  slug: string;
  sessione: 'A' | 'B' | 'C';
  disciplina: string;
  filename: string;
  assi: number[];
}> = [
  // Sessione A — bio-relazionale
  { slug: 'infant-research',             sessione: 'A', disciplina: 'Infant Research',                       filename: 'infant-research.md',             assi: [1, 2, 4, 5] },
  { slug: 'neuroscienze-dello-sviluppo', sessione: 'A', disciplina: 'Neuroscienze dello Sviluppo',           filename: 'neuroscienze-dello-sviluppo.md',  assi: [1, 2, 4, 6] },
  { slug: 'sistemi-dinamici',            sessione: 'A', disciplina: 'Teoria dei Sistemi Dinamici',           filename: 'sistemi-dinamici.md',             assi: [1, 3, 4, 5] },
  { slug: 'teoria-dellattaccamento',     sessione: 'A', disciplina: "Teoria dell'Attaccamento",              filename: 'teoria-dellattaccamento.md',      assi: [1, 2, 4, 5] },
  // Sessione B — clinico-contestuale
  { slug: 'psicopatologia-dello-sviluppo', sessione: 'B', disciplina: 'Psicopatologia dello Sviluppo',      filename: 'psicopatologia-dello-sviluppo.md', assi: [1, 2, 4, 6] },
  { slug: 'ecologia-dello-sviluppo',     sessione: 'B', disciplina: 'Ecologia dello Sviluppo',              filename: 'ecologia-dello-sviluppo.md',      assi: [1, 3, 5, 6] },
  { slug: 'pediatria-per-lo-sviluppo',   sessione: 'B', disciplina: 'Pediatria per lo Sviluppo',            filename: 'pediatria-per-lo-sviluppo.md',    assi: [1, 3, 4, 6] },
  { slug: 'psicologia-di-comunita',      sessione: 'B', disciplina: 'Psicologia di Comunità',               filename: 'psicologia-di-comunita.md',       assi: [3, 5, 6] },
  // Sessione C — metodologico-integrativa
  { slug: 'epistemologia-della-complessita', sessione: 'C', disciplina: 'Epistemologia della Complessità',  filename: 'epistemologia-della-complessita.md', assi: [1, 3, 4, 6] },
  { slug: 'sistemi-motivazionali',       sessione: 'C', disciplina: 'Sistemi Motivazionali',                filename: 'sistemi-motivazionali.md',        assi: [1, 2, 5] },
  { slug: 'free-energy-principle',       sessione: 'C', disciplina: 'Free Energy Principle',                filename: 'free-energy-principle.md',        assi: [1, 4, 6] },
];

const SESSION_LABELS: Record<string, string> = {
  A: 'Bio-relazionale',
  B: 'Clinico-contestuale',
  C: 'Metodologico-integrativa',
};

// GET /api/sviluppo-bambino/interlocuzioni
export function getInterlocuzioni(req: Request, res: Response) {
  try {
    const sessions = (['A', 'B', 'C'] as const).map((id) => ({
      id,
      label: SESSION_LABELS[id],
      discipline: DISCIPLINE_META
        .filter((d) => d.sessione === id)
        .map(({ slug, disciplina, assi }) => ({ slug, disciplina, assi })),
    }));
    res.json({ sessioni: sessions });
  } catch {
    res.status(500).json({ error: 'Errore lettura interlocuzioni' });
  }
}

// GET /api/sviluppo-bambino/interlocuzioni/:disciplinaSlug
export function getInterlocuzioneDisciplina(req: Request, res: Response) {
  try {
    const { disciplinaSlug } = req.params;
    const idx = DISCIPLINE_META.findIndex((d) => d.slug === disciplinaSlug);
    if (idx === -1) return res.status(404).json({ error: 'Disciplina non trovata' });
    const meta = DISCIPLINE_META[idx];
    const relPath = path.join(INTERLOCUZIONI_BASE, meta.filename);
    const { content, isEmpty } = readMarkdownFile(relPath);
    if (isEmpty) return res.status(404).json({ error: 'Contenuto non trovato' });
    const body = content.replace(/^\s*#[^#][^\n]*\n?/, '');
    res.json({
      slug: meta.slug,
      disciplina: meta.disciplina,
      sessione: meta.sessione,
      assi: meta.assi,
      content: body,
      prev: idx > 0 ? DISCIPLINE_META[idx - 1].slug : null,
      next: idx < DISCIPLINE_META.length - 1 ? DISCIPLINE_META[idx + 1].slug : null,
      prevLabel: idx > 0 ? DISCIPLINE_META[idx - 1].disciplina : null,
      nextLabel: idx < DISCIPLINE_META.length - 1 ? DISCIPLINE_META[idx + 1].disciplina : null,
    });
  } catch {
    res.status(500).json({ error: 'Errore lettura disciplina' });
  }
}

function listSubdirMdFiles(relativePath: string): string[] {
  const fullPath = path.join(getContentBase(), relativePath);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath).filter((f: string) => f.endsWith('.md'));
}

// Helper: derive slug suffix from asse title
function slugifyAsseName(title: string, num: number): string {
  const clean = title
    .replace(/^\d+[\\.]\s*/, '')
    .toLowerCase()
    .replace(/[àáâä]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  // Use predefined slugs if available
  const knownSlugs: Record<number, string> = {
    1: 'ontologico-fenomenologico',
    2: 'affettivo-morale',
    3: 'normativo-educativo',
    4: 'separazione-e-limite',
    5: 'desiderio',
    6: 'storico-culturale',
  };
  return knownSlugs[num] ?? clean;
}
