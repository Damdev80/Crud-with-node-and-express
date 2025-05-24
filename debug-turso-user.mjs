// debug-turso-user.mjs
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

import { createClient } from '@libsql/client';

console.log('🔍 Debugging Turso User Creation...');
console.log('====================================');

// Add environment variable logging
console.log('Environment variables loaded:');
console.log('- DB_PROVIDER:', process.env.DB_PROVIDER);
console.log('- TURSO_DATABASE_URL present:', !!process.env.TURSO_DATABASE_URL);
console.log('- TURSO_AUTH_TOKEN present:', !!process.env.TURSO_AUTH_TOKEN);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Test direct Turso connection
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

try {
  // 1. Test basic connection
  console.log('\n1. Testing Turso connection...');
  const testResult = await client.execute('SELECT 1 as test');
  console.log('✅ Connection successful:', testResult.rows);

  // 2. Check users table structure
  console.log('\n2. Checking users table structure...');
  const tableInfo = await client.execute("PRAGMA table_info(users)");
  console.log('Users table columns:');
  tableInfo.rows.forEach(col => {
    console.log(`  - ${col.name}: ${col.type} (nullable: ${col.notnull === 0})`);
  });

  // 3. Check existing users
  console.log('\n3. Checking existing users...');
  const existingUsers = await client.execute('SELECT user_id, name, email, role FROM users LIMIT 5');
  console.log('Existing users:', existingUsers.rows);

  // 4. Test manual user creation
  console.log('\n4. Testing manual user creation...');
  const timestamp = Date.now();
  const testUser = {
    name: `Debug Test User ${timestamp}`,
    email: `debugtest${timestamp}@example.com`,
    password: 'TestPassword123!',
    role: 'user'
  };

  try {
    const insertResult = await client.execute({
      sql: 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      args: [testUser.name, testUser.email, testUser.password, testUser.role]
    });
    
    console.log('✅ Manual insert successful:');
    console.log('  Insert ID:', insertResult.lastInsertRowid);
    console.log('  Rows affected:', insertResult.rowsAffected);
    
    // Verify the user was created
    const verifyResult = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [testUser.email]
    });
    
    console.log('✅ User verification:', verifyResult.rows[0]);
    
  } catch (insertError) {
    console.log('❌ Manual insert failed:', insertError.message);
  }

  // 5. Test TursoUser model directly
  console.log('\n5. Testing TursoUser model...');
  
  const TursoUserModule = await import('./server/models/turso-user.model.js');
  const TursoUser = TursoUserModule.default;
  
  console.log('TursoUser methods:', Object.getOwnPropertyNames(TursoUser).filter(n => typeof TursoUser[n] === 'function'));
  
  try {
    const modelTestUser = {
      name: `Model Test User ${timestamp + 1}`,
      email: `modeltest${timestamp + 1}@example.com`,
      password: 'TestPassword123!',
      role: 'user'
    };
    
    const modelResult = await TursoUser.create(modelTestUser);
    console.log('✅ TursoUser.create successful:', modelResult);
    
  } catch (modelError) {
    console.log('❌ TursoUser.create failed:', modelError.message);
    console.log('Full error:', modelError);
  }

} catch (error) {
  console.error('❌ Connection or test failed:', error.message);
  console.error('Full error:', error);
} finally {
  console.log('\n🔚 Debug script completed');
  client.close();
  process.exit(0);
}
