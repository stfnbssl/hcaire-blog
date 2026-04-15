import { Response } from 'express';
import Content from '../models/Content';
import UserSubscription from '../models/UserSubscription';
import SiteConfig from '../models/SiteConfig';
import { logWorkflow } from '../services/workflowLogger';
import { ClerkRequest, checkIsAdmin } from '../middleware/clerkAuth';

export const getAllContents = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const page  = parseInt(req.query.page  as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip  = (page - 1) * limit;

    const [contents, total] = await Promise.all([
      Content.find({ isPublished: true })
        .select('-contenuto')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Content.countDocuments({ isPublished: true }),
    ]);

    res.json({
      data: contents,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ error: 'Errore nel recupero dei contenuti' });
  }
};

export const getContentBySlug = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const content = await Content.findOne({ slug: req.params.slug, isPublished: true });
    if (!content) {
      res.status(404).json({ error: 'Contenuto non trovato' });
      return;
    }

    if (content.accessType === 'plus') {
      // In modalità test il contenuto è sempre visibile (locked rimane true per il banner)
      const siteConfig = await SiteConfig.findOne();
      const isTestMode = !siteConfig || siteConfig.status === 'test';

      if (isTestMode) {
        res.json({ ...content.toObject(), locked: true });
        return;
      }

      let hasAccess = false;
      if (req.clerkUserId) {
        const [sub, isAdmin] = await Promise.all([
          UserSubscription.findOne({ clerkUserId: req.clerkUserId }),
          checkIsAdmin(req.clerkUserId),
        ]);
        hasAccess = isAdmin || (!!sub && ['active', 'on_trial'].includes(sub.status));
      }
      if (!hasAccess) {
        const teaser = content.toObject();
        teaser.contenuto = '';
        res.json({ ...teaser, locked: true });
        return;
      }
    }

    res.json(content);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero del contenuto' });
  }
};

export const getAllContentsAdmin = async (_req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero dei contenuti' });
  }
};

export const createContent = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const content = new Content(req.body);
    await content.save();

    const articleRequestId = req.body.articleRequestId as string | undefined;
    if (articleRequestId) {
      await logWorkflow(
        articleRequestId,
        'article_published',
        'server',
        `Articolo pubblicato: slug="${content.slug}", titolo="${content.titolo}"`,
        'done'
      );
    }

    res.status(201).json(content);
  } catch (error: unknown) {
    const mongoError = error as { code?: number };
    if (mongoError.code === 11000) {
      res.status(400).json({ error: 'Slug già esistente' });
    } else {
      res.status(500).json({ error: 'Errore nella creazione del contenuto' });
    }
  }
};

export const updateContent = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!content) {
      res.status(404).json({ error: 'Contenuto non trovato' });
      return;
    }
    res.json(content);
  } catch {
    res.status(500).json({ error: 'Errore nella modifica del contenuto' });
  }
};

export const deleteContent = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      res.status(404).json({ error: 'Contenuto non trovato' });
      return;
    }
    res.json({ message: 'Contenuto eliminato' });
  } catch {
    res.status(500).json({ error: 'Errore nell\'eliminazione del contenuto' });
  }
};
