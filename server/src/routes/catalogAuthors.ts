// Rotte admin per il catalogo autori.
//
//   GET    /api/admin/catalog/authors                 → lista (q, project, tag, limit/skip)
//   GET    /api/admin/catalog/authors/:id             → singolo
//   POST   /api/admin/catalog/authors                 → crea
//   PATCH  /api/admin/catalog/authors/:id             → modifica
//   DELETE /api/admin/catalog/authors/:id             → elimina (?force=true per ignorare citazioni)
//   POST   /api/admin/catalog/authors/:id/image       → upload immagine (multipart "file")
//   DELETE /api/admin/catalog/authors/:id/image       → rimuove immagine da R2 e svuota campi

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticateClerk, requireAdmin, ClerkRequest } from '../middleware/clerkAuth';
import Author from '../models/Author';
import AssiChapter from '../models/AssiChapter';
import {
  slugify,
  validateImageUpload,
  replaceCatalogImage,
  removeCatalogImage,
} from '../services/catalogService';

export const catalogAuthorsAdminRouter = Router();

catalogAuthorsAdminRouter.use(authenticateClerk, requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB hard limit (service controlla 5 MB soft)
});

// ── lista ──────────────────────────────────────────────────────────────────

catalogAuthorsAdminRouter.get('/', async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const project = typeof req.query.project === 'string' ? req.query.project : '';
    const tag = typeof req.query.tag === 'string' ? req.query.tag : '';
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const skip = Number(req.query.skip) || 0;

    const filter: Record<string, unknown> = {};
    if (q) {
      // Match case-insensitive su nome o id (più predicibile del $text per liste corte).
      filter.$or = [
        { nome: { $regex: q, $options: 'i' } },
        { id: { $regex: q, $options: 'i' } },
      ];
    }
    if (project) filter['projects.projectId'] = project;
    if (tag) filter.tags = tag;

    const [items, total] = await Promise.all([
      Author.find(filter).sort({ nome: 1 }).skip(skip).limit(limit).lean(),
      Author.countDocuments(filter),
    ]);
    res.json({ items, total, limit, skip });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── singolo ────────────────────────────────────────────────────────────────

catalogAuthorsAdminRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const author = await Author.findOne({ id: req.params.id }).lean();
    if (!author) {
      res.status(404).json({ error: 'Autore non trovato' });
      return;
    }
    // Aggiungo capitoli citanti per ergonomia UI.
    const citing = await AssiChapter
      .find({ 'references.authorIds': author.id }, { axis_slug: 1, slug: 1, title: 1, axis_number: 1, chapter_number: 1 })
      .sort({ axis_number: 1, chapter_number: 1 })
      .lean();
    res.json({ author, citing });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── crea ───────────────────────────────────────────────────────────────────

catalogAuthorsAdminRouter.post('/', async (req: ClerkRequest, res: Response) => {
  try {
    const body = req.body as {
      id?: string;
      nome?: string;
      birth_year?: number | null;
      death_year?: number | null;
      bio_short?: string | null;
      wikipedia?: string | null;
      projects?: Array<{ projectId: string; rilevanza?: string }>;
      tags?: string[];
    };

    if (!body.nome || typeof body.nome !== 'string') {
      res.status(400).json({ error: 'Campo "nome" obbligatorio' });
      return;
    }
    const id = (body.id && body.id.trim()) || slugify(body.nome);
    if (!id) {
      res.status(400).json({ error: 'Impossibile derivare uno slug valido dal nome' });
      return;
    }
    const existing = await Author.findOne({ id }).lean();
    if (existing) {
      res.status(409).json({ error: `Autore con id "${id}" già esistente` });
      return;
    }

    const author = await Author.create({
      id,
      nome: body.nome.trim(),
      birth_year: body.birth_year ?? null,
      death_year: body.death_year ?? null,
      bio_short: body.bio_short ?? null,
      wikipedia: body.wikipedia ?? null,
      projects: Array.isArray(body.projects)
        ? body.projects.map((p) => ({ projectId: p.projectId, rilevanza: p.rilevanza ?? '' }))
        : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      _last_edited_by: req.clerkUserId ?? null,
    });
    res.status(201).json({ author: author.toObject() });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── update ─────────────────────────────────────────────────────────────────

catalogAuthorsAdminRouter.patch('/:id', async (req: ClerkRequest, res: Response) => {
  try {
    const author = await Author.findOne({ id: req.params.id });
    if (!author) {
      res.status(404).json({ error: 'Autore non trovato' });
      return;
    }
    const body = req.body as Partial<{
      nome: string;
      birth_year: number | null;
      death_year: number | null;
      bio_short: string | null;
      wikipedia: string | null;
      projects: Array<{ projectId: string; rilevanza?: string }>;
      tags: string[];
    }>;

    if (body.nome !== undefined) author.nome = body.nome.trim();
    if (body.birth_year !== undefined) author.birth_year = body.birth_year;
    if (body.death_year !== undefined) author.death_year = body.death_year;
    if (body.bio_short !== undefined) author.bio_short = body.bio_short;
    if (body.wikipedia !== undefined) author.wikipedia = body.wikipedia;
    if (Array.isArray(body.projects)) {
      author.projects = body.projects.map((p) => ({
        projectId: p.projectId,
        rilevanza: p.rilevanza ?? '',
      }));
    }
    if (Array.isArray(body.tags)) author.tags = body.tags;

    author._last_edited_by = req.clerkUserId ?? null;
    await author.save();
    res.json({ author: author.toObject() });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── delete ─────────────────────────────────────────────────────────────────

catalogAuthorsAdminRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const author = await Author.findOne({ id: req.params.id });
    if (!author) {
      res.status(404).json({ error: 'Autore non trovato' });
      return;
    }
    const force = req.query.force === 'true';

    // Check capitoli che lo citano.
    const citingCount = await AssiChapter.countDocuments({ 'references.authorIds': author.id });
    if (citingCount > 0 && !force) {
      res.status(409).json({
        error: `Autore citato in ${citingCount} capitoli. Usa ?force=true per cancellare comunque.`,
        citing_count: citingCount,
      });
      return;
    }

    await removeCatalogImage(author.image_r2_key);
    await Author.deleteOne({ _id: author._id });
    res.json({ deleted: true, id: author.id, was_cited_in: citingCount });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── upload immagine ────────────────────────────────────────────────────────

catalogAuthorsAdminRouter.post(
  '/:id/image',
  upload.single('file'),
  async (req: ClerkRequest, res: Response) => {
    try {
      const author = await Author.findOne({ id: req.params.id });
      if (!author) {
        res.status(404).json({ error: 'Autore non trovato' });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: 'Campo multipart "file" mancante' });
        return;
      }
      let validated;
      try {
        validated = validateImageUpload(req.file);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
        return;
      }
      const { url, key } = await replaceCatalogImage(
        'authors',
        author.id,
        validated,
        author.image_r2_key,
      );
      author.image_url = url;
      author.image_r2_key = key;
      author._last_edited_by = req.clerkUserId ?? null;
      await author.save();
      res.json({ author: author.toObject() });
    } catch (err) {
      console.error('[catalog/authors] image upload error:', err);
      res.status(500).json({ error: (err as Error).message });
    }
  },
);

// ── delete immagine ────────────────────────────────────────────────────────

catalogAuthorsAdminRouter.delete('/:id/image', async (req: ClerkRequest, res: Response) => {
  try {
    const author = await Author.findOne({ id: req.params.id });
    if (!author) {
      res.status(404).json({ error: 'Autore non trovato' });
      return;
    }
    await removeCatalogImage(author.image_r2_key);
    author.image_url = null;
    author.image_r2_key = null;
    author._last_edited_by = req.clerkUserId ?? null;
    await author.save();
    res.json({ author: author.toObject() });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
