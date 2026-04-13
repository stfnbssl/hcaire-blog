import { Router } from 'express';
import { getAllArticleRequests, getArticleRequestById, addLog } from '../controllers/articleRequestController';
import { authenticateToken } from '../middleware/auth';
import { authenticateApiKey } from '../middleware/apiKeyAuth';

const router = Router();

router.get('/',      authenticateToken, getAllArticleRequests);
router.get('/:id',   authenticateToken, getArticleRequestById);
router.post('/:id/log', authenticateApiKey, addLog);

export default router;
