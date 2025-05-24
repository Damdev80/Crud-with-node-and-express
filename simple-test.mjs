// simple-test.mjs
const testData = {
  name: "Simple Test User",
  email: `simpletest${Date.now()}@example.com`,
  password: "TestPassword123!",
  role: "user"
};

console.log('Testing registration...');

fetch('https://crud-with-node-and-express.onrender.com/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Response:', data);
  if (data.includes('"success":true')) {
    console.log('✅ SUCCESS! Registration worked!');
  } else {
    console.log('❌ FAILED! Registration error');
  }
})
.catch(error => {
  console.error('❌ Request failed:', error.message);
});
