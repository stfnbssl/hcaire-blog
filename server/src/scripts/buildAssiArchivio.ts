/**
 * Genera l'archivio di collegamento per gli assi strutturali.
 *
 * Scopo: fornire a Claude Cowork (che lavora in locale ai documenti di
 * approfondimento) un singolo JSON con identificatori canonici e URL
 * pubbliche per linkare ai 6 assi, ai 44 capitoli e alle sezioni h2
 * di ciascun capitolo già pubblicate su hcaire.com.
 *
 * Sorgenti:
 *   - server/content/progetti/sviluppo bambino/assi strutturali/precompiled/asse_*.json
 *       (asse-level: title, structural_function, internal_articulations[])
 *   - server/content/progetti/sviluppo bambino/assi strutturali/json/Asse */ /*
 *       (per-chapter: frontmatter, body markdown, references)
 *
 * Output:
 *   server/content/progetti/sviluppo bambino/assi strutturali/archivio-collegamenti.json
 *
 * Lo slug delle sezioni è generato con `github-slugger`, lo stesso algoritmo
 * usato da `rehype-slug` nel renderer client — così gli `#anchor` qui presenti
 * combaciano con gli id HTML resi dal browser.
 *
 * Uso: npm run assi:archivio  (oppure ts-node server/src/scripts/buildAssiArchivio.ts)
 */

import '../loadEnv';
import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import GithubSlugger from 'github-slugger';
import AssiChapter from '../models/AssiChapter';

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

const ASSI_BASE = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'assi strutturali',
);
const PRECOMPILED_DIR = path.join(ASSI_BASE, 'precompiled');
const JSON_DIR = path.join(ASSI_BASE, 'json');
const OUT_FILE = path.join(ASSI_BASE, 'archivio-collegamenti.json');

const BASE_URL = 'https://hcaire.com';
const ROUTE_PREFIX = '/assi-strutturali';

// ── tipi locali ──────────────────────────────────────────────────────────────

interface PrecompiledAsse {
  axis_id: string;
  axis_name: string;
  structural_function?: string;
  internal_articulations?: { section: string; function: string }[];
}

interface SectionEntry {
  anchor: string;
  title: string;
  url: string;
}

interface ChapterEntry {
  id: string; // asse_slug/chapter_slug
  asse_id: string;
  asse_number: number;
  number: number;
  title: string;
  slug: string;
  url: string;
  summary: string | null;
  prev_slug: string | null;
  next_slug: string | null;
  sections: SectionEntry[];
  cited_author_ids: string[];
  cited_book_ids: string[];
}

interface AsseEntry {
  id: string;
  number: number;
  title: string;
  url: string;
  structural_function: string | null;
  chapter_ids: string[];
}

interface ArchivioFile {
  _meta: {
    generatedAt: string;
    version: string;
    baseUrl: string;
    purpose: string;
    totalAssi: number;
    totalChapters: number;
    totalSections: number;
  };
  assi: AsseEntry[];
  chapters: ChapterEntry[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function listSubdirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .sort();
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

/** Estrae le righe `## ...` dal markdown body. Solo h2 (i `### ` sono ignorati). */
function extractH2Headings(body: string): string[] {
  const out: string[] = [];
  for (const rawLine of body.split('\n')) {
    const m = rawLine.match(/^##\s+(.+?)\s*$/);
    if (m) out.push(m[1].trim());
  }
  return out;
}

/** Estrae il numero del capitolo da stringhe tipo "Capitolo 2 – L'altro..." */
function extractChapterNumber(label: string): number | null {
  const m = label.match(/Capitolo\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function uniqueSorted(values: (string | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort();
}

// ── pipeline principale ──────────────────────────────────────────────────────

async function build(): Promise<ArchivioFile> {
  // 1. Carica i precompiled per ricavare titolo asse + summary capitoli (file)
  const precompiledByNumber = new Map<number, PrecompiledAsse>();
  for (const f of listJsonFiles(PRECOMPILED_DIR)) {
    const m = f.match(/^asse_(\d+)\.json$/i);
    if (!m) continue;
    const n = parseInt(m[1], 10);
    precompiledByNumber.set(n, readJson<PrecompiledAsse>(path.join(PRECOMPILED_DIR, f)));
  }

  // 2. Carica i 44 capitoli da MongoDB (assi_chapters) — Fase A 2026-05-11.
  const allChapters = await AssiChapter
    .find({}, { axis_slug: 1, axis_folder: 1, axis_number: 1, slug: 1, title: 1, chapter_number: 1, body: 1, references: 1, prev_slug: 1, next_slug: 1 })
    .sort({ axis_number: 1, order: 1 })
    .lean();

  // Raggruppo per axis_slug.
  const byAxis = new Map<string, typeof allChapters>();
  for (const c of allChapters) {
    const arr = byAxis.get(c.axis_slug) ?? [];
    arr.push(c);
    byAxis.set(c.axis_slug, arr);
  }

  const assi: AsseEntry[] = [];
  const chapters: ChapterEntry[] = [];

  for (const [asseId, chaptersOfAxis] of byAxis.entries()) {
    if (chaptersOfAxis.length === 0) continue;

    const first = chaptersOfAxis[0];
    const asseNumber = first.axis_number;
    const precompiled = precompiledByNumber.get(asseNumber);

    const summaryByChapter = new Map<number, string>();
    if (precompiled?.internal_articulations) {
      for (const art of precompiled.internal_articulations) {
        const n = extractChapterNumber(art.section);
        if (n !== null) summaryByChapter.set(n, art.function);
      }
    }

    const asseTitle = precompiled?.axis_name ?? first.axis_folder;
    const asseUrl = `${ROUTE_PREFIX}/${asseId}`;
    const chapterIdsForAsse: string[] = [];

    for (const c of chaptersOfAxis) {
      const chapterUrl = `${ROUTE_PREFIX}/${asseId}/${c.slug}`;
      const chapterId = `${asseId}/${c.slug}`;

      const slugger = new GithubSlugger();
      const headings = extractH2Headings(c.body);
      const sections: SectionEntry[] = headings.map((title) => {
        const anchor = slugger.slug(title);
        return { anchor, title, url: `${chapterUrl}#${anchor}` };
      });

      const refs = c.references ?? [];
      const citedAuthorIds = uniqueSorted(refs.flatMap((r) => r.authorIds ?? []));
      const citedBookIds = uniqueSorted(refs.flatMap((r) => r.bookIds ?? []));

      chapters.push({
        id: chapterId,
        asse_id: asseId,
        asse_number: asseNumber,
        number: c.chapter_number,
        title: c.title,
        slug: c.slug,
        url: chapterUrl,
        summary: summaryByChapter.get(c.chapter_number) ?? null,
        prev_slug: c.prev_slug ?? null,
        next_slug: c.next_slug ?? null,
        sections,
        cited_author_ids: citedAuthorIds,
        cited_book_ids: citedBookIds,
      });
      chapterIdsForAsse.push(chapterId);
    }

    assi.push({
      id: asseId,
      number: asseNumber,
      title: asseTitle,
      url: asseUrl,
      structural_function: precompiled?.structural_function ?? null,
      chapter_ids: chapterIdsForAsse,
    });
  }

  // ordinamento deterministico
  assi.sort((a, b) => a.number - b.number);
  chapters.sort((a, b) => a.asse_number - b.asse_number || a.number - b.number);

  const totalSections = chapters.reduce((s, c) => s + c.sections.length, 0);

  return {
    _meta: {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      baseUrl: BASE_URL,
      purpose:
        "Archivio di collegamento per gli assi strutturali. Fornisce identificatori canonici e URL pubbliche per linkare a assi, capitoli e sezioni h2 dei capitoli pubblicati su hcaire.com. Da usare come riferimento autoritativo per costruire link nei documenti di approfondimento — non costruire URL a mano.",
      totalAssi: assi.length,
      totalChapters: chapters.length,
      totalSections,
    },
    assi,
    chapters,
  };
}

// ── entry point ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL?.replace('{password}', password ?? '').replace('/?', '/hcaire_db?');
  if (!url) throw new Error('MONGODB_URL non configurata (servono server/.env)');
  await mongoose.connect(url);
  try {
    const archivio = await build();
    fs.writeFileSync(OUT_FILE, JSON.stringify(archivio, null, 2) + '\n', 'utf8');
    const rel = path.relative(REPO_ROOT, OUT_FILE);
    console.log(
      `[assi:archivio] scritto ${rel}\n` +
        `  assi: ${archivio._meta.totalAssi}, capitoli: ${archivio._meta.totalChapters}, sezioni h2: ${archivio._meta.totalSections}`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => { console.error('[assi:archivio] ERROR:', err); process.exit(1); });
