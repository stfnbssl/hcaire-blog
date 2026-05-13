// Rotte admin per il rebuild degli Assi Strutturali.
//
//   POST   /api/admin/assi/rebuild            → crea execution + LPUSH comando, ritorna {execution_id}
//   GET    /api/admin/assi/rebuild            → lista ultime esecuzioni (paginazione semplice)
//   GET    /api/admin/assi/rebuild/:id        → stato della singola execution
//   GET    /api/admin/assi                    → lista dei 6 assi da Mongo
//   GET    /api/admin/assi/:axis_id           → singolo asse da Mongo

import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { authenticateClerk, requireAdmin, ClerkRequest } from '../middleware/clerkAuth';
import AssiRebuildExecution from '../models/AssiRebuildExecution';
import AsseStrutturale from '../models/AsseStrutturale';
import { getAssiMessageBus } from '../services/assiMessageBus';

export const assiAdminRouter = Router();

// Ogni rotta è protetta da Clerk + role:admin (come letture).
assiAdminRouter.use(authenticateClerk, requireAdmin);

// ─── rebuild ─────────────────────────────────────────────────────────────────

assiAdminRouter.post('/rebuild', async (req: ClerkRequest, res: Response) => {
  try {
    // Blocca rebuild concorrenti: se ce n'è già uno in_coda o in_esecuzione, restituisci 409.
    const existing = await AssiRebuildExecution.findOne({
      status: { $in: ['in_coda', 'in_esecuzione'] },
    }).select('_id status').lean();
    if (existing) {
      res.status(409).json({
        error: 'Esiste già un rebuild in corso',
        execution_id: String(existing._id),
        status: existing.status,
      });
      return;
    }

    const execution = await AssiRebuildExecution.create({
      status: 'in_coda',
      triggered_at: new Date(),
      triggered_by: req.clerkUserId ?? null,
      log_lines: [{ ts: new Date(), text: 'Rebuild messo in coda dall\'admin', level: 'info' }],
    });

    try {
      await getAssiMessageBus().sendRebuild(String(execution._id));
    } catch (err) {
      await AssiRebuildExecution.updateOne(
        { _id: execution._id },
        {
          $set: {
            status: 'fallito',
            completed_at: new Date(),
            error: `Pubblicazione comando Redis fallita: ${(err as Error).message}`,
          },
        },
      );
      res.status(502).json({ error: 'Impossibile pubblicare comando su Redis', detail: (err as Error).message });
      return;
    }

    res.status(202).json({
      execution_id: String(execution._id),
      status: execution.status,
      triggered_at: execution.triggered_at,
    });
  } catch (err) {
    console.error('[assi-route] POST /rebuild error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

assiAdminRouter.get('/rebuild', async (_req: Request, res: Response) => {
  try {
    const limit = 50;
    const items = await AssiRebuildExecution
      .find({}, { log_lines: 0 })
      .sort({ triggered_at: -1 })
      .limit(limit)
      .lean();
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

assiAdminRouter.get('/rebuild/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'execution_id non valido' });
      return;
    }
    const execution = await AssiRebuildExecution.findById(id).lean();
    if (!execution) {
      res.status(404).json({ error: 'Execution non trovata' });
      return;
    }
    res.json(execution);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── dati assi (read-only da Mongo) ──────────────────────────────────────────

assiAdminRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await AsseStrutturale.find({}).sort({ axis_id: 1 }).lean();
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

assiAdminRouter.get('/:axis_id', async (req: Request, res: Response) => {
  try {
    const { axis_id } = req.params;
    if (!/^asse_[1-6]$/.test(axis_id)) {
      res.status(400).json({ error: 'axis_id non valido (atteso asse_1..asse_6)' });
      return;
    }
    const asse = await AsseStrutturale.findOne({ axis_id }).lean();
    if (!asse) {
      res.status(404).json({ error: `Asse ${axis_id} non trovato — eseguire prima un rebuild` });
      return;
    }
    res.json(asse);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
