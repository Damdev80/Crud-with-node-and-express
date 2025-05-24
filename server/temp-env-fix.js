// temp-env-fix.js - Temporary environment variable fix for production
// This file will set the correct environment variables for Turso in production

console.log('🔧 [TEMP-ENV-FIX] Starting environment check...');
console.log('🔧 [TEMP-ENV-FIX] NODE_ENV:', process.env.NODE_ENV);
console.log('🔧 [TEMP-ENV-FIX] Current DB_PROVIDER:', process.env.DB_PROVIDER);

// Apply fix in production environment
if (process.env.NODE_ENV === 'production') {
  console.log('🔧 [TEMP-ENV-FIX] Production environment detected, applying fixes...');
  
  // Set DB_PROVIDER to turso
  process.env.DB_PROVIDER = 'turso';
  
  // Set Turso credentials
  process.env.TURSO_DATABASE_URL = 'libsql://biblioteca-production-damdev80.aws-us-east-1.turso.io';
  process.env.TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDgxMTYyMDEsImlkIjoiNTkyNzk2MmQtNWU4Ny00YmJiLWEzZjEtOWJiZGUwMzAxMDYyIiwicmlkIjoiNTZkNzI3OGYtZWNlMy00YTNmLTg0NTEtZjYwYzczMDY4ZDVkIn0.s9-rbp7f1QKE0F-VP0qkt74LDcwgF7eq-0uRlM0WuC19o1NV1Xh70wR3w-KNe6MNYxHf7uSBFQH6bHNcBebTCA';
  
  // Set JWT secret
  process.env.JWT_SECRET = 'Kd5P8zLq9R2vX7mN3bTcF6jH4gA1sE0yW';
  
  console.log('✅ [TEMP-ENV-FIX] Environment variables set for Turso production');
  console.log('🔧 [TEMP-ENV-FIX] New DB_PROVIDER:', process.env.DB_PROVIDER);
  console.log('🔧 [TEMP-ENV-FIX] TURSO_DATABASE_URL present:', !!process.env.TURSO_DATABASE_URL);
  console.log('🔧 [TEMP-ENV-FIX] TURSO_AUTH_TOKEN present:', !!process.env.TURSO_AUTH_TOKEN);
} else {
  console.log('ℹ️ [TEMP-ENV-FIX] Not in production environment, skipping fix');
}

export default {};
