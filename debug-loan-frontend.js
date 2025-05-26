// Debug script to test loan dashboard functionality
console.log("🔧 [DEBUG] Starting loan dashboard debug...");

// Simulate the API calls that the frontend makes
const API_BASE = "http://localhost:8000/api";

const testAuthHeaders = {
  'Content-Type': 'application/json',
  'x-user-id': '21',
  'x-user-role': 'librarian'
};

async function testAPIs() {
  console.log("📚 [DEBUG] Testing Books API...");
  try {
    const booksRes = await fetch(`${API_BASE}/books`);
    const booksData = await booksRes.json();
    console.log("📚 [DEBUG] Books Response:", booksData);
    console.log("📚 [DEBUG] Books Array Length:", booksData.success ? booksData.data.length : booksData.length);
  } catch (err) {
    console.error("❌ [DEBUG] Books API Error:", err);
  }

  console.log("👥 [DEBUG] Testing Users API...");
  try {
    const usersRes = await fetch(`${API_BASE}/users`, { headers: testAuthHeaders });
    const usersData = await usersRes.json();
    console.log("👥 [DEBUG] Users Response:", usersData);
    console.log("👥 [DEBUG] Users Array Length:", usersData.success ? usersData.data.length : usersData.length);
  } catch (err) {
    console.error("❌ [DEBUG] Users API Error:", err);
  }

  console.log("🔄 [DEBUG] Testing Loans API...");
  try {
    const loansRes = await fetch(`${API_BASE}/loans`, { headers: testAuthHeaders });
    const loansData = await loansRes.json();
    console.log("🔄 [DEBUG] Loans Response:", loansData);
    console.log("🔄 [DEBUG] Loans Array Length:", loansData.success ? loansData.data.length : loansData.length);
    
    if (loansData.success && loansData.data.length > 0) {
      console.log("📋 [DEBUG] First loan sample:", loansData.data[0]);
    }
  } catch (err) {
    console.error("❌ [DEBUG] Loans API Error:", err);
  }
}

// Test the localStorage
console.log("💾 [DEBUG] Current localStorage user:", JSON.parse(localStorage.getItem('user') || '{}'));

// Run the tests
testAPIs();
