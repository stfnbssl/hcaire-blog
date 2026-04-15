import { Router } from 'express';
import { getConfig, updateConfig } from '../controllers/siteConfigController';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';

const router = Router();

router.get('/',  getConfig);
router.put('/',  authenticateClerk, requireAdmin, updateConfig);

export default router;
