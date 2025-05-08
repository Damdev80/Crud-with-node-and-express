import express from 'express';
import Book from '../models/book.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await Book.getAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/with-image', upload.single('cover'), createBookWithImage);

router.post('/', async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Book.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/author', async (req, res) => {
  try {
    const author = await Book.getAuthor(req.params.id);
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/category', async (req, res) => {
  try {
    const category = await Book.getCategory(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
