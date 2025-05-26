// Test script para verificar el endpoint de préstamos con autenticación
import './temp-env-fix.js';
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:8000';

async function testLoansEndpoint() {
  try {
    console.log('🧪 Testing loans endpoint with authentication...');
    
    // Simular headers de autenticación básicos
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': '17', // ID de usuario de test
      'x-user-role': 'librarian'
    };
    
    console.log('📡 Making request to /api/loans...');
    const response = await fetch(`${API_BASE}/api/loans`, {
      method: 'GET',
      headers
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📊 Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Loans endpoint is working correctly!');
      console.log('📈 Found', data.data?.length || 0, 'loans');
    } else {
      console.log('❌ Loans endpoint returned error:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error testing loans endpoint:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLoansEndpoint();
