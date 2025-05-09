import Book from '../models/book.model.js';
import Author from '../models/author.model.js';
import Category from '../models/category.model.js';

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
    // Obtener el libro base
    const book = await Book.getById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Libro no encontrado' });

    // Obtener detalles de autor
    let author = null;
    if (book.author_id) {
      author = await Author.getById(book.author_id);
    }
    // Obtener detalles de categoría
    let category = null;
    if (book.category_id) {
      category = await Category.getById(book.category_id);
    }

    // Estructura enriquecida
    const bookWithDetails = {
      ...book,
      author: author ? { name: `${author.first_name}${author.last_name ? ' ' + author.last_name : ''}` } : null,
      category: category ? { name: category.name } : null,
    };

    res.json({ success: true, data: bookWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener libro', error: error.message });
  }
};

// Crear libro
export const createBook = async (req, res) => {
  try {
    // Recibe nombres en vez de IDs
    const { title, description, publication_date, author_name, category_name, publication_year, isbn, available_copies } = req.body;
    const coverImagePath = req.file ? req.file.filename : null;

    // Buscar o crear autor y categoría
    const author = await Author.findOrCreateByName(author_name);
    const category = await Category.findOrCreateByName(category_name);

    // Crear el libro con los IDs obtenidos
    const newBook = await Book.create({
      title,
      description,
      publication_date,
      publication_year,
      isbn,
      available_copies,
      author_id: author.author_id,
      category_id: category.category_id,
      cover_image: coverImagePath,
    });

    res.status(201).json({
      success: true,
      message: 'Libro creado con éxito',
      data: newBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear libro',
      error: error.message,
    });
  }
};

// Actualizar libro
export const updateBook = async (req, res) => {
  try {
    // Si se sube una nueva imagen, actualiza la ruta
    let coverImagePath = req.body.cover_image;
    if (req.file) {
      coverImagePath = `/uploads/${req.file.filename}`;
    }
    const updated = await Book.update(req.params.id, {
      ...req.body,
      cover_image: coverImagePath
    });
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
