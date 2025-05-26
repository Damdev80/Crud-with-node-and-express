// filepath: server/migrations/seed-turso.js
import { fileURLToPath } from 'url';
import path from 'path';
// Determine directory of this script
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load server environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Apply temporary environment variable fix for Turso production
import '../temp-env-fix.js';

import { query } from '../config/turso.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🚀 Seeding Turso database...');

    // Create test user
    const passwordHash = await bcrypt.hash('testpass123', 10);
    await query(
      `INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      ['Test User', 'test@biblioteca.com', passwordHash, 'user']
    );

    // Create author
    const authorResult = await query(
      `INSERT INTO authors (first_name, last_name) VALUES (?, ?)`,
      ['John', 'Doe']
    );
    const authorId = authorResult.lastInsertRowid || authorResult.lastRowid;

    // Create category
    const categoryResult = await query(
      `INSERT INTO categories (name) VALUES (?)`,
      ['Fiction']
    );
    const categoryId = categoryResult.lastInsertRowid || categoryResult.lastRowid;

    // Create editorial
    const editorialResult = await query(
      `INSERT INTO editorials (name) VALUES (?)`,
      ['Editorial One']
    );
    const editorialId = editorialResult.lastInsertRowid || editorialResult.lastRowid;

    // Create book
    const bookInsert = await query(
      `INSERT INTO books (title, author_id, category_id, editorial_id, publication_year, isbn, available_copies, description, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Sample Book', authorId, categoryId, editorialId, 2023, '1234567890', 5, 'Sample description', '']
    );
    // Fetch book_id of the inserted or existing book
    const bookRows = await query(`SELECT book_id FROM books WHERE title = ?`, ['Sample Book']);
    const bookId = bookRows.rows[0].book_id;

    // Fetch user_id of the test user
    const userRows = await query(`SELECT user_id FROM users WHERE email = ?`, ['test@biblioteca.com']);
    const userId = userRows.rows[0].user_id;

    // Insert a loan record
    const now = new Date().toISOString();
    const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await query(
      `INSERT INTO loans (book_id, user_id, loan_date, return_date, actual_return_date, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [bookId, userId, now, returnDate, null, 'active']
    );

    console.log('✅ Seeding complete: user, author, category, editorial, book, loan.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Turso database:', error);
    process.exit(1);
  }
}

seed();
