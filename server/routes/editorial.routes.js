import express from 'express';
import {
  getAllEditorials,
  getEditorialById,
  createEditorial,
  updateEditorial,
  deleteEditorial
} from '../controllers/editorial.controller.js';
import { isAuthenticated, isLibrarianOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllEditorials);
router.get('/:id', getEditorialById);
router.post('/', isAuthenticated, isLibrarianOrAdmin, createEditorial);
router.put('/:id', isAuthenticated, isLibrarianOrAdmin, updateEditorial);
router.delete('/:id', isAuthenticated, isLibrarianOrAdmin, deleteEditorial);

export default router;
