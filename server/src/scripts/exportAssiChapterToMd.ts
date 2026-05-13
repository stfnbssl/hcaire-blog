/**
 * Export Mongo → Markdown per i capitoli degli assi strutturali (dual-write).
 *
 * Per un IAssiChapter (Mongo) ricostruisce:
 *   - frontmatter YAML
 *   - body markdown con `[^N]<img class="ref-portrait|ref-cover">` re-iniettati
 *     al posto dei token `{{ref:rN}}`
 *   - sezione footnote in fondo
 *
 * Scrive nel file `normalized/<axis_folder>/<source_filename>` (o un nome
 * derivato dal titolo se source_filename è null). I .md restano backup git.
 *
 * Uso programmatico:
 *   await exportChapterToMd(chapter);
 *
 * CLI:
 *   ts-node src/scripts/exportAssiChapterToMd.ts            # tutti i capitoli
 *   ts-node src/scripts/exportAssiChapterToMd.ts --slug X   # singolo
 */

import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import AssiChapter, { IAssiChapter, IReference } from '../models/AssiChapter';
import Author from '../models/Author';
import Book from '../models/Book';

// Carico dotenv solo se invocato come CLI (non per import).
if (require.main === module) {
  require('../loadEnv');
}

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const NORMALIZED_BASE = path.join(
  REPO_ROOT, 'server', 'content', 'progetti', 'sviluppo bambino',
  'assi strutturali', 'normalized',
);

// Stili standard per le img inline (presi dai capitoli originali).
const STYLE_PORTRAIT = 'height:104px;vertical-align:middle;border-radius:5%;margin:0 4px 0 2px;box-shadow:0 1px 3px rgba(0,0,0,.25)';
const STYLE_COVER    = 'height:208px;vertical-align:middle;margin:0 4px 0 2px;box-shadow:0 1px 4px rgba(0,0,0,.3)';

// ── catalogo (Mongo, cache module-level) ────────────────────────────────────
// Le immagini ora vivono su Cloudflare R2 e i metadati nelle collection
// `authors`/`books`. Il backup .md continua a usare URL R2 nei tag <img>.

interface CatalogEntry {
  label: string; // nome autore o titolo libro
  image: string; // URL R2 (o stringa vuota se mancante)
}

interface ExportCatalog {
  authors: Map<string, CatalogEntry>;
  books: Map<string, CatalogEntry>;
}

let catalogCache: ExportCatalog | null = null;

async function loadCatalog(): Promise<ExportCatalog> {
  if (catalogCache) return catalogCache;
  const [authorDocs, bookDocs] = await Promise.all([
    Author.find({}, { id: 1, nome: 1, image_url: 1 }).lean(),
    Book.find({}, { id: 1, titolo: 1, cover_url: 1 }).lean(),
  ]);
  catalogCache = {
    authors: new Map(authorDocs.map((a) => [a.id, { label: a.nome, image: a.image_url ?? '' }])),
    books: new Map(bookDocs.map((b) => [b.id, { label: b.titolo, image: b.cover_url ?? '' }])),
  };
  return catalogCache;
}

export function clearExportCatalogCache(): void {
  catalogCache = null;
}

// ── rendering reference → tag <img> ─────────────────────────────────────────

function renderRefAsImgs(ref: IReference, catalog: ExportCatalog): string {
  const parts: string[] = [];

  for (const authorId of ref.authorIds) {
    const a = catalog.authors.get(authorId);
    if (!a) {
      // Autore non in catalogo: fallback con id come placeholder src.
      parts.push(`<img src="" alt="${authorId}" title="${authorId} (mancante)" class="ref-portrait" style="${STYLE_PORTRAIT}">`);
    } else {
      parts.push(`<img src="${a.image}" alt="${a.label}" title="${a.label}" class="ref-portrait" style="${STYLE_PORTRAIT}">`);
    }
  }
  for (const bookId of ref.bookIds) {
    const b = catalog.books.get(bookId);
    if (!b) {
      parts.push(`<img src="" alt="${bookId}" title="${bookId} (mancante)" class="ref-cover" style="${STYLE_COVER}">`);
    } else {
      parts.push(`<img src="${b.image}" alt="${b.label}" title="${b.label}" class="ref-cover" style="${STYLE_COVER}">`);
    }
  }

  return parts.join(' ');
}

// ── frontmatter YAML ────────────────────────────────────────────────────────

function yamlString(v: string): string {
  // Quote doppie sempre, escape solo " e \.
  return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function buildFrontmatter(c: IAssiChapter): string {
  const lines = [
    '---',
    `title: ${yamlString(c.title)}`,
    `asse: ${yamlString(c.axis_folder)}`,
    `asse_number: ${c.axis_number}`,
    `asse_slug: ${yamlString(c.axis_slug)}`,
    `chapter: ${c.chapter_number}`,
    `order: ${c.order}`,
    `slug: ${yamlString(c.slug)}`,
    `prev: ${c.prev_slug ? yamlString(c.prev_slug) : 'null'}`,
    `next: ${c.next_slug ? yamlString(c.next_slug) : 'null'}`,
    '---',
    '',
  ];
  return lines.join('\n');
}

// ── body: token {{ref:rN}} → [^N]<img...> ───────────────────────────────────

function expandRefTokens(
  body: string,
  references: IReference[],
  catalog: ExportCatalog,
): string {
  const refMap = new Map(references.map((r) => [r.id, r]));
  return body.replace(/\{\{ref:(r\d+)\}\}/g, (_match, refId: string) => {
    const ref = refMap.get(refId);
    if (!ref) return ''; // ref orfana: rimuovo il token
    const num = ref.footnoteId.startsWith('fn-') ? ref.footnoteId.slice(3) : ref.footnoteId;
    const imgs = renderRefAsImgs(ref, catalog);
    return imgs.length > 0 ? `[^${num}] ${imgs}` : `[^${num}]`;
  });
}

// ── footnotes section in fondo ──────────────────────────────────────────────

function buildFootnoteSection(c: IAssiChapter): string {
  if (c.footnotes.length === 0) return '';
  const sorted = [...c.footnotes].sort((a, b) => parseInt(a.num, 10) - parseInt(b.num, 10));
  const parts = sorted.map((f) => `[^${f.num}]:  ${f.text}`);
  return '\n\n' + parts.join('\n\n') + '\n';
}

// ── markdown completo ───────────────────────────────────────────────────────

export function chapterToMarkdown(c: IAssiChapter, catalog: ExportCatalog): string {
  const fm = buildFrontmatter(c);
  const heading = `# Capitolo ${c.chapter_number} - ${c.title}\n\n`;
  const body = expandRefTokens(c.body, c.references, catalog);
  // Se il body già contiene un H1 iniziale, lo lasciamo e non aggiungiamo heading.
  // Altrimenti lo prependiamo per simmetria con l'originale.
  const hasH1 = /^\s*#\s+/.test(body);
  const fullBody = hasH1 ? body : heading + body;
  const footnotes = buildFootnoteSection(c);
  return fm + fullBody + footnotes;
}

// ── scrittura ───────────────────────────────────────────────────────────────

export function targetMdPath(c: IAssiChapter): string {
  const filename = c.source_filename
    || `Capitolo ${c.chapter_number} - ${c.title}.md`;
  return path.join(NORMALIZED_BASE, c.axis_folder, filename);
}

export async function exportChapterToMd(c: IAssiChapter): Promise<string> {
  const catalog = await loadCatalog();
  const md = chapterToMarkdown(c, catalog);
  const out = targetMdPath(c);
  await fs.promises.mkdir(path.dirname(out), { recursive: true });
  await fs.promises.writeFile(out, md, 'utf8');
  return out;
}

// ── CLI ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let slug: string | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug') slug = args[++i];
    else if (args[i].startsWith('--slug=')) slug = args[i].slice('--slug='.length);
  }

  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL?.replace('{password}', password ?? '').replace('/?', '/hcaire_db?');
  if (!url) throw new Error('MONGODB_URL non configurata');
  await mongoose.connect(url);
  console.log('[export] Mongo connesso');

  try {
    const query = slug ? { slug } : {};
    const chapters = await AssiChapter.find(query).sort({ axis_number: 1, order: 1 });
    if (chapters.length === 0) {
      console.log(`[export] Nessun capitolo trovato${slug ? ` per slug "${slug}"` : ''}.`);
      return;
    }
    for (const c of chapters) {
      const out = await exportChapterToMd(c);
      console.log(`  ✓ ${path.relative(REPO_ROOT, out)}`);
    }
    console.log(`[export] ${chapters.length} capitoli esportati`);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  main().catch((err) => { console.error('[export] ERROR:', err); process.exit(1); });
}
