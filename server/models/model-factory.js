// server/models/model-factory.js
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🏭 [MODEL-FACTORY] Initializing...');
console.log('🏭 [MODEL-FACTORY] DB_PROVIDER from env:', process.env.DB_PROVIDER);
console.log('🏭 [MODEL-FACTORY] NODE_ENV:', process.env.NODE_ENV);
console.log('🏭 [MODEL-FACTORY] TURSO_DATABASE_URL present:', !!process.env.TURSO_DATABASE_URL);
console.log('🏭 [MODEL-FACTORY] TURSO_AUTH_TOKEN present:', !!process.env.TURSO_AUTH_TOKEN);

// Import MySQL models
import Book from './book.model.js';
import Author from './author.model.js';
import Category from './category.model.js';
import Editorial from './editorial.model.js';
import Loan from './loan.model.js';
import User from './user.model.js';

// Import Turso models
import TursoBook from './turso-book.model.js';
import TursoAuthor from './turso-author.model.js';
import TursoCategory from './turso-category.model.js';
import TursoEditorial from './turso-editorial.model.js';
import TursoLoan from './turso-loan.model.js';
import TursoUser from './turso-user.model.js';

// Check if we should use Turso
const useTurso = process.env.DB_PROVIDER === 'turso';

console.log('🏭 [MODEL-FACTORY] useTurso decision:', useTurso);
console.log('🏭 [MODEL-FACTORY] Will use:', useTurso ? 'Turso models' : 'MySQL models');

/**
 * Model factory that returns the appropriate model implementation
 * based on environment configuration
 */
export default {
  /**
   * Get the Book model
   * @returns {Object} - Book model (MySQL or Turso)
   */
  get Book() {
    return useTurso ? TursoBook : Book;
  },
  
  /**
   * Get the Author model
   * @returns {Object} - Author model (MySQL or Turso)
   */
  get Author() {
    return useTurso ? TursoAuthor : Author;
  },
  
  /**
   * Get the Category model
   * @returns {Object} - Category model (MySQL or Turso)
   */
  get Category() {
    return useTurso ? TursoCategory : Category;
  },
  
  /**
   * Get the Editorial model
   * @returns {Object} - Editorial model (MySQL or Turso)
   */
  get Editorial() {
    return useTurso ? TursoEditorial : Editorial;
  },
  
  /**
   * Get the Loan model
   * @returns {Object} - Loan model (MySQL or Turso)
   */
  get Loan() {
    return useTurso ? TursoLoan : Loan;
  },
  
  /**
   * Get the User model
   * @returns {Object} - User model (MySQL or Turso)
   */
  get User() {
    return useTurso ? TursoUser : User;
  }
};
