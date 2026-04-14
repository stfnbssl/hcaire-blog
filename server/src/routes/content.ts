import { Router } from 'express';
import {
  getAllContents,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  getAllContentsAdmin,
} from '../controllers/contentController';
import { authenticateClerk, requireAdmin, optionalClerkAuth } from '../middleware/clerkAuth';
import { authenticateApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// IMPORTANTE: /admin prima di /:slug per evitare conflitti di route
router.get('/',        getAllContents);
router.get('/admin',   authenticateClerk, requireAdmin, getAllContentsAdmin);
router.get('/:slug',   optionalClerkAuth, getContentBySlug);
router.post('/',       authenticateClerk, requireAdmin, createContent);
router.post('/import', authenticateApiKey, createContent);
router.put('/:id',     authenticateClerk, requireAdmin, updateContent);
router.delete('/:id',  authenticateClerk, requireAdmin, deleteContent);

export default router;
