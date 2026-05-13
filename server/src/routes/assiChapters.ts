// Rotte admin per i capitoli degli assi strutturali.
//
//   GET    /api/admin/assi-chapters                  → lista (filtrabile per axis_slug)
//   GET    /api/admin/assi-chapters/:axis_slug/:slug → singolo
//   PATCH  /api/admin/assi-chapters/:axis_slug/:slug → update body/title/references/footnotes
//   POST   /api/admin/assi-chapters/export-all       → rigenera tutti i .md da Mongo

import { Router, Request, Response } from 'express';
import path from 'path';
import { authenticateClerk, requireAdmin, ClerkRequest } from '../middleware/clerkAuth';
import AssiChapter from '../models/AssiChapter';
import { updateChapterContent, validateReferences } from '../services/assiChaptersService';
import { exportChapterToMd } from '../scripts/exportAssiChapterToMd';

export const assiChaptersAdminRouter = Router();

assiChaptersAdminRouter.use(authenticateClerk, requireAdmin);

// ── lista ──────────────────────────────────────────────────────────────────

assiChaptersAdminRouter.get('/', async (req: Request, res: Response) => {
  try {
    const axisSlug = typeof req.query.axis === 'string' ? req.query.axis : undefined;
    const filter = axisSlug ? { axis_slug: axisSlug } : {};
    const items = await AssiChapter
      .find(filter, { body: 0, references: 0, footnotes: 0 })
      .sort({ axis_number: 1, order: 1 })
      .lean();
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── singolo ────────────────────────────────────────────────────────────────

assiChaptersAdminRouter.get('/:axis_slug/:slug', async (req: Request, res: Response) => {
  try {
    const { axis_slug, slug } = req.params;
    const chapter = await AssiChapter.findOne({ axis_slug, slug }).lean();
    if (!chapter) {
      res.status(404).json({ error: 'Capitolo non trovato' });
      return;
    }
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── update ─────────────────────────────────────────────────────────────────

assiChaptersAdminRouter.patch('/:axis_slug/:slug', async (req: ClerkRequest, res: Response) => {
  try {
    const { axis_slug, slug } = req.params;
    const body = req.body as {
      body?: string;
      title?: string;
      references?: unknown;
      footnotes?: unknown;
      is_published?: boolean;
    };

    // Type narrowing minimale degli array — validazione di forma più fine la fa Mongoose.
    if (body.references !== undefined && !Array.isArray(body.references)) {
      res.status(400).json({ error: 'references deve essere un array' });
      return;
    }
    if (body.footnotes !== undefined && !Array.isArray(body.footnotes)) {
      res.status(400).json({ error: 'footnotes deve essere un array' });
      return;
    }

    try {
      const result = await updateChapterContent(
        axis_slug,
        slug,
        {
          body: body.body,
          title: body.title,
          references: body.references as never,
          footnotes: body.footnotes as never,
          is_published: body.is_published,
        },
        req.clerkUserId ?? null,
      );
      res.json({
        chapter: result.chapter.toObject(),
        exported_to: result.exported_to ? path.relative(process.cwd(), result.exported_to) : null,
        export_error: result.export_error,
      });
    } catch (err) {
      const e = err as Error & { issues?: unknown };
      if (e.message === 'Capitolo non trovato') {
        res.status(404).json({ error: e.message });
        return;
      }
      // Validation issues: 400 con dettaglio
      if (e.issues) {
        res.status(400).json({ error: e.message, issues: e.issues });
        return;
      }
      throw err;
    }
  } catch (err) {
    console.error('[assi-chapters] PATCH error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── validate-only ──────────────────────────────────────────────────────────

assiChaptersAdminRouter.post('/:axis_slug/:slug/validate', async (req: Request, res: Response) => {
  try {
    const { axis_slug, slug } = req.params;
    const existing = await AssiChapter.findOne({ axis_slug, slug }).lean();
    if (!existing) {
      res.status(404).json({ error: 'Capitolo non trovato' });
      return;
    }
    const body = req.body as { body?: string; references?: unknown; footnotes?: unknown };
    const finalBody = typeof body.body === 'string' ? body.body : existing.body;
    const finalRefs = Array.isArray(body.references) ? body.references : existing.references;
    const finalFootnotes = Array.isArray(body.footnotes) ? body.footnotes : existing.footnotes;
    const issues = validateReferences(finalBody, finalRefs as never, finalFootnotes as never);
    res.json({ valid: issues.filter((i) =>
      i.kind === 'missing_ref' || i.kind === 'missing_footnote' ||
      i.kind === 'duplicate_ref' || i.kind === 'duplicate_footnote',
    ).length === 0, issues });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── export-all (rigenera .md da Mongo) ─────────────────────────────────────

assiChaptersAdminRouter.post('/export-all', async (_req: Request, res: Response) => {
  try {
    const chapters = await AssiChapter.find({}).sort({ axis_number: 1, order: 1 });
    const exported: string[] = [];
    const errors: { slug: string; error: string }[] = [];
    for (const c of chapters) {
      try {
        const out = await exportChapterToMd(c);
        exported.push(path.relative(process.cwd(), out));
      } catch (err) {
        errors.push({ slug: `${c.axis_slug}/${c.slug}`, error: (err as Error).message });
      }
    }
    res.json({ exported_count: exported.length, exported, errors });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
