// Simple test to verify the loan dashboard APIs
// Run this in the browser console on localhost:5173

async function testLoanDashboardAPIs() {
  console.log("🧪 [TEST] Starting loan dashboard API tests...");
  
  // Set up test user in localStorage if not present
  const currentUser = localStorage.getItem('user');
  if (!currentUser) {
    console.log("🧪 [TEST] Setting up test user...");
    const testUser = {
      user_id: 21,
      name: "Test Librarian",
      email: "librarian@test.com",
      role: "librarian"
    };
    localStorage.setItem('user', JSON.stringify(testUser));
    console.log("🧪 [TEST] Test user set:", testUser);
  }
  
  // Get auth headers
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const authHeaders = {
    'Content-Type': 'application/json',
    'x-user-id': user.user_id,
    'x-user-role': user.role
  };
  
  console.log("🧪 [TEST] Auth headers:", authHeaders);
  
  // Test Books API
  try {
    console.log("📚 [TEST] Testing Books API...");
    const booksRes = await fetch('http://localhost:8000/api/books');
    const booksData = await booksRes.json();
    console.log("📚 [TEST] Books Response:", booksData);
    console.log("📚 [TEST] Books Count:", booksData.success ? booksData.data.length : (Array.isArray(booksData) ? booksData.length : 0));
  } catch (err) {
    console.error("❌ [TEST] Books API Error:", err);
  }
  
  // Test Users API
  try {
    console.log("👥 [TEST] Testing Users API...");
    const usersRes = await fetch('http://localhost:8000/api/users', { headers: authHeaders });
    const usersData = await usersRes.json();
    console.log("👥 [TEST] Users Response:", usersData);
    console.log("👥 [TEST] Users Count:", usersData.success ? usersData.data.length : (Array.isArray(usersData) ? usersData.length : 0));
  } catch (err) {
    console.error("❌ [TEST] Users API Error:", err);
  }
  
  // Test Loans API
  try {
    console.log("🔄 [TEST] Testing Loans API...");
    const loansRes = await fetch('http://localhost:8000/api/loans', { headers: authHeaders });
    const loansData = await loansRes.json();
    console.log("🔄 [TEST] Loans Response:", loansData);
    console.log("🔄 [TEST] Loans Count:", loansData.success ? loansData.data.length : (Array.isArray(loansData) ? loansData.length : 0));
    
    if (loansData.success && loansData.data.length > 0) {
      console.log("📋 [TEST] Sample loan:", loansData.data[0]);
    }
  } catch (err) {
    console.error("❌ [TEST] Loans API Error:", err);
  }
  
  console.log("🧪 [TEST] All tests completed!");
}

// Run the test
testLoanDashboardAPIs();
