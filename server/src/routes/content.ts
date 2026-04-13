import { Router } from 'express';
import {
  getAllContents,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  getAllContentsAdmin,
} from '../controllers/contentController';
import { authenticateToken } from '../middleware/auth';
import { authenticateApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// IMPORTANTE: /admin prima di /:slug per evitare conflitti di route
router.get('/',        getAllContents);
router.get('/admin',   authenticateToken, getAllContentsAdmin);
router.get('/:slug',   getContentBySlug);
router.post('/',       authenticateToken, createContent);
router.post('/import', authenticateApiKey, createContent);
router.put('/:id',     authenticateToken, updateContent);
router.delete('/:id',  authenticateToken, deleteContent);

export default router;
