import { Router } from 'express';
import {
  listPublic,
  listAdmin,
  createKey,
  updateKey,
  deleteKey,
  syncFromDefaults,
} from '../controllers/siteContentController';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';

// Pubblico — usato dal frontend al boot per caricare tutte le stringhe
const publicRouter = Router();
publicRouter.get('/', listPublic);

// Admin — CRUD per gestione testi
const adminRouter = Router();
adminRouter.use(authenticateClerk, requireAdmin);
adminRouter.get('/',         listAdmin);
adminRouter.post('/sync',    syncFromDefaults);
adminRouter.post('/',        createKey);
adminRouter.put('/:key',     updateKey);
adminRouter.delete('/:key',  deleteKey);

export { publicRouter as siteContentPublicRouter, adminRouter as siteContentAdminRouter };
