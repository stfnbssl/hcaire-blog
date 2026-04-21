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
    res.json({
      title: 'Introduzione al progetto',
      pages: [
        { title: 'Architettura del progetto', slug: 'architettura', excerpt: 'I sette livelli progressivi dal fondamento ontologico alla stabilizzazione istituzionale.' },
        { title: 'Metodologia',               slug: 'metodologia',  excerpt: 'Il percorso strutturato e stratificato dalla fondazione concettuale agli strumenti operativi.' },
      ],
    });
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
    res.json({
      title: 'Rapporto con la ricerca scientifica',
      pages: [
        { title: 'Collocazione nell\'ecosistema della ricerca', slug: 'collocazione',           excerpt: 'Come il progetto si situa rispetto alla produzione di conoscenza empirica sullo sviluppo umano.' },
        { title: 'Statuto epistemologico',                      slug: 'statuto-epistemologico', excerpt: 'Il progetto come infrastruttura metodologica e concettuale a livello metateorico.' },
      ],
    });
  } catch {
    res.status(500).json({ error: 'Errore lettura ricerca scientifica' });
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

// GET /api/sviluppo-bambino/interlocuzioni
export function getInterlocuzioni(req: Request, res: Response) {
  try {
    const dirs = listSubdirectories(INTERLOCUZIONI_BASE);
    const ambiti = dirs.map((dirName) => {
      const filesInDir = listSubdirMdFiles(path.join(INTERLOCUZIONI_BASE, dirName));
      return {
        title: dirName,
        slug: dirName.toLowerCase().replace(/\s+/g, '-'),
        count: filesInDir.length,
      };
    });
    res.json({ ambiti });
  } catch {
    res.status(500).json({ error: 'Errore lettura interlocuzioni' });
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
