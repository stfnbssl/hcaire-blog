import { Request, Response } from 'express';
import Content from '../models/Content';

export const getAllContents = async (req: Request, res: Response): Promise<void> => {
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

export const getContentBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await Content.findOne({ slug: req.params.slug, isPublished: true });
    if (!content) {
      res.status(404).json({ error: 'Contenuto non trovato' });
      return;
    }
    res.json(content);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero del contenuto' });
  }
};

export const getAllContentsAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero dei contenuti' });
  }
};

export const createContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = new Content(req.body);
    await content.save();
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

export const updateContent = async (req: Request, res: Response): Promise<void> => {
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

export const deleteContent = async (req: Request, res: Response): Promise<void> => {
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
