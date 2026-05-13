// Rotte admin per il catalogo libri (specchio di catalogAuthors.ts).

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticateClerk, requireAdmin, ClerkRequest } from '../middleware/clerkAuth';
import Book from '../models/Book';
import AssiChapter from '../models/AssiChapter';
import {
  slugify,
  validateImageUpload,
  replaceCatalogImage,
  removeCatalogImage,
} from '../services/catalogService';

export const catalogBooksAdminRouter = Router();

catalogBooksAdminRouter.use(authenticateClerk, requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
});

// ── lista ──────────────────────────────────────────────────────────────────

catalogBooksAdminRouter.get('/', async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const project = typeof req.query.project === 'string' ? req.query.project : '';
    const tag = typeof req.query.tag === 'string' ? req.query.tag : '';
    const autore = typeof req.query.autore === 'string' ? req.query.autore : '';
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const skip = Number(req.query.skip) || 0;

    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { titolo: { $regex: q, $options: 'i' } },
        { id: { $regex: q, $options: 'i' } },
        { titolo_originale: { $regex: q, $options: 'i' } },
      ];
    }
    if (project) filter['projects.projectId'] = project;
    if (tag) filter.tags = tag;
    if (autore) filter.autoreIds = autore;

    const [items, total] = await Promise.all([
      Book.find(filter).sort({ titolo: 1 }).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);
    res.json({ items, total, limit, skip });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── singolo ────────────────────────────────────────────────────────────────

catalogBooksAdminRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const book = await Book.findOne({ id: req.params.id }).lean();
    if (!book) {
      res.status(404).json({ error: 'Libro non trovato' });
      return;
    }
    const citing = await AssiChapter
      .find({ 'references.bookIds': book.id }, { axis_slug: 1, slug: 1, title: 1, axis_number: 1, chapter_number: 1 })
      .sort({ axis_number: 1, chapter_number: 1 })
      .lean();
    res.json({ book, citing });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── crea ───────────────────────────────────────────────────────────────────

catalogBooksAdminRouter.post('/', async (req: ClerkRequest, res: Response) => {
  try {
    const body = req.body as {
      id?: string;
      titolo?: string;
      titolo_originale?: string | null;
      autoreIds?: string[];
      anno?: number | null;
      editore?: string | null;
      projects?: Array<{ projectId: string; rilevanza?: string }>;
      tags?: string[];
    };

    if (!body.titolo || typeof body.titolo !== 'string') {
      res.status(400).json({ error: 'Campo "titolo" obbligatorio' });
      return;
    }
    const id = (body.id && body.id.trim()) || slugify(body.titolo);
    if (!id) {
      res.status(400).json({ error: 'Impossibile derivare uno slug valido dal titolo' });
      return;
    }
    const existing = await Book.findOne({ id }).lean();
    if (existing) {
      res.status(409).json({ error: `Libro con id "${id}" già esistente` });
      return;
    }

    const book = await Book.create({
      id,
      titolo: body.titolo.trim(),
      titolo_originale: body.titolo_originale ?? null,
      autoreIds: Array.isArray(body.autoreIds) ? body.autoreIds : [],
      anno: body.anno ?? null,
      editore: body.editore ?? null,
      projects: Array.isArray(body.projects)
        ? body.projects.map((p) => ({ projectId: p.projectId, rilevanza: p.rilevanza ?? '' }))
        : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      _last_edited_by: req.clerkUserId ?? null,
    });
    res.status(201).json({ book: book.toObject() });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── update ─────────────────────────────────────────────────────────────────

catalogBooksAdminRouter.patch('/:id', async (req: ClerkRequest, res: Response) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      res.status(404).json({ error: 'Libro non trovato' });
      return;
    }
    const body = req.body as Partial<{
      titolo: string;
      titolo_originale: string | null;
      autoreIds: string[];
      anno: number | null;
      editore: string | null;
      projects: Array<{ projectId: string; rilevanza?: string }>;
      tags: string[];
    }>;

    if (body.titolo !== undefined) book.titolo = body.titolo.trim();
    if (body.titolo_originale !== undefined) book.titolo_originale = body.titolo_originale;
    if (Array.isArray(body.autoreIds)) book.autoreIds = body.autoreIds;
    if (body.anno !== undefined) book.anno = body.anno;
    if (body.editore !== undefined) book.editore = body.editore;
    if (Array.isArray(body.projects)) {
      book.projects = body.projects.map((p) => ({
        projectId: p.projectId,
        rilevanza: p.rilevanza ?? '',
      }));
    }
    if (Array.isArray(body.tags)) book.tags = body.tags;

    book._last_edited_by = req.clerkUserId ?? null;
    await book.save();
    res.json({ book: book.toObject() });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── delete ─────────────────────────────────────────────────────────────────

catalogBooksAdminRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      res.status(404).json({ error: 'Libro non trovato' });
      return;
    }
    const force = req.query.force === 'true';

    const citingCount = await AssiChapter.countDocuments({ 'references.bookIds': book.id });
    if (citingCount > 0 && !force) {
      res.status(409).json({
        error: `Libro citato in ${citingCount} capitoli. Usa ?force=true per cancellare comunque.`,
        citing_count: citingCount,
      });
      return;
    }

    await removeCatalogImage(book.cover_r2_key);
    await Book.deleteOne({ _id: book._id });
    res.json({ deleted: true, id: book.id, was_cited_in: citingCount });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── upload cover ───────────────────────────────────────────────────────────

catalogBooksAdminRouter.post(
  '/:id/image',
  upload.single('file'),
  async (req: ClerkRequest, res: Response) => {
    try {
      const book = await Book.findOne({ id: req.params.id });
      if (!book) {
        res.status(404).json({ error: 'Libro non trovato' });
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
      const { url, key } = await replaceCatalogImage('books', book.id, validated, book.cover_r2_key);
      book.cover_url = url;
      book.cover_r2_key = key;
      book._last_edited_by = req.clerkUserId ?? null;
      await book.save();
      res.json({ book: book.toObject() });
    } catch (err) {
      console.error('[catalog/books] image upload error:', err);
      res.status(500).json({ error: (err as Error).message });
    }
  },
);

// ── delete cover ───────────────────────────────────────────────────────────

catalogBooksAdminRouter.delete('/:id/image', async (req: ClerkRequest, res: Response) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      res.status(404).json({ error: 'Libro non trovato' });
      return;
    }
    await removeCatalogImage(book.cover_r2_key);
    book.cover_url = null;
    book.cover_r2_key = null;
    book._last_edited_by = req.clerkUserId ?? null;
    await book.save();
    res.json({ book: book.toObject() });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
