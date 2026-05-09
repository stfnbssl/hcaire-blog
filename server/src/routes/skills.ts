import { Router } from 'express';
import {
  listSkills,
  getSkill,
  createSkill,
  updateSkill,
  toggleSkill,
  deleteSkill,
} from '../controllers/skillsController';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';

const router = Router();

router.use(authenticateClerk, requireAdmin);

router.get('/',              listSkills);
router.get('/:id',           getSkill);
router.post('/',             createSkill);
router.put('/:id',           updateSkill);
router.patch('/:id/toggle',  toggleSkill);
router.delete('/:id',        deleteSkill);

export default router;
