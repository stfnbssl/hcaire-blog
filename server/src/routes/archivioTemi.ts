// Router dell'Archivio temi (vedi docs/90-todo/laboratorio-d5b-backend.md §12).
// CRUD admin sui temi candidati + endpoint di promozione (transizione di stato
// `maturo → promosso`). Tutti gli endpoint richiedono ruolo admin.

import { Router } from 'express';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';
import {
  listTemi,
  getTema,
  createTema,
  updateTema,
  deleteTema,
  promuoveTema,
} from '../controllers/archivioTemiController';

const router = Router();

router.use(authenticateClerk, requireAdmin);

router.get('/',                    listTemi);
router.post('/',                   createTema);
router.get('/:temaId',             getTema);
router.put('/:temaId',             updateTema);
router.delete('/:temaId',          deleteTema);
router.post('/:temaId/promuovi',   promuoveTema);

export default router;
