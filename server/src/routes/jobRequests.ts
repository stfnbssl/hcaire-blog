import { Router } from 'express';
import {
  listJobRequests,
  getJobRequest,
  createJobRequest,
  deleteJobRequest,
} from '../controllers/jobRequestsController';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';

const router = Router();

router.use(authenticateClerk, requireAdmin);

router.get('/',        listJobRequests);
router.get('/:id',     getJobRequest);
router.post('/',       createJobRequest);
router.delete('/:id',  deleteJobRequest);

export default router;
