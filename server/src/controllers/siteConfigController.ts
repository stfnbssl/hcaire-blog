import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import SiteConfig, { type SiteStatus } from '../models/SiteConfig';
import type { ClerkRequest } from '../middleware/clerkAuth';

// GET /api/site-config  — pubblico, usato dal frontend per sapere la modalità
export const getConfig = async (_req: Request, res: Response): Promise<void> => {
  try {
    const config = await SiteConfig.findOne();
    res.json({ status: config?.status ?? 'test' });
  } catch {
    res.status(500).json({ error: 'Errore recupero configurazione' });
  }
};

// PUT /api/site-config  — solo admin
export const updateConfig = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  const { status } = req.body as { status?: SiteStatus };

  if (!status || !['test', 'production'].includes(status)) {
    res.status(400).json({ error: 'Status non valido. Valori: test | production' });
    return;
  }

  try {
    const config = await SiteConfig.findOneAndUpdate(
      {},
      { $set: { status, updatedBy: userId ?? '' } },
      { upsert: true, new: true }
    );
    console.log(`[SiteConfig] Status aggiornato a "${status}" da ${userId}`);
    res.json({ status: config.status });
  } catch {
    res.status(500).json({ error: 'Errore aggiornamento configurazione' });
  }
};
