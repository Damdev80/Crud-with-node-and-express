// test-book-creation.mjs
import './temp-env-fix.js';
import ModelFactory from './models/model-factory.js';

async function testBookCreation() {
  try {
    console.log('📚 Testing complete book creation workflow...');
    console.log('DB_PROVIDER:', process.env.DB_PROVIDER);
    
    // Test data for a new book
    const bookData = {
      title: 'Test Book Title',
      description: 'A test book description',
      publication_date: '2025-01-01',
      publication_year: 2025,
      isbn: '978-0123456789',
      available_copies: 5,
      author_name: 'New Test Author',
      category_name: 'New Test Category',
      editorial_name: 'New Test Editorial'
    };
    
    console.log('\n1️⃣ Testing author creation...');
    const author = await ModelFactory.Author.findOrCreateByName(bookData.author_name);
    console.log('✅ Author:', author);
    
    console.log('\n2️⃣ Testing category creation...');
    const category = await ModelFactory.Category.findOrCreateByName(bookData.category_name);
    console.log('✅ Category:', category);
    
    console.log('\n3️⃣ Testing editorial creation...');
    const editorial = await ModelFactory.Editorial.findOrCreateByName(bookData.editorial_name);
    console.log('✅ Editorial:', editorial);
    
    console.log('\n4️⃣ Testing book creation...');
    const newBook = await ModelFactory.Book.create({
      title: bookData.title,
      description: bookData.description,
      publication_date: bookData.publication_date,
      publication_year: bookData.publication_year,
      isbn: bookData.isbn,
      available_copies: bookData.available_copies,
      author_id: author.author_id,
      category_id: category.category_id,
      editorial_id: editorial ? editorial.editorial_id : null,
      cover_image: null
    });
    console.log('✅ Book created:', newBook);
    
    console.log('\n5️⃣ Testing book retrieval with details...');
    const bookWithDetails = await ModelFactory.Book.getById(newBook.book_id);
    console.log('✅ Book retrieved:', bookWithDetails);
    
    console.log('\n🎉 Complete book creation workflow SUCCESS!');
    console.log('📊 Summary:');
    console.log(`   - Author ID: ${author.author_id} (${author.first_name} ${author.last_name})`);
    console.log(`   - Category ID: ${category.category_id} (${category.name})`);
    console.log(`   - Editorial ID: ${editorial.editorial_id} (${editorial.name})`);
    console.log(`   - Book ID: ${newBook.book_id} (${newBook.title})`);
    
  } catch (error) {
    console.error('❌ Error during book creation test:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testBookCreation();
