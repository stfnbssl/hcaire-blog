/**
 * Decorazione di marker [^N] nudi con i tag <img> bibliografici.
 *
 * Per i marker che non hanno ancora autori/libri associati nel file (tipico
 * dei nuovi marker introdotti da una revisione editoriale), questo tool legge
 * una "mappa di decorazione" e inietta i tag <img> dopo ciascun marker
 * indicato.
 *
 * I tag generati seguono lo stile inline usato nei file canonici del progetto:
 *   ref-portrait : style "height:104px;..." con title/alt = nome autore
 *   ref-cover    : style "height:208px;..." con title/alt = titolo libro
 *
 * I metadati (nome / titolo) vengono presi dal catalogo authors.json /
 * books.json. Se un id non esiste nel catalogo lo script fallisce con errore
 * (niente decorazione silenziosa).
 *
 * La mappa di decorazione è hardcoded (sotto, in `DECORATIONS`) per la
 * tornata di revisioni del 2026-05-09. Quando ci saranno altri lotti di
 * revisioni, basterà aggiungere voci all'array.
 *
 * Lo script non tocca i marker che hanno già un <img> dopo (idempotente).
 * Lo script richiede di puntare ai file `* - merged.md` (non ai canonici).
 */

import * as fs from 'fs';
import * as path from 'path';
import type { AuthorsFile, BooksFile, Author, Book } from '../../../shared/types/assi';

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
const AUTHORS_PATH = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'catalogo',
  'authors.json',
);
const BOOKS_PATH = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'catalogo',
  'books.json',
);

// ── mappa decorazioni 2026-05-09 (revisioni Caso B) ─────────────────────────

interface Decoration {
  /** path del file merged relativo a NORMALIZED_DIR */
  file: string;
  /** numero del marker [^N] da decorare */
  marker: string;
  /** id autori (creano <img class="ref-portrait">) */
  authorIds: string[];
  /** id libri (creano <img class="ref-cover">) */
  bookIds: string[];
}

const DECORATIONS: Decoration[] = [
  {
    file: 'Asse 1 - Ontologico - fenomenologico/Capitolo 4 - La corporeità come luogo originario di senso - merged.md',
    marker: '4',
    authorIds: ['daniel-stern', 'maurice-merleau-ponty'],
    bookIds: ['stern-mondo-interpersonale-del-bambino', 'merleau-ponty-fenomenologia-della-percezione'],
  },
  {
    file: 'Asse 1 - Ontologico - fenomenologico/Capitolo 5 - La regolazione come principio ontologico - merged.md',
    marker: '7',
    authorIds: ['donald-winnicott'],
    bookIds: ['winnicott-dalla-pediatria-alla-psicoanalisi'],
  },
  {
    file: 'Asse 1 - Ontologico - fenomenologico/Capitolo 5 - La regolazione come principio ontologico - merged.md',
    marker: '8',
    authorIds: ['donald-winnicott'],
    bookIds: ['winnicott-gioco-e-realta'],
  },
  {
    file: 'Asse 1 - Ontologico - fenomenologico/Capitolo 5 - La regolazione come principio ontologico - merged.md',
    marker: '9',
    authorIds: ['daniel-stern'],
    bookIds: ['stern-momento-presente'],
  },
  {
    file: 'Asse 4 - Separazione e Limite/Capitolo 7 - Statuto simbolico della perdita - merged.md',
    marker: '6',
    authorIds: ['paul-ricoeur', 'hans-georg-gadamer'],
    bookIds: [],
  },
  {
    file: 'Asse 5 - Desiderio/Capitolo 2 - Genealogia filosofica del desiderio - merged.md',
    marker: '4',
    authorIds: ['baruch-spinoza'],
    bookIds: ['spinoza-etica'],
  },
  // [^5] è una nota di raccordo strutturale: nessuna decorazione (lasciato nudo)
  {
    file: 'Asse 5 - Desiderio/Capitolo 2 - Genealogia filosofica del desiderio - merged.md',
    marker: '6',
    authorIds: ['georg-wilhelm-friedrich-hegel'],
    bookIds: ['hegel-fenomenologia-dello-spirito'],
  },
  {
    file: 'Asse 5 - Desiderio/Capitolo 2 - Genealogia filosofica del desiderio - merged.md',
    marker: '7',
    authorIds: ['axel-honneth'],
    bookIds: ['honneth-lotta-per-il-riconoscimento'],
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function loadCatalog(): { authors: Map<string, Author>; books: Map<string, Book> } {
  const a = JSON.parse(fs.readFileSync(AUTHORS_PATH, 'utf8')) as AuthorsFile;
  const b = JSON.parse(fs.readFileSync(BOOKS_PATH, 'utf8')) as BooksFile;
  return {
    authors: new Map(a.authors.map((x) => [x.id, x])),
    books: new Map(b.books.map((x) => [x.id, x])),
  };
}

function buildPortraitTag(a: Author): string {
  return (
    `<img src="${a.image}" alt="${a.nome}" title="${a.nome}" ` +
    `class="ref-portrait" ` +
    `style="height:104px;vertical-align:middle;border-radius:5%;margin:0 4px 0 2px;box-shadow:0 1px 3px rgba(0,0,0,.25)">`
  );
}

function buildCoverTag(b: Book): string {
  return (
    `<img src="${b.cover}" alt="${b.titolo}" title="${b.titolo}" ` +
    `class="ref-cover" ` +
    `style="height:208px;vertical-align:middle;margin:0 4px 0 2px;box-shadow:0 1px 4px rgba(0,0,0,.3)">`
  );
}

interface FileResult {
  file: string;
  decorationsApplied: number;
  alreadyDecorated: number;
  errors: string[];
}

function applyDecorationsToFile(
  filePath: string,
  decs: Decoration[],
  catalog: { authors: Map<string, Author>; books: Map<string, Book> },
): FileResult {
  const result: FileResult = {
    file: path.relative(REPO_ROOT, filePath).replace(/\\/g, '/'),
    decorationsApplied: 0,
    alreadyDecorated: 0,
    errors: [],
  };

  if (!fs.existsSync(filePath)) {
    result.errors.push(`file non trovato: ${filePath}`);
    return result;
  }

  let body = fs.readFileSync(filePath, 'utf8');

  // Operiamo dal marker più alto al più basso per evitare che inserzioni precedenti
  // spostino offset di marker successivi (anche se il pattern di replace usato non
  // dipende da offset, è una buona difesa).
  const sorted = [...decs].sort((a, b) => Number(b.marker) - Number(a.marker));

  for (const d of sorted) {
    // Costruisco i tag
    const portraits: string[] = [];
    for (const id of d.authorIds) {
      const a = catalog.authors.get(id);
      if (!a) {
        result.errors.push(`[^${d.marker}]: author id "${id}" non in catalogo`);
        continue;
      }
      portraits.push(buildPortraitTag(a));
    }
    const covers: string[] = [];
    for (const id of d.bookIds) {
      const b = catalog.books.get(id);
      if (!b) {
        result.errors.push(`[^${d.marker}]: book id "${id}" non in catalogo`);
        continue;
      }
      covers.push(buildCoverTag(b));
    }
    if (portraits.length === 0 && covers.length === 0) continue;

    const tagsBlock = ' ' + [...portraits, ...covers].join(' ');

    // Trovo tutti i match del marker, poi classifico ciascuno. Una definizione
    // è il marker a inizio riga seguito da ":". Tutto il resto è inline. Tra
    // gli inline distinguo "già decorato" (seguito da " <img") da "nudo".
    const allRe = new RegExp(`\\[\\^${d.marker}\\]`, 'g');
    let inlineNudoIdx = -1;
    let inlineAlreadyDecorated = false;
    let inlineCount = 0;

    let mm: RegExpExecArray | null;
    while ((mm = allRe.exec(body)) !== null) {
      const idx = mm.index;
      const tokenLen = mm[0].length;
      const isAtLineStart = idx === 0 || body[idx - 1] === '\n';
      const isDefinition = isAtLineStart && body[idx + tokenLen] === ':';
      if (isDefinition) continue;

      inlineCount++;
      // verifica se subito dopo c'è già un <img>
      const after = body.slice(idx + tokenLen);
      if (/^[ \t]+<img\b/.test(after)) {
        inlineAlreadyDecorated = true;
      } else if (inlineNudoIdx === -1) {
        inlineNudoIdx = idx + tokenLen; // posizione dove iniettare
      }
    }

    if (inlineCount === 0) {
      result.errors.push(`[^${d.marker}]: nessuna occorrenza inline trovata`);
      continue;
    }
    if (inlineNudoIdx === -1) {
      // tutte le occorrenze inline sono già decorate
      result.alreadyDecorated++;
      continue;
    }
    if (inlineCount > 1 && !inlineAlreadyDecorated) {
      result.errors.push(
        `[^${d.marker}]: trovate ${inlineCount} occorrenze inline — ambiguo, decoro la prima nuda`,
      );
    }
    body = body.slice(0, inlineNudoIdx) + tagsBlock + body.slice(inlineNudoIdx);
    result.decorationsApplied++;
  }

  if (result.errors.length === 0 && (result.decorationsApplied > 0 || result.alreadyDecorated > 0)) {
    fs.writeFileSync(filePath, body, 'utf8');
  }

  return result;
}

// ── main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('=== decorate markers ===');
  console.log();

  const catalog = loadCatalog();
  console.log(`  Catalogo autori: ${catalog.authors.size}`);
  console.log(`  Catalogo libri : ${catalog.books.size}`);
  console.log();

  // Raggruppa decorazioni per file
  const byFile = new Map<string, Decoration[]>();
  for (const d of DECORATIONS) {
    const abs = path.join(NORMALIZED_DIR, d.file);
    if (!byFile.has(abs)) byFile.set(abs, []);
    byFile.get(abs)!.push(d);
  }

  let totalApplied = 0;
  let totalErrors = 0;
  for (const [filePath, decs] of byFile) {
    const r = applyDecorationsToFile(filePath, decs, catalog);
    console.log(`  ${r.file}`);
    console.log(`     decorate applicate : ${r.decorationsApplied}`);
    if (r.alreadyDecorated > 0) {
      console.log(`     già decorate       : ${r.alreadyDecorated}`);
    }
    if (r.errors.length > 0) {
      console.log(`     ERRORI:`);
      for (const e of r.errors) console.log(`       - ${e}`);
    }
    totalApplied += r.decorationsApplied;
    totalErrors += r.errors.length;
  }

  console.log();
  console.log(`Totale decorate applicate: ${totalApplied}`);
  console.log(`Totale errori           : ${totalErrors}`);
}

main();
