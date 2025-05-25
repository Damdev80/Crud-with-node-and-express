import express from 'express';
import ModelFactory from '../models/model-factory.js';
import { isAuthenticated, isLibrarianOrAdmin } from '../middlewares/auth.js';

const router = express.Router();
const Author = ModelFactory.Author;

// Obtener todos los autores
router.get('/', async (req, res) => {
  try {
    const authors = await Author.getAll();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener autor por ID
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.getById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Autor no encontrado' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nuevo autor - solo bibliotecarios y admins
router.post('/', isAuthenticated, isLibrarianOrAdmin, async (req, res) => {
  try {
    const newAuthor = await Author.create(req.body);
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar autor - solo bibliotecarios y admins
router.put('/:id', isAuthenticated, isLibrarianOrAdmin, async (req, res) => {
  try {
    const updated = await Author.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar autor - solo bibliotecarios y admins
router.delete('/:id', isAuthenticated, isLibrarianOrAdmin, async (req, res) => {
  try {
    const deleted = await Author.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Autor no encontrado' });
    res.json({ message: 'Autor eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener libros de un autor
router.get('/:id/books', async (req, res) => {
  try {
    const books = await Author.getBooks(req.params.id);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
