import express from 'express';
import Category from '../models/category.model.js';
import { isAuthenticated, isLibrarianOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', isAuthenticated, isLibrarianOrAdmin, async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', isAuthenticated, isLibrarianOrAdmin, async (req, res) => {
  try {
    const updated = await Category.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', isAuthenticated, isLibrarianOrAdmin, async (req, res) => {
  try {
    const deleted = await Category.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/books', async (req, res) => {
  try {
    const books = await Category.getBooks(req.params.id);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
