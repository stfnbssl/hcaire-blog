import { Router } from 'express';
import { getAllArticleRequests, getAllWorkflowLogs, addWorkflowLog } from '../controllers/articleRequestController';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';
import { authenticateApiKey } from '../middleware/apiKeyAuth';

const router = Router();

router.get('/',          authenticateClerk, requireAdmin, getAllArticleRequests);
router.get('/logs',      authenticateClerk, requireAdmin, getAllWorkflowLogs);
router.post('/:id/log',  authenticateApiKey, addWorkflowLog);

export default router;
