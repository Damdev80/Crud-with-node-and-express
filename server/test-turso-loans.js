// Simple test for Turso loan query
import './temp-env-fix.js';
import { query } from './config/turso.js';

console.log('🧪 Testing Turso Loan Query...');
console.log('DB_PROVIDER:', process.env.DB_PROVIDER);

async function testQuery() {
  try {
    // Test basic connection
    console.log('\n1. Testing basic connection...');
    const test = await query('SELECT 1 as test');
    console.log('✅ Basic connection works:', test);

    // Test if loans table exists
    console.log('\n2. Testing loans table...');
    const loansTest = await query('SELECT COUNT(*) as count FROM loans');
    console.log('✅ Loans table exists with count:', loansTest.rows[0]);

    // Test the complex query that's failing
    console.log('\n3. Testing complex query...');
    const complexQuery = `
      SELECT l.*,
             u.name as user_name, u.email,
             b.title as book_title, b.isbn,
             a.first_name, a.last_name
      FROM loans l
      INNER JOIN users u ON l.user_id = u.user_id
      INNER JOIN books b ON l.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
    `;
    
    const result = await query(complexQuery);
    console.log('✅ Complex query works! Results:', result.rows.length);
    
    if (result.rows.length > 0) {
      console.log('Sample result:', result.rows[0]);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testQuery();
