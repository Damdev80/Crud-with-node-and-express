// temp-env-fix.js - Temporary environment variable fix for production
// This file will set the correct environment variables for Turso in production

// Only run this in production when DB_PROVIDER is not already set to turso
if (process.env.NODE_ENV === 'production' && process.env.DB_PROVIDER !== 'turso') {
  console.log('🔧 [TEMP-ENV-FIX] Applying production environment fixes...');
  
  // Set DB_PROVIDER to turso
  process.env.DB_PROVIDER = 'turso';
  
  // Set Turso credentials
  process.env.TURSO_DATABASE_URL = 'libsql://biblioteca-production-damdev80.aws-us-east-1.turso.io';
  process.env.TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDgxMTYyMDEsImlkIjoiNTkyNzk2MmQtNWU4Ny00YmJiLWEzZjEtOWJiZGUwMzAxMDYyIiwicmlkIjoiNTZkNzI3OGYtZWNlMy00YTNmLTg0NTEtZjYwYzczMDY4ZDVkIn0.s9-rbp7f1QKE0F-VP0qkt74LDcwgF7eq-0uRlM0WuC19o1NV1Xh70wR3w-KNe6MNYxHf7uSBFQH6bHNcBebTCA';
  
  // Set JWT secret
  process.env.JWT_SECRET = 'Kd5P8zLq9R2vX7mN3bTcF6jH4gA1sE0yW';
  
  console.log('✅ [TEMP-ENV-FIX] Environment variables set for Turso production');
  console.log('🔧 [TEMP-ENV-FIX] DB_PROVIDER:', process.env.DB_PROVIDER);
  console.log('🔧 [TEMP-ENV-FIX] TURSO_DATABASE_URL present:', !!process.env.TURSO_DATABASE_URL);
  console.log('🔧 [TEMP-ENV-FIX] TURSO_AUTH_TOKEN present:', !!process.env.TURSO_AUTH_TOKEN);
}

export default {};
