// test-fix.mjs
import './temp-env-fix.js';
import ModelFactory from './models/model-factory.js';

async function test() {
  try {
    console.log('🔍 Testing Turso fix...');
    console.log('DB_PROVIDER:', process.env.DB_PROVIDER);
    
    const authors = await ModelFactory.Author.getAll();
    console.log('✅ Authors:', authors.length, 'records');
    
    const categories = await ModelFactory.Category.getAll();
    console.log('✅ Categories:', categories.length, 'records');
    
    const editorials = await ModelFactory.Editorial.getAll();
    console.log('✅ Editorials:', editorials.length, 'records');
    
    console.log('🎉 FIX VERIFICATION: SUCCESS');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
