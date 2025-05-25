// test-findorcreate.mjs
import './temp-env-fix.js';
import ModelFactory from './models/model-factory.js';

async function testFindOrCreate() {
  try {
    console.log('🧪 Testing findOrCreateByName methods...');
    console.log('DB_PROVIDER:', process.env.DB_PROVIDER);
    
    // Test Author findOrCreateByName
    console.log('\n📝 Testing Author.findOrCreateByName...');
    const author = await ModelFactory.Author.findOrCreateByName('Test Author Name');
    console.log('✅ Author result:', author);
    
    // Test Category findOrCreateByName
    console.log('\n📝 Testing Category.findOrCreateByName...');
    const category = await ModelFactory.Category.findOrCreateByName('Test Category');
    console.log('✅ Category result:', category);
    
    // Test Editorial findOrCreateByName
    console.log('\n📝 Testing Editorial.findOrCreateByName...');
    const editorial = await ModelFactory.Editorial.findOrCreateByName('Test Editorial');
    console.log('✅ Editorial result:', editorial);
    
    console.log('\n🎉 All findOrCreateByName methods work correctly!');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testFindOrCreate();
