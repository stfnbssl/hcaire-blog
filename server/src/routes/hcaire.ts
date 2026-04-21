import { Router } from 'express';
import { getHcaireIndex, getHcaireSection, getHcaireSubsection } from '../controllers/hcaireController';

const router = Router();

router.get('/', getHcaireIndex);
router.get('/:section/:subsection', getHcaireSubsection);
router.get('/:section', getHcaireSection);

export default router;
