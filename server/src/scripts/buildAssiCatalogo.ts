/**
 * Fase 1 — Genera il catalogo strutturato autori/libri per gli assi strutturali.
 *
 * Sorgente (per ora): client/public/data/sviluppo-bambino-rilevanza-giorno-1.json
 *   { autori: [{id, nome, rilevanza}], libri: [{id, titolo, rilevanza}] }
 *
 * Output:
 *   server/content/progetti/sviluppo bambino/catalogo/authors.json  (AuthorsFile)
 *   server/content/progetti/sviluppo bambino/catalogo/books.json    (BooksFile)
 *
 * Il path dell'immagine viene risolto guardando l'estensione effettiva del file
 * presente in client/public/assets/{autori,libri}/.
 *
 * Finché il renderer dei capitoli legge ancora il file rilevanza-giorno-1.json,
 * il catalogo qui generato è una vista derivata. La direzione si invertirà in
 * Fase 3 quando il renderer punterà ai nuovi file.
 *
 * Uso: npm run catalogo:build  (oppure ts-node server/src/scripts/buildAssiCatalogo.ts)
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  Author,
  Book,
  AuthorsFile,
  BooksFile,
  CatalogMeta,
} from '../shared/types/assi';

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

const RILEVANZA_JSON = path.join(
  REPO_ROOT,
  'client',
  'public',
  'data',
  'sviluppo-bambino-rilevanza-giorno-1.json',
);
const ASSETS_AUTORI = path.join(REPO_ROOT, 'client', 'public', 'assets', 'autori');
const ASSETS_LIBRI = path.join(REPO_ROOT, 'client', 'public', 'assets', 'libri');

const CATALOGO_DIR = path.join(
  REPO_ROOT,
  'server',
  'content',
  'progetti',
  'sviluppo bambino',
  'catalogo',
);
const AUTHORS_OUT = path.join(CATALOGO_DIR, 'authors.json');
const BOOKS_OUT = path.join(CATALOGO_DIR, 'books.json');

// ── helpers ──────────────────────────────────────────────────────────────────

interface RilevanzaSource {
  autori: { id: string; nome: string; rilevanza: string }[];
  libri: { id: string; titolo: string; rilevanza: string }[];
}

/** mappa id → estensione effettiva (es. "jpg", "svg") leggendo la cartella asset */
function buildAssetExtIndex(dir: string): Map<string, string> {
  const out = new Map<string, string>();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f);
    if (!ext) continue;
    const id = path.basename(f, ext);
    // se compare due volte con estensioni diverse, vince la prima per ordine alfabetico:
    // poco probabile in pratica, ma è bene essere deterministici.
    if (!out.has(id)) out.set(id, ext.replace(/^\./, ''));
  }
  return out;
}

function resolveImagePath(publicSubdir: 'autori' | 'libri', id: string, extIndex: Map<string, string>): string | null {
  const ext = extIndex.get(id);
  if (!ext) return null;
  return `/assets/${publicSubdir}/${id}.${ext}`;
}

/** carica un eventuale catalog file esistente per preservare overrides manuali */
function loadExistingCatalog<T>(filePath: string, key: 'authors' | 'books'): T[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(raw[key]) ? (raw[key] as T[]) : [];
  } catch {
    return [];
  }
}

/** se l'utente ha aggiunto manualmente campi opzionali (birthYear, authorIds, ecc.), li riporto */
function preserveManualFields<T extends { id: string }>(
  generated: T[],
  existing: T[],
  manualKeys: (keyof T)[],
): T[] {
  const byId = new Map(existing.map((x) => [x.id, x]));
  return generated.map((g) => {
    const prior = byId.get(g.id);
    if (!prior) return g;
    const merged: T = { ...g };
    for (const k of manualKeys) {
      if (prior[k] !== undefined && (merged[k] === undefined || merged[k] === null)) {
        merged[k] = prior[k];
      }
    }
    return merged;
  });
}

// ── main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('=== buildAssiCatalogo ===');

  // sorgente
  if (!fs.existsSync(RILEVANZA_JSON)) {
    console.error(`!! file sorgente non trovato: ${RILEVANZA_JSON}`);
    process.exit(1);
  }
  const src = JSON.parse(fs.readFileSync(RILEVANZA_JSON, 'utf8')) as RilevanzaSource;
  console.log(`  Sorgente: ${path.relative(REPO_ROOT, RILEVANZA_JSON)}`);
  console.log(`     autori: ${src.autori?.length ?? 0}`);
  console.log(`     libri : ${src.libri?.length ?? 0}`);

  // index estensioni
  const autoriExtIdx = buildAssetExtIndex(ASSETS_AUTORI);
  const libriExtIdx = buildAssetExtIndex(ASSETS_LIBRI);
  console.log(`  Asset autori indicizzati: ${autoriExtIdx.size}`);
  console.log(`  Asset libri  indicizzati: ${libriExtIdx.size}`);

  // costruzione authors[]
  const missingAuthorImages: string[] = [];
  const generatedAuthors: Author[] = (src.autori ?? []).map((a) => {
    const image = resolveImagePath('autori', a.id, autoriExtIdx);
    if (!image) missingAuthorImages.push(a.id);
    return {
      id: a.id,
      nome: a.nome,
      image: image ?? `/assets/autori/${a.id}`,
      rilevanza: a.rilevanza,
    };
  });

  // costruzione books[]
  const missingBookImages: string[] = [];
  const generatedBooks: Book[] = (src.libri ?? []).map((l) => {
    const cover = resolveImagePath('libri', l.id, libriExtIdx);
    if (!cover) missingBookImages.push(l.id);
    return {
      id: l.id,
      titolo: l.titolo,
      cover: cover ?? `/assets/libri/${l.id}`,
      rilevanza: l.rilevanza,
    };
  });

  // se i file esistono già, preservo eventuali campi opzionali aggiunti a mano
  const existingAuthors = loadExistingCatalog<Author>(AUTHORS_OUT, 'authors');
  const existingBooks = loadExistingCatalog<Book>(BOOKS_OUT, 'books');

  const authors = preserveManualFields(generatedAuthors, existingAuthors, ['birthYear', 'deathYear']);
  const books = preserveManualFields(generatedBooks, existingBooks, ['authorIds', 'anno', 'titoloOriginale']);

  // determinazione `source`: se il payload è cambiato rispetto al file esistente
  // ma il file esistente aveva `source: manual`, manteniamo quel flag come segnale
  // che qualcuno potrebbe aver editato a mano e va riconciliato.
  const meta: CatalogMeta = {
    generatedAt: new Date().toISOString(),
    derivedFrom: path.relative(REPO_ROOT, RILEVANZA_JSON).replace(/\\/g, '/'),
    source: 'generated',
  };

  // scrittura
  if (!fs.existsSync(CATALOGO_DIR)) fs.mkdirSync(CATALOGO_DIR, { recursive: true });

  const authorsFile: AuthorsFile = { _meta: meta, authors };
  const booksFile: BooksFile = { _meta: meta, books };

  fs.writeFileSync(AUTHORS_OUT, JSON.stringify(authorsFile, null, 2) + '\n', 'utf8');
  fs.writeFileSync(BOOKS_OUT, JSON.stringify(booksFile, null, 2) + '\n', 'utf8');

  // ── report ──
  console.log();
  console.log('--- Output ---');
  console.log(`  ${path.relative(REPO_ROOT, AUTHORS_OUT)}  (${authors.length} autori)`);
  console.log(`  ${path.relative(REPO_ROOT, BOOKS_OUT)}  (${books.length} libri)`);

  if (missingAuthorImages.length || missingBookImages.length) {
    console.log();
    console.log('--- Avvertenze ---');
    if (missingAuthorImages.length) {
      console.log(`  ${missingAuthorImages.length} autori senza file immagine in /assets/autori/:`);
      for (const id of missingAuthorImages) console.log(`     - ${id}`);
    }
    if (missingBookImages.length) {
      console.log(`  ${missingBookImages.length} libri senza file immagine in /assets/libri/:`);
      for (const id of missingBookImages) console.log(`     - ${id}`);
    }
  }
}

main();
