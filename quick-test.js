// quick-test.js
import https from 'https';

const testUser = {
  name: 'Quick Test User',
  email: `quicktest${Date.now()}@example.com`,
  password: 'TestPassword123!',
  role: 'user'
};

const postData = JSON.stringify(testUser);

const options = {
  hostname: 'crud-with-node-and-express.onrender.com',
  port: 443,
  path: '/api/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing registration...');
console.log(`📧 Email: ${testUser.email}`);

const req = https.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📄 Response:', data);
    
    if (res.statusCode === 201) {
      console.log('✅ SUCCESS! Registration worked!');
    } else {
      console.log('❌ FAILED! Status:', res.statusCode);
    }
    
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Timeout reached');
  process.exit(1);
}, 10000);
