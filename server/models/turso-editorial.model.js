// server/models/turso-editorial.model.js
import { createTursoModel } from '../config/turso-adapter.js';

// Define allowed fields for creating/updating editorials
const allowedFields = [
  'name',
  'description'
];

// Create the Turso-adapted editorial model
const editorialModel = createTursoModel('editorials', 'editorial_id', allowedFields);

// Extended functionality for editorial model
const TursoEditorial = {
  ...editorialModel,
  
  /**
   * Get editorials with their books count
   * @returns {Promise<Array>} - Editorials with book count
   */
  async getEditorialsWithBookCount() {
    const result = await editorialModel.raw(`
      SELECT e.*, COUNT(b.book_id) as book_count
      FROM editorials e
      LEFT JOIN books b ON e.editorial_id = b.editorial_id
      GROUP BY e.editorial_id
    `);
    return result.rows || [];
  },
  
  /**
   * Get an editorial with its books
   * @param {number} id - Editorial ID
   * @returns {Promise<Object|null>} - Editorial with books
   */
  async getEditorialWithBooks(id) {
    // Get editorial details
    const editorial = await editorialModel.getById(id);
    if (!editorial) return null;
    
    // Get editorial's books
    const result = await editorialModel.raw(`
      SELECT b.*, a.first_name, a.last_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE b.editorial_id = ?
    `, [id]);
    
    // Combine editorial with books
    return {
      ...editorial,
      books: result.rows || []
    };
  }
};

export default TursoEditorial;
