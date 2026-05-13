// Servizio condiviso per il catalogo authors/books.
// Centralizza:
//   - slug-ification degli id
//   - upload/sostituzione immagine su R2 con cache-busting
//   - validazione formato e dimensione
//
// La logica CRUD specifica per Author/Book vive nelle route; questo file
// è il "deposito" delle operazioni che toccano sia Mongo che R2.

import { uploadImage, deleteImage } from './r2';
import mime from 'mime-types';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function slugify(s: string): string {
  return s
    .normalize('NFKD')
    // rimuove diacritici
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export interface ValidatedUpload {
  buffer: Buffer;
  contentType: string;
  ext: string;
}

/**
 * Valida un upload multipart. Lancia Error con messaggio utente-friendly se invalido.
 */
export function validateImageUpload(file: {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}): ValidatedUpload {
  if (!file?.buffer || file.buffer.length === 0) {
    throw new Error('File vuoto');
  }
  if (file.buffer.length > MAX_BYTES) {
    throw new Error(`File troppo grande: ${(file.buffer.length / 1024 / 1024).toFixed(2)} MB (max 5 MB)`);
  }
  if (!ALLOWED_MIMES.has(file.mimetype)) {
    throw new Error(`Formato non supportato: ${file.mimetype}. Usa JPEG, PNG, WebP, AVIF o GIF.`);
  }
  const ext =
    (mime.extension(file.mimetype) as string) ||
    (file.originalname.match(/\.([a-z0-9]+)$/i)?.[1] ?? 'bin');
  return { buffer: file.buffer, contentType: file.mimetype, ext: ext.toLowerCase() };
}

/**
 * Carica una nuova immagine in R2 cancellando la precedente (se key passata).
 * Usa timestamp nel key per cache-busting CDN.
 * Restituisce la coppia { url, key } da salvare nel doc.
 */
export async function replaceCatalogImage(
  folder: 'authors' | 'books',
  id: string,
  upload: ValidatedUpload,
  previousKey: string | null,
): Promise<{ url: string; key: string }> {
  const stamp = Date.now();
  const key = `${folder}/${id}-${stamp}.${upload.ext}`;

  const result = await uploadImage(upload.buffer, key, { contentType: upload.contentType });

  // Cancellazione precedente in fire-and-forget (non blocchiamo se R2 ha glitch).
  if (previousKey && previousKey !== key) {
    deleteImage(previousKey).catch((err) => {
      console.warn(`[catalog] impossibile cancellare ${previousKey}:`, (err as Error).message);
    });
  }

  return { url: result.url, key: result.key };
}

/**
 * Cancella l'immagine corrente (se presente). Idempotente — se key è null non fa nulla.
 */
export async function removeCatalogImage(key: string | null): Promise<void> {
  if (!key) return;
  await deleteImage(key);
}
