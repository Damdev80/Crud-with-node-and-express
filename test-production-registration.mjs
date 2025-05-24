// test-production-registration.mjs
import fetch from 'node-fetch';

const testData = {
  name: "Production Test User",
  email: "productiontest" + Date.now() + "@example.com",
  password: "TestPassword123!",
  role: "user"
};

console.log('Testing production registration with data:', { ...testData, password: '[HIDDEN]' });

try {
  const response = await fetch('https://crud-with-node-and-express.onrender.com/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
  });

  console.log('Response Status:', response.status);
  console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
  
  const responseData = await response.text();
  console.log('Response Body:', responseData);
  
  if (response.status === 201) {
    console.log('✅ Registration successful!');
  } else {
    console.log('❌ Registration failed');
  }
  
} catch (error) {
  console.error('❌ Request failed:', error.message);
}
