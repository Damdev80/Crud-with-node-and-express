/**
 * Configuración centralizada para URLs de la API
 */

// Debug de variables de entorno
console.log('🔍 API Config Debug:', {
  'import.meta.env.MODE': import.meta.env.MODE,
  'import.meta.env.PROD': import.meta.env.PROD,
  'import.meta.env.DEV': import.meta.env.DEV,
  'import.meta.env.VITE_NODE_ENV': import.meta.env.VITE_NODE_ENV,
  'import.meta.env.VITE_API_URL': import.meta.env.VITE_API_URL,
  'window.location.origin': typeof window !== 'undefined' ? window.location.origin : 'N/A'
});

// Determinar el entorno - usar import.meta.env.PROD que es más confiable
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
const DEV_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// En producción (Vercel), SIEMPRE usar rutas relativas
// En desarrollo, usar la URL completa del backend local
export const API_BASE_URL = isProduction ? '' : DEV_API_URL;

console.log('🚀 API Configuration:', {
  isProduction,
  DEV_API_URL,
  API_BASE_URL,
  finalLoginUrl: `${isProduction ? '' : DEV_API_URL}/api/users/login`
});

// URLs completas para diferentes endpoints
export const API_ENDPOINTS = {
  books: `${API_BASE_URL}/api/books`,
  authors: `${API_BASE_URL}/api/authors`,
  categories: `${API_BASE_URL}/api/categories`,
  editorials: `${API_BASE_URL}/api/editorials`,
  loans: `${API_BASE_URL}/api/loans`,
  users: `${API_BASE_URL}/api/users`,
  uploads: `${API_BASE_URL}/uploads`
};

export default {
  API_BASE_URL,
  API_ENDPOINTS
};
