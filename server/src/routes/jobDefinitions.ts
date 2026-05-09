import { Router } from 'express';
import {
  listJobDefinitions,
  getJobDefinition,
  createJobDefinition,
  updateJobDefinition,
  deleteJobDefinition,
} from '../controllers/jobDefinitionsController';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';

const router = Router();

router.use(authenticateClerk, requireAdmin);

router.get('/',        listJobDefinitions);
router.get('/:id',     getJobDefinition);
router.post('/',       createJobDefinition);
router.put('/:id',     updateJobDefinition);
router.delete('/:id',  deleteJobDefinition);

export default router;
