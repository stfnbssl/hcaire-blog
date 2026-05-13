// Smoke test per la configurazione R2.
// Uso: npm run r2:test-upload --workspace=server [-- --file=path/to/image.jpg]
//
// 1. Se non passi --file usa un piccolo PNG sintetico (1x1 px).
// 2. Carica in `_test/<timestamp>-<basename>` (cartella separata dal catalogo).
// 3. Verifica che l'oggetto esista, stampa l'URL pubblico, poi opzionalmente cancella.
//    Usa --keep per non cancellare a fine test.

import '../loadEnv';
import fs from 'fs';
import path from 'path';
import {
  uploadImage,
  deleteImage,
  objectExists,
  isR2Configured,
  sanitizeKey,
} from '../services/r2';

function parseArgs(): { file?: string; keep: boolean } {
  const args = process.argv.slice(2);
  let file: string | undefined;
  let keep = false;
  for (const a of args) {
    if (a.startsWith('--file=')) file = a.slice('--file='.length);
    else if (a === '--keep') keep = true;
  }
  return { file, keep };
}

// PNG 1x1 trasparente (base64) — fallback se non si passa --file
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

async function main(): Promise<void> {
  if (!isR2Configured()) {
    console.error(
      '✗ R2 non configurato. Verifica in server/.env:\n' +
        '  R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_BASE_URL'
    );
    process.exit(1);
  }

  const { file, keep } = parseArgs();
  let buffer: Buffer;
  let filename: string;

  if (file) {
    const abs = path.resolve(file);
    if (!fs.existsSync(abs)) {
      console.error(`✗ File non trovato: ${abs}`);
      process.exit(1);
    }
    buffer = fs.readFileSync(abs);
    filename = path.basename(abs);
    console.log(`[r2:test] uso file locale: ${abs} (${buffer.length} byte)`);
  } else {
    buffer = Buffer.from(TINY_PNG_BASE64, 'base64');
    filename = 'tiny.png';
    console.log(`[r2:test] uso PNG sintetico 1x1 (${buffer.length} byte)`);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const key = sanitizeKey('_test', `${stamp}-${filename}`);

  console.log(`[r2:test] upload → ${key} …`);
  const res = await uploadImage(buffer, key);
  console.log(`[r2:test] ✓ uploaded`);
  console.log(`         key:         ${res.key}`);
  console.log(`         contentType: ${res.contentType}`);
  console.log(`         size:        ${res.size}`);
  console.log(`         url:         ${res.url}`);

  const exists = await objectExists(key);
  console.log(`[r2:test] HEAD verify: ${exists ? '✓ presente' : '✗ MANCANTE'}`);

  if (!exists) {
    console.error('✗ Upload riuscito ma HEAD non lo trova — controlla credenziali/bucket.');
    process.exit(2);
  }

  if (keep) {
    console.log(`[r2:test] --keep attivo: oggetto NON cancellato. Visita ${res.url} per verifica visuale.`);
  } else {
    console.log(`[r2:test] cleanup: cancello ${key} …`);
    await deleteImage(key);
    const stillThere = await objectExists(key);
    console.log(`[r2:test] post-delete HEAD: ${stillThere ? '✗ ancora presente' : '✓ cancellato'}`);
  }

  console.log('\n[r2:test] ✓ smoke test completato.');
}

main().catch((err) => {
  console.error('[r2:test] ✗ errore:');
  console.error(err);
  process.exit(1);
});
