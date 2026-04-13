import { Router } from 'express';
import { getStatus, createCheckout, getPortalUrl } from '../controllers/subscriptionController';
import { authenticateClerk } from '../middleware/clerkAuth';

const router = Router();

router.get('/status',   authenticateClerk, getStatus);
router.post('/checkout', authenticateClerk, createCheckout);
router.post('/portal',   authenticateClerk, getPortalUrl);

export default router;
