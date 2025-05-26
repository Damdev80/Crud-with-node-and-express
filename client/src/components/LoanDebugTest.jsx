import { useState, useEffect } from "react";
import { API_ENDPOINTS } from '../config/api.js';
import { getAuthHeaders } from '../utils/authHeaders.js';

// Debug component to test loan data fetching
function LoanDebugTest() {
  const [debugInfo, setDebugInfo] = useState({
    user: null,
    authHeaders: null,
    books: [],
    users: [],
    loans: [],
    errors: []
  });

  useEffect(() => {
    async function runTests() {
      const errors = [];
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const authHeaders = getAuthHeaders();
      
      setDebugInfo(prev => ({ 
        ...prev, 
        user, 
        authHeaders,
        errors: [] 
      }));

      // Test Books API
      try {
        console.log("🧪 Testing Books API...");
        const booksRes = await fetch(API_ENDPOINTS.books);
        const booksData = await booksRes.json();
        console.log("📚 Books Response:", booksData);
        
        let booksArray = [];
        if (booksData.success && Array.isArray(booksData.data)) {
          booksArray = booksData.data;
        } else if (Array.isArray(booksData)) {
          booksArray = booksData;
        }
        
        setDebugInfo(prev => ({ ...prev, books: booksArray }));
      } catch (err) {
        console.error("❌ Books API Error:", err);
        errors.push(`Books API: ${err.message}`);
      }

      // Test Users API
      try {
        console.log("🧪 Testing Users API...");
        const usersRes = await fetch(API_ENDPOINTS.users, { headers: authHeaders });
        const usersData = await usersRes.json();
        console.log("👥 Users Response:", usersData);
        
        let usersArray = [];
        if (usersData.success && Array.isArray(usersData.data)) {
          usersArray = usersData.data;
        } else if (Array.isArray(usersData)) {
          usersArray = usersData;
        }
        
        setDebugInfo(prev => ({ ...prev, users: usersArray }));
      } catch (err) {
        console.error("❌ Users API Error:", err);
        errors.push(`Users API: ${err.message}`);
      }

      // Test Loans API
      try {
        console.log("🧪 Testing Loans API...");
        const loansRes = await fetch(API_ENDPOINTS.loans, { headers: authHeaders });
        const loansData = await loansRes.json();
        console.log("🔄 Loans Response:", loansData);
        
        let loansArray = [];
        if (loansData.success && Array.isArray(loansData.data)) {
          loansArray = loansData.data;
        } else if (Array.isArray(loansData)) {
          loansArray = loansData;
        }
        
        setDebugInfo(prev => ({ ...prev, loans: loansArray, errors }));
      } catch (err) {
        console.error("❌ Loans API Error:", err);
        errors.push(`Loans API: ${err.message}`);
        setDebugInfo(prev => ({ ...prev, errors }));
      }
    }

    runTests();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Loan Dashboard Debug Test</h1>
      
      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">User Authentication</h2>
          <pre className="text-sm bg-white p-2 rounded">
            {JSON.stringify(debugInfo.user, null, 2)}
          </pre>
          <h3 className="font-semibold mt-2">Auth Headers:</h3>
          <pre className="text-sm bg-white p-2 rounded">
            {JSON.stringify(debugInfo.authHeaders, null, 2)}
          </pre>
        </div>

        {/* Errors */}
        {debugInfo.errors.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-red-700">Errors</h2>
            <ul className="list-disc list-inside text-red-600">
              {debugInfo.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Books */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Books ({debugInfo.books.length})</h2>
          {debugInfo.books.length > 0 ? (
            <div className="max-h-40 overflow-y-auto">
              <pre className="text-sm bg-white p-2 rounded">
                {JSON.stringify(debugInfo.books.slice(0, 3), null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-600">No books loaded</p>
          )}
        </div>

        {/* Users */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Users ({debugInfo.users.length})</h2>
          {debugInfo.users.length > 0 ? (
            <div className="max-h-40 overflow-y-auto">
              <pre className="text-sm bg-white p-2 rounded">
                {JSON.stringify(debugInfo.users.slice(0, 3).map(u => ({
                  user_id: u.user_id,
                  name: u.name,
                  email: u.email,
                  role: u.role
                })), null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-600">No users loaded</p>
          )}
        </div>

        {/* Loans */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Loans ({debugInfo.loans.length})</h2>
          {debugInfo.loans.length > 0 ? (
            <div className="max-h-40 overflow-y-auto">
              <pre className="text-sm bg-white p-2 rounded">
                {JSON.stringify(debugInfo.loans.slice(0, 3), null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-600">No loans loaded</p>
          )}
        </div>      </div>
    </div>
  );
}

export default LoanDebugTest;
