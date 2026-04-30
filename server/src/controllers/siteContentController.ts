import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import SiteContent, { SUPPORTED_LANGS, CONTENT_TYPES, type SupportedLang, type ContentType } from '../models/SiteContent';
import type { ClerkRequest } from '../middleware/clerkAuth';

function getLocalesBase(): string {
  // env override; default: client/public/locales relativo al server
  return process.env.LOCALES_PATH
    || path.resolve(__dirname, '../../../client/public/locales');
}

interface SiteContentDTO {
  key:          string;
  namespace:    string;
  type:         ContentType;
  description?: string;
  translations: Partial<Record<SupportedLang, string>>;
  updatedAt:    Date;
}

function toDTO(doc: any): SiteContentDTO {
  // Map → plain object
  const translations: Partial<Record<SupportedLang, string>> = {};
  if (doc.translations instanceof Map) {
    for (const [k, v] of doc.translations) translations[k as SupportedLang] = v;
  } else if (doc.translations && typeof doc.translations === 'object') {
    Object.assign(translations, doc.translations);
  }
  return {
    key:          doc.key,
    namespace:    doc.namespace,
    type:         (doc.type as ContentType) ?? 'plain',
    description:  doc.description ?? '',
    translations,
    updatedAt:    doc.updatedAt,
  };
}

function sanitizeType(input: unknown): ContentType | undefined {
  if (typeof input !== 'string') return undefined;
  return CONTENT_TYPES.includes(input as ContentType) ? (input as ContentType) : undefined;
}

// GET /api/site-content — pubblico, restituisce tutte le chiavi con tutte le lingue
export const listPublic = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await SiteContent.find({}).lean();
    res.json({ items: items.map(toDTO) });
  } catch {
    res.status(500).json({ error: 'Errore recupero contenuti' });
  }
};

// GET /api/admin/site-content — admin
export const listAdmin = async (_req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const items = await SiteContent.find({}).sort({ namespace: 1, key: 1 }).lean();
    res.json({ items: items.map(toDTO) });
  } catch {
    res.status(500).json({ error: 'Errore recupero contenuti' });
  }
};

interface UpsertBody {
  key?:          string;
  namespace?:    string;
  type?:         string;
  description?:  string;
  translations?: Partial<Record<SupportedLang, string>>;
}

function sanitizeTranslations(input: unknown): Partial<Record<SupportedLang, string>> {
  if (!input || typeof input !== 'object') return {};
  const out: Partial<Record<SupportedLang, string>> = {};
  for (const lang of SUPPORTED_LANGS) {
    const v = (input as Record<string, unknown>)[lang];
    if (typeof v === 'string') out[lang] = v;
  }
  return out;
}

// POST /api/admin/site-content — admin: crea nuova chiave
export const createKey = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  const { key, namespace, type, description, translations } = req.body as UpsertBody;

  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    res.status(400).json({ error: 'Chiave mancante o non valida' });
    return;
  }

  try {
    const existing = await SiteContent.findOne({ key });
    if (existing) {
      res.status(409).json({ error: 'Chiave già esistente' });
      return;
    }
    const doc = await SiteContent.create({
      key:          key.trim(),
      namespace:    namespace?.trim() || 'common',
      type:         sanitizeType(type) ?? 'plain',
      description:  description?.trim() || '',
      translations: sanitizeTranslations(translations),
      updatedBy:    userId ?? '',
    });
    res.status(201).json(toDTO(doc));
  } catch {
    res.status(500).json({ error: 'Errore creazione chiave' });
  }
};

// PUT /api/admin/site-content/:key — admin: aggiorna esistente
export const updateKey = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  const { key } = req.params;
  const { namespace, type, description, translations } = req.body as UpsertBody;

  try {
    const update: Record<string, unknown> = { updatedBy: userId ?? '' };
    if (namespace !== undefined)   update.namespace = namespace.trim() || 'common';
    if (type !== undefined) {
      const t = sanitizeType(type);
      if (t) update.type = t;
    }
    if (description !== undefined) update.description = description.trim();
    if (translations !== undefined) update.translations = sanitizeTranslations(translations);

    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { $set: update },
      { new: true }
    );
    if (!doc) {
      res.status(404).json({ error: 'Chiave non trovata' });
      return;
    }
    res.json(toDTO(doc));
  } catch {
    res.status(500).json({ error: 'Errore aggiornamento chiave' });
  }
};

// POST /api/admin/site-content/sync — admin: importa chiavi mancanti dai JSON di default
export const syncFromDefaults = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { userId } = getAuth(req);

  try {
    const localesBase = getLocalesBase();

    // Aggrega tutte le chiavi distinte da tutti i namespace di tutte le lingue
    type AggregatedEntry = { namespace: string; translations: Partial<Record<SupportedLang, string>> };
    const aggregated = new Map<string, AggregatedEntry>();

    for (const lang of SUPPORTED_LANGS) {
      const langDir = path.join(localesBase, lang);
      if (!fs.existsSync(langDir)) continue;

      const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const namespace = path.basename(file, '.json');
        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf-8'));
        } catch {
          continue;
        }

        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value !== 'string') continue;
          let entry = aggregated.get(key);
          if (!entry) {
            entry = { namespace, translations: {} };
            aggregated.set(key, entry);
          }
          entry.translations[lang] = value;
        }
      }
    }

    // Inserisci solo le chiavi non presenti (idempotente, non sovrascrive valori già editati)
    const existingKeys = new Set(
      (await SiteContent.find({}, 'key').lean()).map((d) => d.key)
    );

    let created = 0;
    let skipped = 0;

    for (const [key, entry] of aggregated) {
      if (existingKeys.has(key)) {
        skipped++;
        continue;
      }
      await SiteContent.create({
        key,
        namespace:    entry.namespace,
        translations: entry.translations,
        updatedBy:    userId ?? 'sync',
      });
      created++;
    }

    res.json({
      created,
      skipped,
      total: aggregated.size,
      source: localesBase,
    });
  } catch (e) {
    res.status(500).json({ error: 'Errore sincronizzazione: ' + (e as Error).message });
  }
};

// DELETE /api/admin/site-content/:key — admin
export const deleteKey = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { key } = req.params;
  try {
    const result = await SiteContent.findOneAndDelete({ key });
    if (!result) {
      res.status(404).json({ error: 'Chiave non trovata' });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Errore eliminazione chiave' });
  }
};
