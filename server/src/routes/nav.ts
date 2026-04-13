import { Router, Request, Response } from 'express';
import Navigation from '../models/Navigation';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await Navigation.find({ isVisible: true }).sort({ order: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Errore nel recupero della navigazione' });
  }
});

export default router;
