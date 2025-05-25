// verify-turso-fix.js
// Script to verify that our Turso database fix is working correctly

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to server directory
process.chdir(join(__dirname, 'server'));

// Set production environment to test Turso
process.env.NODE_ENV = 'production';

async function verifyFix() {
  console.log('🔍 [VERIFY] Starting Turso fix verification...');
    try {
    // Import temp-env-fix to set environment variables
    await import('./server/temp-env-fix.js');
    
    // Import ModelFactory
    const { default: ModelFactory } = await import('./server/models/model-factory.js');
    
    console.log('✅ [VERIFY] ModelFactory imported successfully');
    console.log('✅ [VERIFY] DB_PROVIDER:', process.env.DB_PROVIDER);
    console.log('✅ [VERIFY] Models available:');
    console.log('   - Author:', !!ModelFactory.Author);
    console.log('   - Category:', !!ModelFactory.Category);
    console.log('   - Editorial:', !!ModelFactory.Editorial);
    console.log('   - Book:', !!ModelFactory.Book);
    
    // Test Author model
    console.log('\n📋 [VERIFY] Testing Author model...');
    const authors = await ModelFactory.Author.getAll();
    console.log('✅ [VERIFY] Authors retrieved:', authors.length, 'records');
    if (authors.length > 0) {
      console.log('   Sample author:', authors[0]);
    }
    
    // Test Category model
    console.log('\n📋 [VERIFY] Testing Category model...');
    const categories = await ModelFactory.Category.getAll();
    console.log('✅ [VERIFY] Categories retrieved:', categories.length, 'records');
    if (categories.length > 0) {
      console.log('   Sample category:', categories[0]);
    }
    
    // Test Editorial model
    console.log('\n📋 [VERIFY] Testing Editorial model...');
    const editorials = await ModelFactory.Editorial.getAll();
    console.log('✅ [VERIFY] Editorials retrieved:', editorials.length, 'records');
    if (editorials.length > 0) {
      console.log('   Sample editorial:', editorials[0]);
    }
    
    console.log('\n🎉 [VERIFY] All tests passed! Turso fix is working correctly.');
    console.log('📊 [VERIFY] Summary:');
    console.log(`   - Authors: ${authors.length} records`);
    console.log(`   - Categories: ${categories.length} records`);
    console.log(`   - Editorials: ${editorials.length} records`);
    
  } catch (error) {
    console.error('❌ [VERIFY] Error during verification:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

verifyFix();
