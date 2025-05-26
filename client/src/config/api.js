/**
 * Configuración centralizada para URLs de la API
 */

// Determinar la URL de la API según el entorno
const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';
const DEV_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// En producción (Vercel), usamos rutas relativas porque vercel.json hace el rewrite
// En desarrollo, usamos la URL completa del backend local
export const API_BASE_URL = NODE_ENV === 'production' ? '' : DEV_API_URL;

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
