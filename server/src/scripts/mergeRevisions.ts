/**
 * Tool di merge revisioni — Caso B (Google Docs roundtrip).
 *
 * Per ogni file `* - rev.md` sotto:
 *   server/content/progetti/sviluppo bambino/assi strutturali/normalized/
 *
 * Trova il file canonico corrispondente (senza " - rev"), e produce un
 * `* - merged.md` accanto alla revisione applicando:
 *
 *   1. Re-iniezione dei tag <img> persi: per ogni marker [^N] che esisteva
 *      nell'originale, sostituisce il "residuo testuale" lasciato da Docs
 *      (gli alt/title degli <img> rimasti come testo letterale) con i tag
 *      <img> originali, ripresi byte-per-byte dal file canonico.
 *   2. Dis-escape dei caratteri scappati da Docs: \*, \_, \., \(, \)
 *
 * Per i marker NUOVI (presenti in rev ma non in orig) il merge li lascia
 * "nudi" e produce un report con le rispettive definizioni footnote, perché
 * tu possa decidere se aggiungere riferimenti grafici e quali.
 *
 * Nessun file canonico viene modificato. Lo step di promozione (rinomina
 * .md → .md.bak, .merged.md → .md) si fa a parte solo dopo che hai
 * approvato il merged.
 *
 * Uso:
 *   ts-node server/src/scripts/mergeRevisions.ts                  # tutti
 *   ts-node server/src/scripts/mergeRevisions.ts --file <path>   # uno
 */

import * as fs from 'fs';
import * as path from 'path';

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

// ── CLI ──────────────────────────────────────────────────────────────────────

interface CliArgs {
  file?: string;
}
function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--file') args.file = argv[++i];
  }
  return args;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function listRevFiles(rootDir: string): string[] {
  const out: string[] = [];
  const asseDirs = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const a of asseDirs) {
    const dir = path.join(rootDir, a);
    const files = fs.readdirSync(dir).filter((f) => / - rev\.md$/i.test(f));
    for (const f of files) out.push(path.join(dir, f));
  }
  return out;
}

function origPathFor(revPath: string): string {
  const dir = path.dirname(revPath);
  const base = path.basename(revPath).replace(/ - rev\.md$/i, '.md');
  return path.join(dir, base);
}

function mergedPathFor(revPath: string): string {
  const dir = path.dirname(revPath);
  const base = path.basename(revPath).replace(/ - rev\.md$/i, ' - merged.md');
  return path.join(dir, base);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── parsing originale: marker → blocco img + residuo atteso ─────────────────

interface OrigRefBlock {
  num: string;
  /** la stringa esatta dei tag <img>, includendo lo spazio iniziale che li separa dal marker */
  imgTagsWithLeadingSpace: string;
  /** il "residuo" che ci aspettiamo di trovare nel rev (alt/title concatenati con uno spazio) */
  expectedResidualWithLeadingSpace: string;
}

const ORIG_REF_RE = /\[\^(\d+)\]((?:[ \t]+<img\b[^>]*>)+)/g;

function parseOrigBlocks(origBody: string): Map<string, OrigRefBlock> {
  const result = new Map<string, OrigRefBlock>();
  let m: RegExpExecArray | null;
  ORIG_REF_RE.lastIndex = 0;
  while ((m = ORIG_REF_RE.exec(origBody)) !== null) {
    const num = m[1];
    const imgsStr = m[2]; // include lo spazio iniziale prima del primo <img>

    const imgRe = /<img\b([^>]*)>/g;
    const titles: string[] = [];
    let im: RegExpExecArray | null;
    while ((im = imgRe.exec(imgsStr)) !== null) {
      const attrs = im[1];
      const titleMatch = /\btitle="([^"]*)"/.exec(attrs);
      const altMatch = /\balt="([^"]*)"/.exec(attrs);
      const txt = (titleMatch?.[1] ?? altMatch?.[1] ?? '').trim();
      titles.push(txt);
    }
    if (titles.length === 0) continue; // safety: nessun residuo riconoscibile

    result.set(num, {
      num,
      imgTagsWithLeadingSpace: imgsStr, // mantiene lo spazio davanti al primo <img>
      expectedResidualWithLeadingSpace: ' ' + titles.join(' '),
    });
  }
  return result;
}

// ── parsing rev: marker inline e definizioni footnote ───────────────────────

const REV_INLINE_MARKER_RE = /\[\^(\d+)\]/g;
const REV_DEF_LINE_RE = /^\[\^(\d+)\]:[ \t]?/gm;

function parseRevDefs(revBody: string): Map<string, string> {
  const out = new Map<string, string>();
  REV_DEF_LINE_RE.lastIndex = 0;
  const matches: Array<{ num: string; afterColon: number; start: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = REV_DEF_LINE_RE.exec(revBody)) !== null) {
    matches.push({ num: m[1], afterColon: m.index + m[0].length, start: m.index });
  }
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const end = next ? next.start : revBody.length;
    out.set(cur.num, revBody.slice(cur.afterColon, end).trim());
  }
  return out;
}

function rangesOfDefinitions(revBody: string): Array<[number, number]> {
  REV_DEF_LINE_RE.lastIndex = 0;
  const ranges: Array<[number, number]> = [];
  const starts: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = REV_DEF_LINE_RE.exec(revBody)) !== null) {
    starts.push(m.index);
  }
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1] : revBody.length;
    ranges.push([starts[i], end]);
  }
  return ranges;
}

function inlineMarkerNums(revBody: string): { num: string; offset: number }[] {
  const defRanges = rangesOfDefinitions(revBody);
  const isInDef = (off: number) => defRanges.some(([s, e]) => off >= s && off < e);
  const out: { num: string; offset: number }[] = [];
  REV_INLINE_MARKER_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = REV_INLINE_MARKER_RE.exec(revBody)) !== null) {
    if (isInDef(m.index)) continue;
    out.push({ num: m[1], offset: m.index });
  }
  return out;
}

// ── trasformazioni ──────────────────────────────────────────────────────────

interface MergeIssue {
  severity: 'info' | 'warning';
  code: string;
  message: string;
}

function reinjectImgs(
  revBody: string,
  origBlocks: Map<string, OrigRefBlock>,
): { body: string; issues: MergeIssue[]; reinjected: number } {
  let body = revBody;
  const issues: MergeIssue[] = [];
  let reinjected = 0;

  // Replace from highest marker number downward to keep things simple. The
  // residualText is unique enough that this rarely matters, but it avoids
  // edge cases where a smaller-num residual might be a substring of a
  // larger one.
  const nums = [...origBlocks.keys()].sort((a, b) => Number(b) - Number(a));

  for (const num of nums) {
    const blk = origBlocks.get(num)!;
    // Cerco la sequenza esatta `[^N]<expectedResidual>` nel body
    const target = `[^${num}]${blk.expectedResidualWithLeadingSpace}`;
    const replacement = `[^${num}]${blk.imgTagsWithLeadingSpace}`;
    const idx = body.indexOf(target);
    if (idx === -1) {
      issues.push({
        severity: 'warning',
        code: 'residual-not-matched',
        message: `[^${num}]: residuo atteso "${blk.expectedResidualWithLeadingSpace.trim()}" non trovato nel rev — il revisore ha probabilmente riscritto la frase. Va sistemato a mano.`,
      });
      continue;
    }
    // Verifica unicità del match (warning se il residuo compare più di una volta)
    const second = body.indexOf(target, idx + target.length);
    if (second !== -1) {
      issues.push({
        severity: 'warning',
        code: 'residual-ambiguous',
        message: `[^${num}]: il residuo "${blk.expectedResidualWithLeadingSpace.trim()}" compare più volte nel rev. Sostituisco solo la prima occorrenza.`,
      });
    }
    body = body.slice(0, idx) + replacement + body.slice(idx + target.length);
    reinjected++;
  }

  return { body, issues, reinjected };
}

/**
 * Rimuove gli escape Docs comuni: \*, \_, \., \(, \), \-, \<, \>, \[, \], \!
 * Operiamo solo nel testo del body — i file md degli assi non hanno blocchi
 * di codice dove preservare questi escape, quindi è sicuro.
 */
function disEscapeDocs(body: string): { body: string; removed: number } {
  let removed = 0;
  const result = body.replace(/\\([*_.()\-<>\[\]!])/g, (_match, ch: string) => {
    removed++;
    return ch;
  });
  return { body: result, removed };
}

// ── frontmatter ─────────────────────────────────────────────────────────────

/**
 * Estrae il frontmatter raw (compresi i delimitatori "---") dal file originale.
 * Ritorna stringa vuota se il file non ha frontmatter (improbabile per i .md
 * canonici degli assi, ma difensivo).
 */
function extractFrontmatterBlock(rawSrc: string): string {
  const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(rawSrc);
  return m ? m[0] : '';
}

/**
 * Rimuove dal contenuto rev qualsiasi pasticcio fatto da Docs sul frontmatter.
 * Strategia: tronca il body fino a (esclusa) la prima riga "# " (h1 vero del
 * capitolo) o, in mancanza, alla prima riga di prosa significativa. Tutto
 * quello prima viene scartato perché ricostruito dal frontmatter dell'orig.
 */
function stripRevFrontmatterArea(revRaw: string): string {
  // Caso A: frontmatter ancora delimitato — tagliamo fino alla seconda ---
  const fmDelim = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(revRaw);
  if (fmDelim) return revRaw.slice(fmDelim[0].length);

  // Caso B: Docs ha lasciato un --- di apertura ma non di chiusura, e ha
  // squashato il body. Tagliamo fino al primo h1 ("# " a inizio riga).
  const h1 = revRaw.search(/^#\s/m);
  if (h1 >= 0) return revRaw.slice(h1);

  // Fallback: ritorna tutto il rev. Il revisore decida a mano.
  return revRaw;
}

// ── per file ────────────────────────────────────────────────────────────────

interface MergeReport {
  revFile: string;
  origFile: string;
  mergedFile: string;
  reinjectedImgs: number;
  unmatchedOrigMarkers: string[];
  newMarkers: { num: string; defText: string }[];
  removedMarkers: string[];
  disEscapesRemoved: number;
  issues: MergeIssue[];
}

function processOneFile(revPath: string): MergeReport | null {
  const origPath = origPathFor(revPath);
  const mergedPath = mergedPathFor(revPath);

  if (!fs.existsSync(origPath)) {
    console.error(`!! File originale non trovato per: ${revPath}`);
    console.error(`   atteso: ${origPath}`);
    return null;
  }

  const origRawFull = fs.readFileSync(origPath, 'utf8');
  const revRawFull = fs.readFileSync(revPath, 'utf8');

  // 0) Frontmatter sempre dall'originale; il body del rev viene preceduto
  //    dal frontmatter canonico, scartando il pasticcio che Docs ha lasciato.
  const origFrontmatter = extractFrontmatterBlock(origRawFull);
  const revBodyOnly = stripRevFrontmatterArea(revRawFull);
  // Per il parsing che segue lavoriamo sulla versione "rev senza frontmatter":
  const revRaw = revBodyOnly;
  // L'orig usato per estrarre i blocchi <img> è il file completo: i marker
  // sono nel body, quindi va bene comunque.
  const origRaw = origRawFull;

  const origBlocks = parseOrigBlocks(origRaw);
  const origMarkerNums = new Set<string>(origBlocks.keys());
  // anche i marker dell'orig che non hanno img (footnote pure)
  ORIG_REF_RE.lastIndex = 0;
  REV_INLINE_MARKER_RE.lastIndex = 0;
  const allOrigMarkers = new Set<string>();
  let mm: RegExpExecArray | null;
  const origDefRanges = rangesOfDefinitions(origRaw);
  REV_INLINE_MARKER_RE.lastIndex = 0;
  while ((mm = REV_INLINE_MARKER_RE.exec(origRaw)) !== null) {
    if (origDefRanges.some(([s, e]) => mm!.index >= s && mm!.index < e)) continue;
    allOrigMarkers.add(mm[1]);
  }

  const revInlineMarkers = inlineMarkerNums(revRaw);
  const revMarkerNums = new Set(revInlineMarkers.map((x) => x.num));
  const revDefs = parseRevDefs(revRaw);

  // 1) reinject delle img
  const { body: bodyAfterReinject, issues: reinjectIssues, reinjected } = reinjectImgs(
    revRaw,
    origBlocks,
  );

  // 2) dis-escape
  const { body: bodyFinal, removed: disEscapesRemoved } = disEscapeDocs(bodyAfterReinject);

  // 3) classifica i marker:
  //    - removedMarkers: presenti in orig ma scomparsi dal rev
  //    - newMarkers: presenti in rev ma non in orig (con la def text dal rev)
  const removedMarkers: string[] = [];
  for (const n of allOrigMarkers) if (!revMarkerNums.has(n)) removedMarkers.push(n);

  const newMarkers: { num: string; defText: string }[] = [];
  for (const n of revMarkerNums) {
    if (!allOrigMarkers.has(n)) {
      newMarkers.push({ num: n, defText: revDefs.get(n) ?? '(definizione non trovata)' });
    }
  }

  // 4) marker dell'orig che avevano img ma il cui residuo non si è agganciato
  const unmatchedOrigMarkers = reinjectIssues
    .filter((i) => i.code === 'residual-not-matched')
    .map((i) => i.message.match(/\[\^(\d+)\]/)?.[1] ?? '?');

  // 5) scrivi il merged: frontmatter canonico (dall'orig) + body trasformato
  const mergedContent = origFrontmatter + bodyFinal;
  fs.writeFileSync(mergedPath, mergedContent, 'utf8');

  return {
    revFile: path.relative(REPO_ROOT, revPath).replace(/\\/g, '/'),
    origFile: path.relative(REPO_ROOT, origPath).replace(/\\/g, '/'),
    mergedFile: path.relative(REPO_ROOT, mergedPath).replace(/\\/g, '/'),
    reinjectedImgs: reinjected,
    unmatchedOrigMarkers,
    newMarkers: newMarkers.sort((a, b) => Number(a.num) - Number(b.num)),
    removedMarkers,
    disEscapesRemoved,
    issues: reinjectIssues,
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log('=== merge revisioni assi strutturali ===');
  console.log();

  let revFiles: string[];
  if (args.file) {
    revFiles = [path.resolve(args.file)];
  } else {
    revFiles = listRevFiles(NORMALIZED_DIR);
  }

  if (revFiles.length === 0) {
    console.log('Nessun file revisionato trovato (cerco "* - rev.md" sotto normalized/).');
    return;
  }

  console.log(`File da processare: ${revFiles.length}`);
  console.log();

  const reports: MergeReport[] = [];
  for (const rev of revFiles) {
    const r = processOneFile(rev);
    if (r) reports.push(r);
  }

  // stampa per ciascun file
  for (const r of reports) {
    console.log('────────────────────────────────────────────────────────────');
    console.log(`  rev    : ${r.revFile}`);
    console.log(`  orig   : ${r.origFile}`);
    console.log(`  merged : ${r.mergedFile}`);
    console.log(`  - <img> re-iniettati : ${r.reinjectedImgs}`);
    console.log(`  - escape rimossi     : ${r.disEscapesRemoved}`);
    if (r.unmatchedOrigMarkers.length > 0) {
      console.log(`  - !! img non re-iniettate (residuo non matchato): [${r.unmatchedOrigMarkers.join(',')}]`);
      for (const iss of r.issues.filter((i) => i.code === 'residual-not-matched')) {
        console.log(`       ${iss.message}`);
      }
    }
    if (r.removedMarkers.length > 0) {
      console.log(`  - marker scomparsi rispetto all'orig: [${r.removedMarkers.join(',')}]`);
    }
    if (r.newMarkers.length > 0) {
      console.log(`  - NUOVI marker (decidi se decorare con autori/libri):`);
      for (const nm of r.newMarkers) {
        console.log(`       [^${nm.num}]  ${nm.defText.replace(/\s+/g, ' ').slice(0, 220)}${nm.defText.length > 220 ? '…' : ''}`);
      }
    }
    for (const iss of r.issues.filter((i) => i.code !== 'residual-not-matched')) {
      console.log(`  - [${iss.severity}/${iss.code}] ${iss.message}`);
    }
  }

  console.log();
  console.log('────────────────────────────────────────────────────────────');
  console.log('Fatto. Verifica i file *.merged.md prima della promozione.');
  console.log('Per applicare, rinomina .md → .md.bak e .merged.md → .md, poi:');
  console.log('  npm run assi:convert -- --write');
}

main();
