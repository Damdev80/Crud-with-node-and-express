// server/models/turso-loan.model.js
import { createTursoModel } from '../config/turso-adapter.js';

// Define allowed fields for creating/updating loans
const allowedFields = [
  'user_id',
  'book_id',
  'loan_date',
  'return_date',
  'actual_return_date',
  'status'
];

// Create the Turso-adapted loan model
const loanModel = createTursoModel('loans', 'loan_id', allowedFields);

// Extended functionality for loan model
const TursoLoan = {
  ...loanModel,
  
  /**
   * Get loans with user and book details
   * @returns {Promise<Array>} - Loans with related data
   */
  async getAllWithDetails() {
    const result = await loanModel.raw(`
      SELECT l.*,
             u.name as user_name, u.email,
             b.title as book_title, b.isbn,
             a.first_name, a.last_name
      FROM loans l
      INNER JOIN users u ON l.user_id = u.user_id
      INNER JOIN books b ON l.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
    `);
    return result.rows || [];
  },
  
  /**
   * Get a loan with user and book details
   * @param {number} id - Loan ID
   * @returns {Promise<Object|null>} - Loan with related data
   */
  async getByIdWithDetails(id) {
    const result = await loanModel.raw(`
      SELECT l.*,
             u.name as user_name, u.email,
             b.title as book_title, b.isbn,
             a.first_name, a.last_name
      FROM loans l
      INNER JOIN users u ON l.user_id = u.user_id
      INNER JOIN books b ON l.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE l.loan_id = ?
    `, [id]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  
  /**
   * Get all loans for a specific user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} - Loans for the user
   */
  async getLoansForUser(userId) {
    const result = await loanModel.raw(`
      SELECT l.*,
             b.title as book_title, b.isbn,
             a.first_name, a.last_name
      FROM loans l
      INNER JOIN books b ON l.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE l.user_id = ?
    `, [userId]);
    
    return result.rows || [];
  }
};

export default TursoLoan;
