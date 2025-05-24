// Quick test for local user registration
const response = await fetch('http://localhost:8000/api/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  body: JSON.stringify({
    name: 'Local Test User',
    email: `localtest${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role: 'user'
  })
});

const data = await response.json();
console.log('Status:', response.status);
console.log('Data:', data);
