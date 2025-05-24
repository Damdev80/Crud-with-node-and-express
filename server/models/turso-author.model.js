// server/models/turso-author.model.js
import { createTursoModel } from '../config/turso-adapter.js';

// Define allowed fields for creating/updating authors
const allowedFields = [
  'first_name',
  'last_name',
  'birth_date',
  'nationality'
];

// Create the Turso-adapted author model
const authorModel = createTursoModel('authors', 'author_id', allowedFields);

// Extended functionality for author model
const TursoAuthor = {
  ...authorModel,
  
  /**
   * Get authors with their books
   * @returns {Promise<Array>} - Authors with books count
   */
  async getAuthorsWithBookCount() {
    const result = await authorModel.raw(`
      SELECT a.*, COUNT(b.book_id) as book_count
      FROM authors a
      LEFT JOIN books b ON a.author_id = b.author_id
      GROUP BY a.author_id
    `);
    return result.rows || [];
  },
  
  /**
   * Get an author with all their books
   * @param {number} id - Author ID
   * @returns {Promise<Object|null>} - Author with books
   */
  async getAuthorWithBooks(id) {
    // Get author details
    const author = await authorModel.getById(id);
    if (!author) return null;
    
    // Get author's books
    const result = await authorModel.raw(`
      SELECT b.*, c.name as category_name, e.name as editorial_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN editorials e ON b.editorial_id = e.editorial_id
      WHERE b.author_id = ?
    `, [id]);
    
    // Combine author with books
    return {
      ...author,
      books: result.rows || []
    };
  }
};

export default TursoAuthor;
