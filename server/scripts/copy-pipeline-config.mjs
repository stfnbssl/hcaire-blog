// Postbuild: copia pipeline-step-config.json dentro server/dist/ in modo che
// il deploy cloud (Railway) abbia il file accessibile via path relativo a __dirname.
// Fonte canonica: client/public/pipeline/pipeline-step-config.json (vedi sync-pipeline.mjs).

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_DIR = path.resolve(__dirname, '..');
const REPO_ROOT  = path.resolve(SERVER_DIR, '..');

const candidates = [
  path.join(REPO_ROOT, 'client', 'public', 'pipeline', 'pipeline-step-config.json'),
  path.join(SERVER_DIR, 'pipeline-step-config.json'),
];

const src = candidates.find((c) => existsSync(c));
if (!src) {
  console.warn(`[postbuild] pipeline-step-config.json non trovato (cercato in: ${candidates.join(', ')})`);
  process.exit(0);
}

const distDir = path.join(SERVER_DIR, 'dist');
mkdirSync(distDir, { recursive: true });
const dest = path.join(distDir, 'pipeline-step-config.json');
copyFileSync(src, dest);
console.log(`[postbuild] copiato ${path.relative(REPO_ROOT, src)} → ${path.relative(REPO_ROOT, dest)}`);
