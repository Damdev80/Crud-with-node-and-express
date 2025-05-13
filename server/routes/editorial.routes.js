import express from 'express';
import {
  getAllEditorials,
  getEditorialById,
  createEditorial,
  updateEditorial,
  deleteEditorial
} from '../controllers/editorial.controller.js';

const router = express.Router();

router.get('/', getAllEditorials);
router.get('/:id', getEditorialById);
router.post('/', createEditorial);
router.put('/:id', updateEditorial);
router.delete('/:id', deleteEditorial);

export default router;
