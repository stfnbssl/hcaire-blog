import { Request, Response } from 'express';
import ArticleRequest, { LogActor, LogStep } from '../models/ArticleRequest';

export const getAllArticleRequests = async (_req: Request, res: Response): Promise<void> => {
  try {
    const requests = await ArticleRequest.find().sort({ createdAt: -1 }).limit(100);
    res.json(requests);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero delle richieste' });
  }
};

export const getArticleRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = await ArticleRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ error: 'Richiesta non trovata' });
      return;
    }
    res.json(request);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero della richiesta' });
  }
};

export const addLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { step, message, actor, status } = req.body as {
      step: LogStep;
      message: string;
      actor: LogActor;
      status?: string;
    };

    const update: Record<string, unknown> = {
      $push: { logs: { timestamp: new Date(), step, message, actor } },
    };
    if (status) update['$set'] = { status };

    const request = await ArticleRequest.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!request) {
      res.status(404).json({ error: 'Richiesta non trovata' });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Errore aggiunta log' });
  }
};
