import { Router } from 'express';
import { getStatus, createCheckout, getPortalUrl, syncSubscription, changePlan } from '../controllers/subscriptionController';
import { authenticateClerk } from '../middleware/clerkAuth';

const router = Router();

router.get('/status',    authenticateClerk, getStatus);
router.post('/checkout', authenticateClerk, createCheckout);
router.post('/portal',   authenticateClerk, getPortalUrl);
router.post('/sync',        authenticateClerk, syncSubscription);
router.post('/change-plan', authenticateClerk, changePlan);

export default router;
