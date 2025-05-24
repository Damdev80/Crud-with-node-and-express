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
  async getCategoriesWithBookCount() {
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
  async getCategoryWithBooks(id) {
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
  }
};

export default TursoCategory;
