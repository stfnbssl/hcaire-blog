import { Router } from 'express';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';
import {
  listOperePubbliche,
  getOperaPubblica,
  listOpereAdmin,
  getOperaAdmin,
  createOpera,
  updateOpera,
  deleteOpera,
  runStep,
  getStep,
} from '../controllers/lettureController';

const router = Router();

// ─── pubblici ────────────────────────────────────────────────────────────────
router.get('/', listOperePubbliche);
router.get('/:slug', getOperaPubblica);

export default router;

// ─── admin ───────────────────────────────────────────────────────────────────
// Esposti su un router separato per montaggio sotto /api/admin/letture.
export const lettureAdminRouter = Router();

lettureAdminRouter.get('/',          authenticateClerk, requireAdmin, listOpereAdmin);
lettureAdminRouter.post('/',         authenticateClerk, requireAdmin, createOpera);
lettureAdminRouter.get('/:slug',     authenticateClerk, requireAdmin, getOperaAdmin);
lettureAdminRouter.patch('/:slug',   authenticateClerk, requireAdmin, updateOpera);
lettureAdminRouter.delete('/:slug',  authenticateClerk, requireAdmin, deleteOpera);

lettureAdminRouter.post('/:slug/steps/:step_id/run', authenticateClerk, requireAdmin, runStep);
lettureAdminRouter.get('/:slug/steps/:step_id',      authenticateClerk, requireAdmin, getStep);
