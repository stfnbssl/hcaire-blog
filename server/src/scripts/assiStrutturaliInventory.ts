/**
 * Fase 0 — Inventario read-only dei 44 capitoli degli assi strutturali.
 *
 * Per ogni .md sotto:
 *   server/content/progetti/sviluppo bambino/assi strutturali/normalized/
 * estrae frontmatter, conta marker [^N], definizioni footnote, <img class="ref-portrait|ref-cover">,
 * estrae gli id (filename senza estensione) e li incrocia con:
 *   - assets effettivi in client/public/assets/{autori,libri}/
 *   - catalogo rilevanza in client/public/data/sviluppo-bambino-rilevanza-giorno-1.json
 *
 * Output:
 *   - stdout: riepilogo umano
 *   - server/content/progetti/sviluppo bambino/assi strutturali/_inventory-report.json
 *
 * Uso: ts-node server/src/scripts/assiStrutturaliInventory.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

// ── path ─────────────────────────────────────────────────────────────────────

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
const ASSETS_AUTORI = path.join(REPO_ROOT, 'client', 'public', 'assets', 'autori');
const ASSETS_LIBRI = path.join(REPO_ROOT, 'client', 'public', 'assets', 'libri');
const RILEVANZA_JSON = path.join(
  REPO_ROOT,
  'client',
  'public',
  'data',
  'sviluppo-bambino-rilevanza-giorno-1.json',
);
const REPORT_OUT = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'assi strutturali',
  '_inventory-report.json',
);

// ── tipi ─────────────────────────────────────────────────────────────────────

type ImgKind = 'portrait' | 'cover' | 'unknown';

interface ImgRef {
  kind: ImgKind;
  id: string; // filename senza estensione
  ext: string;
  src: string;
  alt?: string;
  title?: string;
  /** offset di carattere nel body originale (per debugging) */
  offset: number;
  /** indice del marker [^N] cui appartiene, se appaiato */
  attachedTo: number | null;
}

interface FootnoteMarker {
  num: string; // "1", "2", "10", etc.
  offset: number;
  /** ref-id stabile univoco nel capitolo (rN dove N è progressivo nell'ordine di apparizione) */
  refId: string;
}

interface FootnoteDef {
  num: string;
  text: string;
}

interface ChapterReport {
  file: string;
  asseDir: string;
  fmAsseSlug?: string;
  fmChapter?: number;
  fmSlug?: string;
  fmTitle?: string;
  bodyChars: number;
  markers: FootnoteMarker[];
  defs: FootnoteDef[];
  imgs: ImgRef[];
  imgsByKind: { portrait: number; cover: number; unknown: number };
  /** marker numerato che non ha definizione corrispondente */
  markersWithoutDef: string[];
  /** definizione che non ha marker corrispondente */
  defsWithoutMarker: string[];
  /** marker numerato duplicato */
  duplicateMarkers: string[];
  /** img non agganciate a nessun marker (orfane) */
  orphanImgs: number;
  /** marker senza alcuna img (footnote pura, lecito) */
  markersWithoutImg: number;
  /** id immagine non trovati negli asset */
  missingAssets: string[];
  /** id immagine non trovati nel catalogo rilevanza */
  missingRilevanza: string[];
}

interface InventoryReport {
  generatedAt: string;
  chapters: ChapterReport[];
  totals: {
    chapters: number;
    bodyChars: number;
    markers: number;
    defs: number;
    imgs: number;
    portraits: number;
    covers: number;
    unknown: number;
    orphanImgs: number;
    markersWithoutImg: number;
  };
  catalog: {
    distinctAuthors: string[];
    distinctBooks: string[];
    /** frequenza di citazione (id → numero capitoli che lo citano) */
    authorChapterFrequency: Record<string, number>;
    bookChapterFrequency: Record<string, number>;
  };
  validation: {
    missingAssetsAuthors: string[];
    missingAssetsBooks: string[];
    missingRilevanzaAuthors: string[];
    missingRilevanzaBooks: string[];
    chaptersWithMarkerDefMismatch: string[];
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────

function listMarkdownFiles(rootDir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(rootDir)) return out;
  const asseDirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const asseDir of asseDirs) {
    const full = path.join(rootDir, asseDir);
    const files = fs.readdirSync(full).filter((f) => f.toLowerCase().endsWith('.md'));
    for (const f of files) out.push(path.join(full, f));
  }
  return out;
}

function listAssetIds(dir: string): Set<string> {
  const out = new Set<string>();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f);
    if (!ext) continue;
    out.add(path.basename(f, ext));
  }
  return out;
}

/** estrae attributi semplici da un tag <img ...>. Non un parser HTML serio: basta per src/alt/title/class. */
function parseImgAttrs(tag: string): { src?: string; alt?: string; title?: string; cls?: string } {
  const get = (name: string) => {
    const re = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i');
    const m = tag.match(re);
    return m ? m[1] : undefined;
  };
  return { src: get('src'), alt: get('alt'), title: get('title'), cls: get('class') };
}

function imgKindFromClass(cls: string | undefined): ImgKind {
  if (!cls) return 'unknown';
  if (/\bref-portrait\b/.test(cls)) return 'portrait';
  if (/\bref-cover\b/.test(cls)) return 'cover';
  return 'unknown';
}

function idFromSrc(src: string): { id: string; ext: string } {
  const base = src.split('/').pop() ?? src;
  const ext = path.extname(base);
  const id = ext ? base.slice(0, -ext.length) : base;
  return { id, ext: ext.replace(/^\./, '') };
}

/**
 * Aggancia ogni img al marker [^N] più vicino che la precede,
 * a patto che tra il marker e l'img non ci sia un \n\n (cambio paragrafo)
 * o un altro marker. È euristico ma riflette il pattern dei file.
 */
function attachImgsToMarkers(
  markers: FootnoteMarker[],
  imgs: ImgRef[],
  body: string,
): { orphanImgs: number; markersWithoutImg: number } {
  let orphan = 0;
  const markerHasImg = new Set<number>();

  for (const img of imgs) {
    // trova l'ultimo marker il cui offset < img.offset
    let candidateIdx = -1;
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].offset < img.offset) candidateIdx = i;
      else break;
    }
    if (candidateIdx === -1) {
      orphan++;
      continue;
    }
    const between = body.slice(markers[candidateIdx].offset, img.offset);
    // se c'è un blank-line tra marker e img, considerala orfana
    if (/\n\s*\n/.test(between)) {
      orphan++;
      continue;
    }
    img.attachedTo = candidateIdx;
    markerHasImg.add(candidateIdx);
  }

  let markersWithoutImg = 0;
  for (let i = 0; i < markers.length; i++) {
    if (!markerHasImg.has(i)) markersWithoutImg++;
  }

  return { orphanImgs: orphan, markersWithoutImg };
}

// ── parsing capitolo ─────────────────────────────────────────────────────────

const FOOTNOTE_DEF_RE = /^\[\^(\d+)\]:\s*([\s\S]*?)$/gm;
// I marker [^N] possono essere immediatamente seguiti da `:` quando il testo
// continua con due punti (es. "ospitare[^2]:"). Le definizioni sono già
// escluse dal fatto che matchano solo a inizio riga (vedi defRanges).
const FOOTNOTE_MARKER_RE = /\[\^(\d+)\]/g;
const IMG_TAG_RE = /<img\b[^>]*>/gi;

function analyzeChapter(file: string): ChapterReport {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const body = parsed.content;

  const fm = parsed.data as Record<string, unknown>;
  const asseDir = path.basename(path.dirname(file));
  const fileName = path.basename(file);

  // 1. footnote definitions: ESTRARLE PRIMA per non confonderle coi marker
  const defs: FootnoteDef[] = [];
  // costruisco range degli offset coperti dalle definizioni così posso escluderle dal marker scan
  const defRanges: Array<[number, number]> = [];
  {
    // ricerca riga per riga: una def inizia con `[^N]:` ad inizio linea
    const defStartRe = /^\[\^(\d+)\]:[ \t]?/gm;
    let m: RegExpExecArray | null;
    const matches: Array<{ num: string; start: number; afterColon: number }> = [];
    while ((m = defStartRe.exec(body)) !== null) {
      matches.push({ num: m[1], start: m.index, afterColon: m.index + m[0].length });
    }
    for (let i = 0; i < matches.length; i++) {
      const cur = matches[i];
      const next = matches[i + 1];
      const end = next ? next.start : body.length;
      defs.push({ num: cur.num, text: body.slice(cur.afterColon, end).trim() });
      defRanges.push([cur.start, end]);
    }
  }

  const isInsideDefRange = (offset: number) =>
    defRanges.some(([s, e]) => offset >= s && offset < e);

  // 2. footnote markers (escludendo quelli dentro le definizioni)
  const markers: FootnoteMarker[] = [];
  {
    let m: RegExpExecArray | null;
    let refCounter = 0;
    while ((m = FOOTNOTE_MARKER_RE.exec(body)) !== null) {
      if (isInsideDefRange(m.index)) continue;
      refCounter++;
      markers.push({ num: m[1], offset: m.index, refId: `r${refCounter}` });
    }
  }

  // 3. img tags (escludendo quelli dentro le definizioni)
  const imgs: ImgRef[] = [];
  {
    let m: RegExpExecArray | null;
    while ((m = IMG_TAG_RE.exec(body)) !== null) {
      if (isInsideDefRange(m.index)) continue;
      const attrs = parseImgAttrs(m[0]);
      const src = attrs.src ?? '';
      const { id, ext } = idFromSrc(src);
      imgs.push({
        kind: imgKindFromClass(attrs.cls),
        id,
        ext,
        src,
        alt: attrs.alt,
        title: attrs.title,
        offset: m.index,
        attachedTo: null,
      });
    }
  }

  // 4. aggancio img → marker
  const { orphanImgs, markersWithoutImg } = attachImgsToMarkers(markers, imgs, body);

  // 5. controlli marker/def
  const markerNums = markers.map((mk) => mk.num);
  const defNums = defs.map((d) => d.num);
  const defNumSet = new Set(defNums);
  const markerNumSet = new Set(markerNums);

  const markersWithoutDef = [...new Set(markerNums.filter((n) => !defNumSet.has(n)))];
  const defsWithoutMarker = defNums.filter((n) => !markerNumSet.has(n));

  const duplicateMarkers: string[] = [];
  {
    const seen = new Map<string, number>();
    for (const n of markerNums) seen.set(n, (seen.get(n) ?? 0) + 1);
    for (const [n, count] of seen) if (count > 1) duplicateMarkers.push(n);
  }

  const imgsByKind = imgs.reduce(
    (acc, img) => {
      acc[img.kind]++;
      return acc;
    },
    { portrait: 0, cover: 0, unknown: 0 },
  );

  return {
    file: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
    asseDir,
    fmAsseSlug: typeof fm.asse_slug === 'string' ? fm.asse_slug : undefined,
    fmChapter: typeof fm.chapter === 'number' ? fm.chapter : undefined,
    fmSlug: typeof fm.slug === 'string' ? fm.slug : undefined,
    fmTitle: typeof fm.title === 'string' ? fm.title : undefined,
    bodyChars: body.length,
    markers,
    defs,
    imgs,
    imgsByKind,
    markersWithoutDef,
    defsWithoutMarker,
    duplicateMarkers,
    orphanImgs,
    markersWithoutImg,
    missingAssets: [], // riempito dopo, con i set globali
    missingRilevanza: [], // idem
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('=== Inventario assi strutturali ===');
  console.log(`Root: ${NORMALIZED_DIR}`);

  const files = listMarkdownFiles(NORMALIZED_DIR);
  console.log(`Capitoli trovati: ${files.length}\n`);

  // catalogo asset
  const assetsAutori = listAssetIds(ASSETS_AUTORI);
  const assetsLibri = listAssetIds(ASSETS_LIBRI);

  // catalogo rilevanza
  let rilevanzaAutori = new Set<string>();
  let rilevanzaLibri = new Set<string>();
  try {
    const rilRaw = fs.readFileSync(RILEVANZA_JSON, 'utf8');
    const ril = JSON.parse(rilRaw);
    rilevanzaAutori = new Set<string>((ril.autori ?? []).map((a: { id: string }) => a.id));
    rilevanzaLibri = new Set<string>((ril.libri ?? []).map((l: { id: string }) => l.id));
  } catch (e) {
    console.warn(`!! impossibile leggere il catalogo rilevanza: ${RILEVANZA_JSON}`);
  }

  const chapters: ChapterReport[] = [];
  for (const f of files) {
    chapters.push(analyzeChapter(f));
  }

  // ── validation incrocio asset/catalogo ──
  const authorChapterFreq = new Map<string, Set<string>>(); // id → set chapter file
  const bookChapterFreq = new Map<string, Set<string>>();
  const missingAssetsAuthors = new Set<string>();
  const missingAssetsBooks = new Set<string>();
  const missingRilevanzaAuthors = new Set<string>();
  const missingRilevanzaBooks = new Set<string>();

  for (const ch of chapters) {
    const chMissingAssets = new Set<string>();
    const chMissingRil = new Set<string>();

    for (const img of ch.imgs) {
      if (img.kind === 'portrait') {
        if (!authorChapterFreq.has(img.id)) authorChapterFreq.set(img.id, new Set());
        authorChapterFreq.get(img.id)!.add(ch.file);
        if (!assetsAutori.has(img.id)) {
          missingAssetsAuthors.add(img.id);
          chMissingAssets.add(img.id);
        }
        if (!rilevanzaAutori.has(img.id)) {
          missingRilevanzaAuthors.add(img.id);
          chMissingRil.add(img.id);
        }
      } else if (img.kind === 'cover') {
        if (!bookChapterFreq.has(img.id)) bookChapterFreq.set(img.id, new Set());
        bookChapterFreq.get(img.id)!.add(ch.file);
        if (!assetsLibri.has(img.id)) {
          missingAssetsBooks.add(img.id);
          chMissingAssets.add(img.id);
        }
        if (!rilevanzaLibri.has(img.id)) {
          missingRilevanzaBooks.add(img.id);
          chMissingRil.add(img.id);
        }
      }
    }
    ch.missingAssets = [...chMissingAssets].sort();
    ch.missingRilevanza = [...chMissingRil].sort();
  }

  // ── totali ──
  const totals = chapters.reduce(
    (acc, c) => {
      acc.bodyChars += c.bodyChars;
      acc.markers += c.markers.length;
      acc.defs += c.defs.length;
      acc.imgs += c.imgs.length;
      acc.portraits += c.imgsByKind.portrait;
      acc.covers += c.imgsByKind.cover;
      acc.unknown += c.imgsByKind.unknown;
      acc.orphanImgs += c.orphanImgs;
      acc.markersWithoutImg += c.markersWithoutImg;
      return acc;
    },
    {
      chapters: chapters.length,
      bodyChars: 0,
      markers: 0,
      defs: 0,
      imgs: 0,
      portraits: 0,
      covers: 0,
      unknown: 0,
      orphanImgs: 0,
      markersWithoutImg: 0,
    },
  );

  const chaptersWithMarkerDefMismatch = chapters
    .filter((c) => c.markersWithoutDef.length > 0 || c.defsWithoutMarker.length > 0 || c.duplicateMarkers.length > 0)
    .map((c) => c.file);

  const report: InventoryReport = {
    generatedAt: new Date().toISOString(),
    chapters,
    totals,
    catalog: {
      distinctAuthors: [...authorChapterFreq.keys()].sort(),
      distinctBooks: [...bookChapterFreq.keys()].sort(),
      authorChapterFrequency: Object.fromEntries(
        [...authorChapterFreq.entries()].map(([k, v]) => [k, v.size]),
      ),
      bookChapterFrequency: Object.fromEntries(
        [...bookChapterFreq.entries()].map(([k, v]) => [k, v.size]),
      ),
    },
    validation: {
      missingAssetsAuthors: [...missingAssetsAuthors].sort(),
      missingAssetsBooks: [...missingAssetsBooks].sort(),
      missingRilevanzaAuthors: [...missingRilevanzaAuthors].sort(),
      missingRilevanzaBooks: [...missingRilevanzaBooks].sort(),
      chaptersWithMarkerDefMismatch,
    },
  };

  fs.writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2), 'utf8');

  // ── stampa human-readable ──
  console.log('--- Totali ---');
  console.log(`  Capitoli                 : ${totals.chapters}`);
  console.log(`  Caratteri body (totale)  : ${totals.bodyChars.toLocaleString()}`);
  console.log(`  Marker [^N]              : ${totals.markers}`);
  console.log(`  Definizioni footnote     : ${totals.defs}`);
  console.log(`  <img> ref totali         : ${totals.imgs}`);
  console.log(`     ref-portrait          : ${totals.portraits}`);
  console.log(`     ref-cover             : ${totals.covers}`);
  console.log(`     unknown               : ${totals.unknown}`);
  console.log(`  Img orfane (no marker)   : ${totals.orphanImgs}`);
  console.log(`  Marker senza img         : ${totals.markersWithoutImg}`);
  console.log();

  console.log('--- Capitoli con problemi marker/def ---');
  if (chaptersWithMarkerDefMismatch.length === 0) console.log('  (nessuno)');
  else {
    for (const ch of chapters) {
      if (ch.markersWithoutDef.length || ch.defsWithoutMarker.length || ch.duplicateMarkers.length) {
        console.log(`  ${ch.file}`);
        if (ch.markersWithoutDef.length) console.log(`     marker senza def : [${ch.markersWithoutDef.join(',')}]`);
        if (ch.defsWithoutMarker.length) console.log(`     def senza marker : [${ch.defsWithoutMarker.join(',')}]`);
        if (ch.duplicateMarkers.length) console.log(`     marker duplicati : [${ch.duplicateMarkers.join(',')}]`);
      }
    }
  }
  console.log();

  console.log('--- Catalogo: autori distinti ---');
  console.log(`  Totale: ${report.catalog.distinctAuthors.length}`);
  console.log(`  Mancanti come asset      : ${report.validation.missingAssetsAuthors.length}`);
  if (report.validation.missingAssetsAuthors.length) {
    for (const id of report.validation.missingAssetsAuthors) console.log(`     - ${id}`);
  }
  console.log(`  Mancanti nel catalogo ril: ${report.validation.missingRilevanzaAuthors.length}`);
  if (report.validation.missingRilevanzaAuthors.length) {
    for (const id of report.validation.missingRilevanzaAuthors) console.log(`     - ${id}`);
  }
  console.log();

  console.log('--- Catalogo: libri distinti ---');
  console.log(`  Totale: ${report.catalog.distinctBooks.length}`);
  console.log(`  Mancanti come asset      : ${report.validation.missingAssetsBooks.length}`);
  if (report.validation.missingAssetsBooks.length) {
    for (const id of report.validation.missingAssetsBooks) console.log(`     - ${id}`);
  }
  console.log(`  Mancanti nel catalogo ril: ${report.validation.missingRilevanzaBooks.length}`);
  if (report.validation.missingRilevanzaBooks.length) {
    for (const id of report.validation.missingRilevanzaBooks) console.log(`     - ${id}`);
  }
  console.log();

  console.log('--- Top 10 autori per frequenza di citazione (capitoli) ---');
  const topAuthors = Object.entries(report.catalog.authorChapterFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  for (const [id, n] of topAuthors) console.log(`  ${n.toString().padStart(2)}  ${id}`);
  console.log();

  console.log('--- Top 10 libri per frequenza di citazione (capitoli) ---');
  const topBooks = Object.entries(report.catalog.bookChapterFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  for (const [id, n] of topBooks) console.log(`  ${n.toString().padStart(2)}  ${id}`);
  console.log();

  console.log('--- Per asse: capitoli e media riferimenti ---');
  const byAsse = new Map<string, ChapterReport[]>();
  for (const c of chapters) {
    if (!byAsse.has(c.asseDir)) byAsse.set(c.asseDir, []);
    byAsse.get(c.asseDir)!.push(c);
  }
  const asseDirs = [...byAsse.keys()].sort();
  for (const a of asseDirs) {
    const cs = byAsse.get(a)!;
    const avgImgs = cs.reduce((s, c) => s + c.imgs.length, 0) / cs.length;
    const avgMarkers = cs.reduce((s, c) => s + c.markers.length, 0) / cs.length;
    console.log(`  ${a}`);
    console.log(`     capitoli: ${cs.length}, media marker: ${avgMarkers.toFixed(1)}, media img: ${avgImgs.toFixed(1)}`);
  }
  console.log();

  console.log(`Report dettagliato scritto in: ${path.relative(REPO_ROOT, REPORT_OUT)}`);
}

main();
