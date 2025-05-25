// server/models/turso-category.model.js
import { createTursoModel } from '../config/turso-adapter.js';

// Define allowed fields for creating/updating categories
const allowedFields = [
  'name',
  'description'
];

// Create the Turso-adapted category model
const categoryModel = createTursoModel('categories', 'category_id', allowedFields);

// Extended functionality for category model
const TursoCategory = {
  ...categoryModel,
  
  /**
   * Get categories with their books count
   * @returns {Promise<Array>} - Categories with book count
   */
  getCategoriesWithBookCount: async function() {
    const result = await categoryModel.raw(`
      SELECT c.*, COUNT(b.book_id) as book_count
      FROM categories c
      LEFT JOIN books b ON c.category_id = b.category_id
      GROUP BY c.category_id
    `);
    return result.rows || [];
  },
  
  /**
   * Get a category with its books
   * @param {number} id - Category ID
   * @returns {Promise<Object|null>} - Category with books
   */
  getCategoryWithBooks: async function(id) {
    // Get category details
    const category = await categoryModel.getById(id);
    if (!category) return null;
    
    // Get category's books
    const result = await categoryModel.raw(`
      SELECT b.*, a.first_name, a.last_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE b.category_id = ?
    `, [id]);
    
    // Combine category with books
    return {
      ...category,
      books: result.rows || []
    };
  },
  
  /**
   * Find or create category by name
   * @param {string} name - Category name
   * @returns {Promise<Object>} - Category record
   */
  findOrCreateByName: async function(name) {
    try {
      // Search for existing category
      const result = await categoryModel.raw(`
        SELECT * FROM categories WHERE name = ?
      `, [name]);
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0];
      }
      
      // If not exists, create it with empty description
      const categoryData = { 
        name, 
        description: '' 
      };
      
      const created = await categoryModel.create(categoryData);
      return created;
    } catch (error) {
      console.error('Error in findOrCreateByName:', error);
      throw error;
    }
  },

  /**
   * Get all books in a category
   * @param {number} id - Category ID
   * @returns {Promise<Array>} - Books in the category
   */
  getBooks: async function(id) {
    const result = await categoryModel.raw(`
      SELECT * FROM books WHERE category_id = ?
    `, [id]);
    return result.rows || [];
  }
};

export default TursoCategory;
