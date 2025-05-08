import express from 'express';
import upload from '../middlewares/upload.js';
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from '../controllers/book.controller.js';

const router = express.Router();

// Ruta para obtener todos los libros
router.get('/', getAllBooks);

// Ruta para obtener un libro por ID
router.get('/:id', getBookById);

// Ruta para crear un libro con imagen
router.post('/with-image', upload.single('cover_image'), createBook);

// Ruta para crear un libro sin imagen (función ya existente)
router.post('/', createBook);

// Ruta para actualizar un libro (con o sin imagen)
router.put('/:id', upload.single('cover_image'), updateBook);

// Ruta para eliminar un libro
router.delete('/:id', deleteBook);

// Rutas para obtener información del autor o categoría de un libro
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
