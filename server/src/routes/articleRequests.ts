import { Router } from 'express';
import { getAllArticleRequests, getAllWorkflowLogs, addWorkflowLog } from '../controllers/articleRequestController';
import { authenticateToken } from '../middleware/auth';
import { authenticateApiKey } from '../middleware/apiKeyAuth';

const router = Router();

router.get('/',          authenticateToken, getAllArticleRequests);
router.get('/logs',      authenticateToken, getAllWorkflowLogs);
router.post('/:id/log',  authenticateApiKey, addWorkflowLog);

export default router;
