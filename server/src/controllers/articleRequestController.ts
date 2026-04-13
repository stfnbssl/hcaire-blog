import { Request, Response } from 'express';
import ArticleRequest from '../models/ArticleRequest';
import WorkflowLog from '../models/WorkflowLog';
import type { LogStep, LogActor } from '../models/ArticleRequest';

export const getAllArticleRequests = async (_req: Request, res: Response): Promise<void> => {
  try {
    const requests = await ArticleRequest.find().sort({ createdAt: -1 }).limit(100);
    res.json(requests);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero delle richieste' });
  }
};

export const getAllWorkflowLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 200;
    const logs  = await WorkflowLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(logs);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero dei log' });
  }
};

export const addWorkflowLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { step, actor, message, requestStatus } = req.body as {
      step: LogStep;
      actor: LogActor;
      message: string;
      requestStatus?: string;
    };
    const articleRequestId = req.params.id;

    const request = await ArticleRequest.findById(articleRequestId).select('testo status');
    if (!request) {
      res.status(404).json({ error: 'ArticleRequest non trovata' });
      return;
    }

    const testoPreview = request.testo.length > 80
      ? request.testo.slice(0, 80) + '…'
      : request.testo;

    const finalStatus = requestStatus ?? request.status;

    await Promise.all([
      WorkflowLog.create({ articleRequestId, testoPreview, step, actor, message, requestStatus: finalStatus }),
      requestStatus ? ArticleRequest.findByIdAndUpdate(articleRequestId, { status: requestStatus }) : Promise.resolve(),
    ]);

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Errore aggiunta log' });
  }
};
