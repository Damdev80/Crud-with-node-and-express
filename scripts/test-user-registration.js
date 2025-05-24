// scripts/test-user-registration.js
import fetch from 'node-fetch';

async function testUserRegistration() {
  console.log('🔍 Testing user registration functionality...');
  
  // Test with production backend
  const BACKEND_URL = 'https://crud-with-node-and-express.onrender.com';
  
  // Generate unique test user data
  const timestamp = Date.now();
  const testUser = {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'TestPassword123!',
    role: 'user'
  };
  
  try {
    console.log('\n📝 Testing user registration...');
    console.log('📋 Test user data:', {
      name: testUser.name,
      email: testUser.email,
      role: testUser.role
    });
    
    const response = await fetch(`${BACKEND_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const responseData = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers));
    console.log('📊 Response Data:', responseData);
    
    if (response.ok && responseData.success) {
      console.log('✅ User registration successful!');
      console.log('✅ User created:', {
        id: responseData.data.user_id,
        name: responseData.data.name,
        email: responseData.data.email,
        role: responseData.data.role
      });
      
      // Test login with the same user
      console.log('\n🔐 Testing login with registered user...');
      
      const loginResponse = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok && loginData.success) {
        console.log('✅ Login successful!');
        console.log('✅ Logged in user:', {
          id: loginData.data.user_id,
          name: loginData.data.name,
          email: loginData.data.email,
          role: loginData.data.role
        });
      } else {
        console.log('❌ Login failed:', loginData);
      }
      
    } else {
      console.log('❌ User registration failed!');
      console.log('❌ Error details:', responseData);
    }
    
  } catch (error) {
    console.error('❌ Error during registration test:', error.message);
    console.error('❌ Full error:', error);
  }
  
  // Also test with different user data types
  console.log('\n🧪 Testing edge cases...');
  
  // Test duplicate email
  try {
    console.log('📝 Testing duplicate email registration...');
    const duplicateResponse = await fetch(`${BACKEND_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser) // Same user data
    });
    
    const duplicateData = await duplicateResponse.json();
    
    if (duplicateResponse.status === 409 && !duplicateData.success) {
      console.log('✅ Duplicate email correctly rejected');
    } else {
      console.log('⚠️ Duplicate email test unexpected result:', duplicateData);
    }
    
  } catch (error) {
    console.error('❌ Error testing duplicate email:', error.message);
  }
  
  // Test admin role registration
  try {
    console.log('📝 Testing admin role registration...');
    const adminUser = {
      name: `Admin User ${timestamp + 1}`,
      email: `admin${timestamp + 1}@example.com`,
      password: 'AdminPassword123!',
      role: 'admin'
    };
    
    const adminResponse = await fetch(`${BACKEND_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminUser)
    });
    
    const adminData = await adminResponse.json();
    
    if (adminResponse.ok && adminData.success) {
      console.log('✅ Admin user registration successful');
      console.log('✅ Admin user role:', adminData.data.role);
    } else {
      console.log('❌ Admin user registration failed:', adminData);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin registration:', error.message);
  }
  
  console.log('\n🏁 User registration test completed!');
}

testUserRegistration().catch(error => {
  console.error('Fatal error during test:', error);
  process.exit(1);
});
