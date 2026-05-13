import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import mime from 'mime-types';

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const BUCKET = process.env.R2_BUCKET;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;
  if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    throw new Error(
      'R2 non configurato: mancano R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY in .env'
    );
  }
  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });
  return _client;
}

function requireBucket(): string {
  if (!BUCKET) throw new Error('R2 non configurato: manca R2_BUCKET in .env');
  return BUCKET;
}

export function isR2Configured(): boolean {
  return Boolean(ACCOUNT_ID && BUCKET && ACCESS_KEY_ID && SECRET_ACCESS_KEY);
}

export interface UploadResult {
  key: string;
  url: string;
  contentType: string;
  size: number;
}

/**
 * Carica un buffer in R2 alla key indicata e restituisce key + url pubblico.
 * `key` deve essere il path completo dentro al bucket, es. "authors/maurice-merleau-ponty.jpg".
 */
export async function uploadImage(
  buffer: Buffer,
  key: string,
  options: { contentType?: string; cacheControl?: string } = {}
): Promise<UploadResult> {
  const bucket = requireBucket();
  const contentType =
    options.contentType || mime.lookup(key) || 'application/octet-stream';
  const cacheControl = options.cacheControl ?? 'public, max-age=31536000, immutable';

  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: cacheControl,
    })
  );

  return {
    key,
    url: publicUrl(key),
    contentType,
    size: buffer.length,
  };
}

export async function deleteImage(key: string): Promise<void> {
  const bucket = requireBucket();
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function objectExists(key: string): Promise<boolean> {
  const bucket = requireBucket();
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (err: unknown) {
    const e = err as { $metadata?: { httpStatusCode?: number }; name?: string };
    if (e.$metadata?.httpStatusCode === 404 || e.name === 'NotFound') return false;
    throw err;
  }
}

export function publicUrl(key: string): string {
  if (!PUBLIC_BASE_URL) {
    throw new Error('R2_PUBLIC_BASE_URL non configurato in .env');
  }
  const base = PUBLIC_BASE_URL.replace(/\/+$/, '');
  const k = key.replace(/^\/+/, '');
  return `${base}/${k}`;
}

/**
 * Helper: deriva una key sicura da un nome file. Mantiene estensione, slug del basename.
 */
export function sanitizeKey(folder: string, filename: string): string {
  const extMatch = filename.match(/\.[a-z0-9]+$/i);
  const ext = extMatch ? extMatch[0].toLowerCase() : '';
  const base = filename
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
  return `${cleanFolder}/${base}${ext}`;
}
