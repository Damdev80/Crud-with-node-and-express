// test-model-factory-debug.mjs
import dotenv from 'dotenv';
dotenv.config();

console.log('Environment check:');
console.log('DB_PROVIDER:', process.env.DB_PROVIDER);
console.log('Should use Turso:', process.env.DB_PROVIDER === 'turso');

// Import models individually
const TursoUser = await import('./server/models/turso-user.model.js');
const MySQLUser = await import('./server/models/user.model.js');
const ModelFactory = await import('./server/models/model-factory.js');

console.log('\nDirect imports:');
console.log('TursoUser methods:', Object.getOwnPropertyNames(TursoUser.default).filter(n => typeof TursoUser.default[n] === 'function'));
console.log('MySQLUser methods:', Object.getOwnPropertyNames(MySQLUser.default).filter(n => typeof MySQLUser.default[n] === 'function'));

console.log('\nModelFactory User:');
const FactoryUser = ModelFactory.default.User;
console.log('Factory User name:', FactoryUser?.name);
console.log('Factory User methods:', Object.getOwnPropertyNames(FactoryUser).filter(n => typeof FactoryUser[n] === 'function'));
console.log('Has findByEmail:', typeof FactoryUser.findByEmail === 'function');

// Test the findByEmail method
try {
  if (FactoryUser.findByEmail) {
    console.log('\n✅ Testing findByEmail with non-existent email...');
    const result = await FactoryUser.findByEmail('nonexistent@test.com');
    console.log('Result:', result);
  } else {
    console.log('\n❌ findByEmail method not available');
  }
} catch (error) {
  console.log('\n❌ Error testing findByEmail:', error.message);
}
