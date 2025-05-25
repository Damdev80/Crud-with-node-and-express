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
  getEditorialsWithBookCount: async function() {
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
  getEditorialWithBooks: async function(id) {
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
  },
  
  /**
   * Find or create editorial by name
   * @param {string} name - Editorial name
   * @returns {Promise<Object|null>} - Editorial record or null if name is empty
   */
  findOrCreateByName: async function(name) {
    try {
      if (!name) return null;
      
      // Search for existing editorial
      const result = await editorialModel.raw(`
        SELECT * FROM editorials WHERE name = ?
      `, [name]);
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0];
      }
      
      // If not exists, create it
      const editorialData = { 
        name,
        description: null
      };
      
      const created = await editorialModel.create(editorialData);
      return created;
    } catch (error) {
      console.error('Error in findOrCreateByName:', error);
      throw error;
    }
  }
};

export default TursoEditorial;
