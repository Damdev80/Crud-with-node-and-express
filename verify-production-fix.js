#!/usr/bin/env node

// verify-production-fix.js
import https from 'https';

const testUser = {
  name: 'Verification Test User',
  email: `verify${Date.now()}@example.com`,
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

console.log('🧪 Verifying production fix...');
console.log('📧 Test email:', testUser.email);

const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📄 Response Body:', data);
    
    try {
      const response = JSON.parse(data);
      if (response.success && response.data.user_id) {
        console.log('✅ SUCCESS! User registration works in production!');
        console.log(`👤 Created user: ${response.data.name} (ID: ${response.data.user_id})`);
        console.log('🎉 The Turso environment fix is working!');
      } else {
        console.log('❌ Registration failed:', response.message || 'Unknown error');
      }
    } catch (error) {
      console.log('❌ Failed to parse response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(postData);
req.end();
