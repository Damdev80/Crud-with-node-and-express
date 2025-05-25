// server/models/turso-book.model.js
import { createTursoModel } from '../config/turso-adapter.js';

// Define allowed fields for creating/updating books
const allowedFields = [
  'title',
  'author_id',
  'category_id',
  'editorial_id',
  'publication_year',
  'isbn',
  'available_copies',
  'description',
  'cover_image'
];

// Create the Turso-adapted book model
const bookModel = createTursoModel('books', 'book_id', allowedFields);

// Extended functionality for book model
const TursoBook = {
  ...bookModel,
  
  /**
   * Get books with author, category and editorial information
   * @returns {Promise<Array>} - Books with related data
   */
  getAllWithDetails: async function() {
    const result = await bookModel.raw(`
      SELECT b.*, 
             a.first_name, a.last_name,
             c.name as category_name,
             e.name as editorial_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN editorials e ON b.editorial_id = e.editorial_id
    `);
    return result.rows || [];
  },
  
  /**
   * Get a book with author and category information
   * @param {number} id - Book ID
   * @returns {Promise<Object|null>} - Book with related data
   */
  getByIdWithDetails: async function(id) {
    const result = await bookModel.raw(`
      SELECT b.*, 
             a.first_name, a.last_name,
             c.name as category_name,
             e.name as editorial_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN editorials e ON b.editorial_id = e.editorial_id
      WHERE b.book_id = ?
    `, [id]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }
};

export default TursoBook;
