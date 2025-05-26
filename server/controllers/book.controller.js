import ModelFactory from '../models/model-factory.js';
import imageStorage from '../utils/imageStorage.js';

const Book = ModelFactory.Book;
const Author = ModelFactory.Author;
const Category = ModelFactory.Category;
const Editorial = ModelFactory.Editorial;

// Obtener todos los libros (con detalles)
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAllWithDetails();
    
    // Verificar si las imágenes existen y agregar URLs completas
    const booksWithImageStatus = books.map(book => ({
      ...book,
      cover_image_url: book.cover_image ? imageStorage.getImageUrl(book.cover_image, req.protocol + '://' + req.get('host')) : null,
      image_exists: book.cover_image ? imageStorage.imageExists(book.cover_image) : false
    }));
    
    res.status(200).json({ success: true, data: booksWithImageStatus });
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
    // Obtener detalles de editorial
    let editorial = null;
    if (book.editorial_id) {
      editorial = await Editorial.getById(book.editorial_id);
    }    // Estructura enriquecida con información de imagen
    const bookWithDetails = {
      ...book,
      author: author ? { name: `${author.first_name}${author.last_name ? ' ' + author.last_name : ''}` } : null,
      category: category ? { name: category.name } : null,
      editorial: editorial ? { name: editorial.name } : null,
      cover_image_url: book.cover_image ? imageStorage.getImageUrl(book.cover_image, req.protocol + '://' + req.get('host')) : null,
      image_exists: book.cover_image ? imageStorage.imageExists(book.cover_image) : false
    };

    res.json({ success: true, data: bookWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener libro', error: error.message });
  }
};

// Crear libro
export const createBook = async (req, res) => {
  try {
    // Accept either IDs or names from the frontend
    const {
      title,
      description,
      publication_year,
      isbn,
      available_copies,
      author_id,
      category_id,
      editorial_id
    } = req.body;
    const coverImagePath = req.file ? req.file.filename : null;

    // Determine author ID
    let authId = author_id;
    if (!authId && req.body.author_name) {
      const author = await Author.findOrCreateByName(req.body.author_name);
      authId = author.author_id;
    }
    // Determine category ID
    let catId = category_id;
    if (!catId && req.body.category_name) {
      const category = await Category.findOrCreateByName(req.body.category_name);
      catId = category.category_id;
    }
    // Determine editorial ID
    let edId = editorial_id;
    if (!edId && req.body.editorial_name) {
      const editorial = await Editorial.findOrCreateByName(req.body.editorial_name);
      edId = editorial.editorial_id;
    }    // Create the book record
    const newBook = await Book.create({
      title,
      description,
      publication_year,
      isbn,
      available_copies,
      author_id: authId,
      category_id: catId,
      editorial_id: edId || null,
      cover_image: coverImagePath,
    });

    // Log image upload success
    if (coverImagePath) {
      console.log(`📸 Image uploaded for book "${title}": ${coverImagePath}`);
    }

    res.status(201).json({
      success: true,
      message: 'Libro creado con éxito',
      data: {
        ...newBook,
        cover_image_url: coverImagePath ? imageStorage.getImageUrl(coverImagePath, req.protocol + '://' + req.get('host')) : null
      },
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
      coverImagePath = req.file.filename;
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
