/**
 * Fase 2 — Convertitore markdown → JSON ibrido per i capitoli degli assi strutturali.
 *
 * Per ogni .md sotto:
 *   server/content/progetti/sviluppo bambino/assi strutturali/normalized/
 *
 * Produce un ChapterDocument:
 *   {
 *     frontmatter: { ... }
 *     body: markdown con token {{ref:rN}} al posto di [^N]<img>...<img>
 *     references: [{ id "rN", footnoteId "fn-N", authorIds, bookIds }]
 *     footnotes:  [{ id "fn-N", num "N", text }]
 *     _meta: { generatedAt, sourceFile }
 *   }
 *
 * Output:
 *   server/content/progetti/sviluppo bambino/assi strutturali/json/<asse>/<capitolo>.json
 *
 * Validazione: ogni authorId/bookId è risolto contro il catalogo
 *   (authors.json + books.json). I disallineamenti bloccano la scrittura
 *   a meno che non si passi --force.
 *
 * Uso:
 *   npm run assi:convert                  # dry-run
 *   npm run assi:convert -- --write       # scrive su disco
 *   npm run assi:convert -- --asse asse-5-desiderio  # solo un asse
 *   npm run assi:convert -- --verbose     # report per capitolo
 *   npm run assi:convert -- --write --force  # scrive ignorando errori di validazione
 */

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type {
  ChapterDocument,
  ChapterFrontmatter,
  Reference,
  Footnote,
  AuthorsFile,
  BooksFile,
} from '../shared/types/assi';

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const NORMALIZED_DIR = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'assi strutturali',
  'normalized',
);
const JSON_OUT_DIR = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'assi strutturali',
  'json',
);
const CATALOGO_DIR = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'catalogo',
);
const AUTHORS_PATH = path.join(CATALOGO_DIR, 'authors.json');
const BOOKS_PATH = path.join(CATALOGO_DIR, 'books.json');
const REPORT_OUT = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'assi strutturali',
  '_conversion-report.json',
);

// ── argomenti CLI ────────────────────────────────────────────────────────────

interface CliArgs {
  write: boolean;
  force: boolean;
  asse?: string;
  verbose: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { write: false, force: false, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--write') args.write = true;
    else if (a === '--force') args.force = true;
    else if (a === '--verbose') args.verbose = true;
    else if (a === '--asse') args.asse = argv[++i];
    else if (a.startsWith('--asse=')) args.asse = a.slice('--asse='.length);
  }
  return args;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function listMarkdownFiles(rootDir: string): { file: string; asseDir: string }[] {
  const out: { file: string; asseDir: string }[] = [];
  if (!fs.existsSync(rootDir)) return out;
  const asseDirs = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const asseDir of asseDirs) {
    const full = path.join(rootDir, asseDir);
    const files = fs
      .readdirSync(full)
      .filter((f) => f.toLowerCase().endsWith('.md'))
      .map((f) => path.join(full, f));
    for (const f of files) out.push({ file: f, asseDir });
  }
  return out;
}

interface CatalogIndex {
  authorIds: Set<string>;
  bookIds: Set<string>;
}

function loadCatalogIndex(): CatalogIndex {
  if (!fs.existsSync(AUTHORS_PATH)) {
    throw new Error(`Catalogo autori mancante: ${AUTHORS_PATH}. Lancia prima 'npm run catalogo:build'.`);
  }
  if (!fs.existsSync(BOOKS_PATH)) {
    throw new Error(`Catalogo libri mancante: ${BOOKS_PATH}. Lancia prima 'npm run catalogo:build'.`);
  }
  const authors = JSON.parse(fs.readFileSync(AUTHORS_PATH, 'utf8')) as AuthorsFile;
  const books = JSON.parse(fs.readFileSync(BOOKS_PATH, 'utf8')) as BooksFile;
  return {
    authorIds: new Set(authors.authors.map((a) => a.id)),
    bookIds: new Set(books.books.map((b) => b.id)),
  };
}

function parseImgAttrs(tag: string): { src?: string; cls?: string } {
  const get = (name: string) => {
    const re = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i');
    const m = tag.match(re);
    return m ? m[1] : undefined;
  };
  return { src: get('src'), cls: get('class') };
}

function idFromSrc(src: string): string {
  const base = src.split('/').pop() ?? src;
  const ext = path.extname(base);
  return ext ? base.slice(0, -ext.length) : base;
}

// ── parsing & conversione ────────────────────────────────────────────────────

const FOOTNOTE_DEF_LINE_RE = /^\[\^(\d+)\]:[ \t]?/gm;
const IMG_TAG_RE = /<img\b[^>]*>/gi;

/**
 * Trova le definizioni footnote (`[^N]: text`) nel body. Le definizioni iniziano
 * a inizio riga e si estendono fino alla def successiva o EOF. Ritorna anche
 * l'offset della prima def, da usare per troncare il body.
 */
function extractFootnotes(body: string): {
  footnotes: Footnote[];
  defStartOffset: number;
} {
  const matches: Array<{ num: string; start: number; afterColon: number }> = [];
  let m: RegExpExecArray | null;
  FOOTNOTE_DEF_LINE_RE.lastIndex = 0;
  while ((m = FOOTNOTE_DEF_LINE_RE.exec(body)) !== null) {
    matches.push({ num: m[1], start: m.index, afterColon: m.index + m[0].length });
  }

  const footnotes: Footnote[] = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const end = next ? next.start : body.length;
    const text = body.slice(cur.afterColon, end).trim();
    footnotes.push({
      id: `fn-${cur.num}`,
      num: cur.num,
      text,
    });
  }

  return {
    footnotes,
    defStartOffset: matches.length > 0 ? matches[0].start : -1,
  };
}

interface ConvertResult {
  doc: ChapterDocument;
  /** statistiche per il report */
  stats: {
    markersReplaced: number;
    footnotes: number;
    references: number;
    refsWithImgs: number;
    refsWithoutImgs: number;
    portraits: number;
    covers: number;
  };
  /** problemi (warning + error) per capitolo */
  issues: ConversionIssue[];
}

interface ConversionIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  context?: string;
}

/**
 * Cattura il marker `[^N]` ed eventuali `<img>` consecutivi separati da spazi/tab
 * (non newline: una nuova linea è già un confine semantico). Match anche i casi
 * "marker da solo" (zero img → reference vuoto, è la footnote pura).
 */
const REF_SPAN_RE = /\[\^(\d+)\]((?:[ \t]+<img\b[^>]*>)*)/g;

function convertChapter(
  file: string,
  asseDir: string,
  catalog: CatalogIndex,
): ConvertResult {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const fm = parsed.data as Record<string, unknown>;
  const body = parsed.content;

  const issues: ConversionIssue[] = [];

  // 1. estrai footnote definitions e tronca il body
  const { footnotes, defStartOffset } = extractFootnotes(body);
  const textBody = defStartOffset >= 0 ? body.slice(0, defStartOffset) : body;

  // 2. rimuovi H1 iniziale (titolo del capitolo, ridondante con frontmatter.title)
  let cleanBody = textBody.replace(/^\s*#\s+[^\n]+\n+/, '');

  // 3. sostituisci marker + img consecutivi con {{ref:rN}}
  const references: Reference[] = [];
  let refCounter = 0;
  let portraitsCount = 0;
  let coversCount = 0;

  cleanBody = cleanBody.replace(REF_SPAN_RE, (_match, numRaw: string, imgsStr: string) => {
    refCounter++;
    const refId = `r${refCounter}`;
    const num = numRaw;
    const footnoteId = `fn-${num}`;

    const authorIds: string[] = [];
    const bookIds: string[] = [];

    if (imgsStr) {
      let imgMatch: RegExpExecArray | null;
      const localImgRe = new RegExp(IMG_TAG_RE.source, 'gi');
      while ((imgMatch = localImgRe.exec(imgsStr)) !== null) {
        const attrs = parseImgAttrs(imgMatch[0]);
        const src = attrs.src ?? '';
        const id = idFromSrc(src);
        const cls = attrs.cls ?? '';
        if (/\bref-portrait\b/.test(cls)) {
          if (!catalog.authorIds.has(id)) {
            issues.push({
              severity: 'error',
              code: 'unknown-author',
              message: `Author id "${id}" non presente in authors.json (ref ${refId})`,
            });
          }
          if (!authorIds.includes(id)) authorIds.push(id);
          portraitsCount++;
        } else if (/\bref-cover\b/.test(cls)) {
          if (!catalog.bookIds.has(id)) {
            issues.push({
              severity: 'error',
              code: 'unknown-book',
              message: `Book id "${id}" non presente in books.json (ref ${refId})`,
            });
          }
          if (!bookIds.includes(id)) bookIds.push(id);
          coversCount++;
        } else {
          issues.push({
            severity: 'warning',
            code: 'img-unknown-class',
            message: `<img> senza class ref-portrait/ref-cover (ref ${refId}, src=${src})`,
          });
        }
      }
    }

    references.push({ id: refId, footnoteId, authorIds, bookIds });
    return `{{ref:${refId}}}`;
  });

  // 4. validazioni post-conversione
  const footnoteIds = new Set(footnotes.map((f) => f.id));
  for (const ref of references) {
    if (!footnoteIds.has(ref.footnoteId)) {
      issues.push({
        severity: 'error',
        code: 'missing-footnote-def',
        message: `Reference ${ref.id} punta a ${ref.footnoteId} ma la footnote non esiste`,
      });
    }
  }
  const usedFootnotes = new Set(references.map((r) => r.footnoteId));
  for (const f of footnotes) {
    if (!usedFootnotes.has(f.id)) {
      issues.push({
        severity: 'warning',
        code: 'orphan-footnote',
        message: `Footnote ${f.id} definita ma mai referenziata`,
      });
    }
  }

  // 5. controllo che il body convertito non contenga residui sospetti
  if (/\[\^\d+\]/.test(cleanBody)) {
    issues.push({
      severity: 'error',
      code: 'leftover-marker',
      message: `Body contiene ancora marker [^N] dopo la conversione`,
    });
  }
  if (/<img\b/i.test(cleanBody)) {
    issues.push({
      severity: 'warning',
      code: 'leftover-img',
      message: `Body contiene ancora <img> dopo la conversione (img non legate a un marker?)`,
    });
  }

  // 6. costruzione frontmatter tipato (con difese minime)
  const fmTyped: ChapterFrontmatter = {
    title: String(fm.title ?? ''),
    asse: String(fm.asse ?? asseDir),
    asse_number: typeof fm.asse_number === 'number' ? fm.asse_number : 0,
    asse_slug: String(fm.asse_slug ?? ''),
    chapter: typeof fm.chapter === 'number' ? fm.chapter : 0,
    order: typeof fm.order === 'number' ? fm.order : 0,
    slug: String(fm.slug ?? ''),
    prev: fm.prev == null ? null : String(fm.prev),
    next: fm.next == null ? null : String(fm.next),
  };

  const doc: ChapterDocument = {
    frontmatter: fmTyped,
    body: cleanBody.trim() + '\n',
    references,
    footnotes,
    _meta: {
      generatedAt: new Date().toISOString(),
      sourceFile: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
    },
  };

  const refsWithImgs = references.filter((r) => r.authorIds.length + r.bookIds.length > 0).length;
  return {
    doc,
    stats: {
      markersReplaced: refCounter,
      footnotes: footnotes.length,
      references: references.length,
      refsWithImgs,
      refsWithoutImgs: references.length - refsWithImgs,
      portraits: portraitsCount,
      covers: coversCount,
    },
    issues,
  };
}

// ── output path ──────────────────────────────────────────────────────────────

function jsonOutPathFor(file: string): string {
  // mantiene la struttura: <NORMALIZED_DIR>/<AsseDir>/<Capitolo>.md
  // diventa:                <JSON_OUT_DIR>/<AsseDir>/<Capitolo>.json
  const rel = path.relative(NORMALIZED_DIR, file);
  const withoutExt = rel.replace(/\.md$/i, '.json');
  return path.join(JSON_OUT_DIR, withoutExt);
}

// ── main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log('=== Convertitore assi strutturali (md → json) ===');
  console.log(`  modo            : ${args.write ? 'WRITE' : 'dry-run'}${args.force ? ' (force)' : ''}`);
  if (args.asse) console.log(`  filtro asse     : ${args.asse}`);
  console.log();

  // catalogo
  let catalog: CatalogIndex;
  try {
    catalog = loadCatalogIndex();
  } catch (e) {
    console.error(`!! ${(e as Error).message}`);
    process.exit(1);
  }
  console.log(`  Catalogo autori : ${catalog.authorIds.size}`);
  console.log(`  Catalogo libri  : ${catalog.bookIds.size}`);
  console.log();

  // file da convertire — il filtro --asse viene applicato dopo aver letto
  // il frontmatter di ciascun file (44 file, parsing veloce).
  const allFiles = listMarkdownFiles(NORMALIZED_DIR);
  const files = allFiles;

  console.log(`  Capitoli totali: ${files.length}${args.asse ? ` (filtro asse "${args.asse}" applicato dopo lettura frontmatter)` : ''}`);
  console.log();

  // conversione
  type Row = {
    sourceFile: string;
    outFile: string;
    stats: ConvertResult['stats'];
    issues: ConversionIssue[];
    skippedByAsseFilter?: boolean;
  };
  const rows: Row[] = [];

  for (const { file, asseDir } of files) {
    let result: ConvertResult;
    try {
      result = convertChapter(file, asseDir, catalog);
    } catch (e) {
      console.error(`!! errore convertendo ${file}: ${(e as Error).message}`);
      rows.push({
        sourceFile: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
        outFile: '',
        stats: {
          markersReplaced: 0,
          footnotes: 0,
          references: 0,
          refsWithImgs: 0,
          refsWithoutImgs: 0,
          portraits: 0,
          covers: 0,
        },
        issues: [{ severity: 'error', code: 'parse-failed', message: (e as Error).message }],
      });
      continue;
    }

    // --asse filter strict, dopo lettura del frontmatter
    if (args.asse && result.doc.frontmatter.asse_slug !== args.asse) {
      rows.push({
        sourceFile: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
        outFile: '',
        stats: result.stats,
        issues: [],
        skippedByAsseFilter: true,
      });
      continue;
    }

    const outFile = jsonOutPathFor(file);
    rows.push({
      sourceFile: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
      outFile: path.relative(REPO_ROOT, outFile).replace(/\\/g, '/'),
      stats: result.stats,
      issues: result.issues,
    });

    if (args.verbose) {
      const errs = result.issues.filter((i) => i.severity === 'error').length;
      const warns = result.issues.filter((i) => i.severity === 'warning').length;
      console.log(
        `  [${errs ? 'E' : warns ? 'W' : 'OK'}] ${result.doc.frontmatter.asse_slug}/${result.doc.frontmatter.slug}` +
          `  refs=${result.stats.references} (img=${result.stats.refsWithImgs}, pure=${result.stats.refsWithoutImgs})` +
          `  fn=${result.stats.footnotes}` +
          (errs ? `  errors=${errs}` : '') +
          (warns ? `  warns=${warns}` : ''),
      );
    }
  }

  // ── aggregazione errori/warning ──
  const totalErrors = rows.reduce((s, r) => s + r.issues.filter((i) => i.severity === 'error').length, 0);
  const totalWarnings = rows.reduce((s, r) => s + r.issues.filter((i) => i.severity === 'warning').length, 0);
  const chaptersWithErrors = rows.filter((r) => r.issues.some((i) => i.severity === 'error'));

  // ── stampa anomalie ──
  if (totalErrors || totalWarnings) {
    console.log();
    console.log('--- Anomalie ---');
    for (const r of rows) {
      if (r.issues.length === 0) continue;
      console.log(`  ${r.sourceFile}`);
      for (const iss of r.issues) {
        const tag = iss.severity === 'error' ? 'E' : 'W';
        console.log(`     [${tag}][${iss.code}] ${iss.message}`);
      }
    }
  }

  // ── totali ──
  const filteredRows = rows.filter((r) => !r.skippedByAsseFilter);
  const totals = filteredRows.reduce(
    (acc, r) => {
      acc.markers += r.stats.markersReplaced;
      acc.refs += r.stats.references;
      acc.refsWithImgs += r.stats.refsWithImgs;
      acc.refsWithoutImgs += r.stats.refsWithoutImgs;
      acc.footnotes += r.stats.footnotes;
      acc.portraits += r.stats.portraits;
      acc.covers += r.stats.covers;
      return acc;
    },
    { markers: 0, refs: 0, refsWithImgs: 0, refsWithoutImgs: 0, footnotes: 0, portraits: 0, covers: 0 },
  );

  console.log();
  console.log('--- Totali ---');
  console.log(`  Capitoli processati  : ${filteredRows.length}`);
  console.log(`  Marker [^N] sostituiti: ${totals.markers}`);
  console.log(`  References generate  : ${totals.refs}`);
  console.log(`     con img            : ${totals.refsWithImgs}`);
  console.log(`     senza img (footn.) : ${totals.refsWithoutImgs}`);
  console.log(`  Footnotes liftate    : ${totals.footnotes}`);
  console.log(`  <img> portrait letti : ${totals.portraits}`);
  console.log(`  <img> cover    letti : ${totals.covers}`);
  console.log();
  console.log(`  Errori   : ${totalErrors}`);
  console.log(`  Warning  : ${totalWarnings}`);

  // ── decisione scrittura ──
  const shouldWrite = args.write && (totalErrors === 0 || args.force);
  if (args.write && totalErrors > 0 && !args.force) {
    console.log();
    console.log(`!! Scrittura abortita: ${totalErrors} errori in ${chaptersWithErrors.length} capitoli.`);
    console.log(`   Risolvi le anomalie o passa --force per ignorarle.`);
  }

  if (shouldWrite) {
    console.log();
    console.log('--- Scrittura JSON ---');
    let written = 0;
    for (const r of filteredRows) {
      if (!r.outFile) continue;
      const outAbs = path.join(REPO_ROOT, r.outFile);
      const outDir = path.dirname(outAbs);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      // ricarico la doc effettiva: ho perso il riferimento; ricreo dalla rilettura.
      // più efficiente: tenere il doc nel row. Lo riconverto.
      const sourceAbs = path.join(REPO_ROOT, r.sourceFile);
      const asseDir = path.basename(path.dirname(sourceAbs));
      const conv = convertChapter(sourceAbs, asseDir, catalog);
      fs.writeFileSync(outAbs, JSON.stringify(conv.doc, null, 2) + '\n', 'utf8');
      written++;
    }
    console.log(`  Scritti ${written} file in ${path.relative(REPO_ROOT, JSON_OUT_DIR)}/`);
  }

  // ── report ──
  const reportPath = REPORT_OUT;
  const report = {
    generatedAt: new Date().toISOString(),
    mode: args.write ? (totalErrors > 0 && !args.force ? 'aborted' : 'written') : 'dry-run',
    args,
    totals,
    counts: {
      chapters: filteredRows.length,
      errors: totalErrors,
      warnings: totalWarnings,
    },
    rows: filteredRows.map((r) => ({
      source: r.sourceFile,
      out: r.outFile,
      stats: r.stats,
      issues: r.issues,
    })),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log();
  console.log(`Report dettagliato: ${path.relative(REPO_ROOT, reportPath)}`);
}

main();
