// debug-model-factory.js
import dotenv from 'dotenv';
dotenv.config();

import ModelFactory from './server/models/model-factory.js';

console.log('🔍 Debugging Model Factory Configuration');
console.log('================================');
console.log('Environment Variables:');
console.log('DB_PROVIDER:', process.env.DB_PROVIDER);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'Set' : 'Not set');
console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? 'Set' : 'Not set');
console.log('');

console.log('Model Factory Results:');
console.log('User Model Name:', ModelFactory.User.name);
console.log('Book Model Name:', ModelFactory.Book.name);
console.log('Author Model Name:', ModelFactory.Author.name);
console.log('');

// Test if User model has findByEmail method
console.log('User Model Methods:');
const userMethods = Object.getOwnPropertyNames(ModelFactory.User).filter(name => typeof ModelFactory.User[name] === 'function');
console.log('Available methods:', userMethods);
console.log('Has findByEmail:', userMethods.includes('findByEmail'));
console.log('');

// Test model instantiation
try {
  console.log('Testing User model functionality...');
  console.log('User model type:', typeof ModelFactory.User);
  console.log('User model constructor:', ModelFactory.User.constructor.name);
  
  if (ModelFactory.User.findByEmail) {
    console.log('✅ findByEmail method is available');
  } else {
    console.log('❌ findByEmail method is NOT available');
  }
  
} catch (error) {
  console.log('❌ Error testing User model:', error.message);
}
