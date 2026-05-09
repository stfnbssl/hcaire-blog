import { Router } from 'express';
import {
  listPlugins,
  getPlugin,
  createPlugin,
  updatePlugin,
  togglePlugin,
  deletePlugin,
} from '../controllers/pluginsController';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';

const router = Router();

router.use(authenticateClerk, requireAdmin);

router.get('/',              listPlugins);
router.get('/:id',           getPlugin);
router.post('/',             createPlugin);
router.put('/:id',           updatePlugin);
router.patch('/:id/toggle',  togglePlugin);
router.delete('/:id',        deletePlugin);

export default router;
