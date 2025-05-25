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
  getAuthorsWithBookCount: async function() {
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
  getAuthorWithBooks: async function(id) {
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
  },
  
  /**
   * Find or create author by full name
   * @param {string} fullName - Full name of the author
   * @returns {Promise<Object>} - Author record
   */
  findOrCreateByName: async function(fullName) {
    try {
      // Separar en nombre y apellido (simple, asume 2 palabras)
      const [first_name, ...rest] = fullName.trim().split(' ');
      const last_name = rest.join(' ');
      
      // Search for existing author
      const result = await authorModel.raw(`
        SELECT * FROM authors 
        WHERE first_name = ? AND last_name = ?
      `, [first_name, last_name]);
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0];
      }
      
      // If not exists, create it with minimal data
      const authorData = { 
        first_name, 
        last_name, 
        birth_date: null, 
        nationality: null 
      };
      
      const created = await authorModel.create(authorData);
      return created;
    } catch (error) {
      console.error('Error in findOrCreateByName:', error);
      throw error;
    }
  }
};

export default TursoAuthor;
