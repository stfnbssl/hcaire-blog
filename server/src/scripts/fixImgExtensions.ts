/**
 * Sistema i tag <img src="/assets/{autori|libri}/<id>"> nei .md sotto
 * `normalized/` aggiungendo l'estensione effettiva (`.jpg`, `.svg`, ...)
 * quando il file asset corrispondente esiste.
 *
 * Caso d'uso: dopo aver caricato in /assets/ un'immagine prima mancante,
 * i .md contengono ancora il path placeholder senza estensione (lasciato
 * dallo script `decorateMarkers.ts` quando l'asset non era ancora presente).
 *
 * Lo script:
 *   - scansiona tutti i .md sotto normalized/
 *   - cerca <img src="/assets/{autori|libri}/<id>"> dove <id> NON contiene `.`
 *   - per ogni id, guarda in /assets/<dir>/ se esiste un file <id>.<ext>
 *   - se sì, sostituisce nel src
 *   - segnala gli id che non hanno asset (lasciandoli invariati)
 *
 * Uso: ts-node server/src/scripts/fixImgExtensions.ts
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
const ASSETS_AUTORI = path.join(REPO_ROOT, 'client', 'public', 'assets', 'autori');
const ASSETS_LIBRI = path.join(REPO_ROOT, 'client', 'public', 'assets', 'libri');

function buildAssetExtIndex(dir: string): Map<string, string> {
  const out = new Map<string, string>();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f);
    if (!ext) continue;
    const id = path.basename(f, ext);
    if (!out.has(id)) out.set(id, ext.replace(/^\./, ''));
  }
  return out;
}

function listMarkdown(rootDir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(rootDir)) return out;
  for (const sub of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    const subDir = path.join(rootDir, sub.name);
    for (const f of fs.readdirSync(subDir)) {
      if (f.toLowerCase().endsWith('.md')) out.push(path.join(subDir, f));
    }
  }
  return out;
}

function main() {
  console.log('=== fix img extensions ===');
  const autoriIdx = buildAssetExtIndex(ASSETS_AUTORI);
  const libriIdx = buildAssetExtIndex(ASSETS_LIBRI);
  console.log(`  autori asset indicizzati: ${autoriIdx.size}`);
  console.log(`  libri  asset indicizzati: ${libriIdx.size}`);
  console.log();

  // Pattern: src="/assets/(autori|libri)/<id>"  dove <id> non contiene `.`
  const SRC_RE = /src="\/assets\/(autori|libri)\/([^"\/.]+)"/g;

  let totalFixed = 0;
  const stillMissing = new Set<string>();

  for (const file of listMarkdown(NORMALIZED_DIR)) {
    const orig = fs.readFileSync(file, 'utf8');
    let perFile = 0;
    const updated = orig.replace(SRC_RE, (match, kind: string, id: string) => {
      const idx = kind === 'autori' ? autoriIdx : libriIdx;
      const ext = idx.get(id);
      if (!ext) {
        stillMissing.add(`${kind}/${id}`);
        return match;
      }
      perFile++;
      return `src="/assets/${kind}/${id}.${ext}"`;
    });
    if (perFile > 0) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`  ${path.relative(REPO_ROOT, file).replace(/\\/g, '/')}  → ${perFile} fix`);
      totalFixed += perFile;
    }
  }

  console.log();
  console.log(`Totale path estensione completati: ${totalFixed}`);

  if (stillMissing.size > 0) {
    console.log();
    console.log(`Asset ancora mancanti (path lasciati senza estensione):`);
    for (const m of [...stillMissing].sort()) console.log(`  - ${m}`);
  }
}

main();
