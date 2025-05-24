// server/models/turso-user.model.js
import { createTursoModel } from '../config/turso-adapter.js';

// Define allowed fields for creating/updating users
const allowedFields = [
  'name',
  'email',
  'password',
  'role'
];

// Create the Turso-adapted user model
const userModel = createTursoModel('users', 'user_id', allowedFields);

// Extended functionality for user model
const TursoUser = {
  ...userModel,
  
  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null
   */
  async findByEmail(email) {
    const result = await userModel.raw(`
      SELECT * FROM users WHERE email = ? LIMIT 1
    `, [email]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  
  /**
   * Get a user with their loans
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} - User with loans
   */
  async getUserWithLoans(id) {
    // Get user details
    const user = await userModel.getById(id);
    if (!user) return null;
    
    // Get user's loans
    const result = await userModel.raw(`
      SELECT l.*,
             b.title as book_title, b.isbn,
             a.first_name, a.last_name
      FROM loans l
      INNER JOIN books b ON l.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE l.user_id = ?
    `, [id]);
    
    // Combine user with loans
    return {
      ...user,
      loans: result.rows || []
    };
  }
};

export default TursoUser;
