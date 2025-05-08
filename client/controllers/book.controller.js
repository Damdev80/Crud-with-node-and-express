import Book from '../models/book.model.js';

// Obtener todos los libros (con detalles)
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAllWithDetails();
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener libros', error: error.message });
  }
};

// Obtener libro por ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener libro', error: error.message });
  }
};

// Crear libro
export const createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear libro', error: error.message });
  }
};

// Actualizar libro
export const updateBook = async (req, res) => {
  try {
    const updated = await Book.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'No se actualizó (no existe)' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar libro', error: error.message });
  }
};

// Eliminar libro
export const deleteBook = async (req, res) => {
  try {
    const ok = await Book.delete(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'No se encontró libro para eliminar' });
    res.json({ success: true, message: 'Libro eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar libro', error: error.message });
  }
};
