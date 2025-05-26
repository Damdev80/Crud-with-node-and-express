// Debug script para identificar el problema con préstamos
import './temp-env-fix.js';
import ModelFactory from './models/model-factory.js';

console.log('🔧 Debug Loans Script');
console.log('Environment Variables:');
console.log('- DB_PROVIDER:', process.env.DB_PROVIDER);
console.log('- TURSO_DATABASE_URL present:', !!process.env.TURSO_DATABASE_URL);
console.log('- TURSO_AUTH_TOKEN present:', !!process.env.TURSO_AUTH_TOKEN);

async function testLoans() {
  try {
    console.log('\n📊 Testing Loan Model...');
    
    // Test 1: Check if model is loaded correctly
    console.log('Loan model type:', ModelFactory.Loan.constructor.name);
    console.log('Available methods:', Object.getOwnPropertyNames(ModelFactory.Loan));
    
    // Test 2: Test basic getAll method
    console.log('\n🔍 Testing getAll method...');
    const allLoans = await ModelFactory.Loan.getAll();
    console.log('✅ getAll success. Count:', allLoans.length);
    
    // Test 3: Test getAllWithDetails method 
    console.log('\n🔍 Testing getAllWithDetails method...');
    const loansWithDetails = await ModelFactory.Loan.getAllWithDetails();
    console.log('✅ getAllWithDetails success. Count:', loansWithDetails.length);
    
    if (loansWithDetails.length > 0) {
      console.log('Sample loan with details:', JSON.stringify(loansWithDetails[0], null, 2));
    }
    
    // Test 4: Test individual methods
    console.log('\n🔍 Testing other methods...');
    
    if (typeof ModelFactory.Loan.getOverdue === 'function') {
      const overdue = await ModelFactory.Loan.getOverdue();
      console.log('✅ getOverdue success. Count:', overdue.length);
    } else {
      console.log('❌ getOverdue method not found');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testLoans().then(() => {
  console.log('Debug completed');
  process.exit(0);
}).catch(err => {
  console.error('Debug failed:', err);
  process.exit(1);
});
