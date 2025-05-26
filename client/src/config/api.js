/**
 * Configuración centralizada para URLs de la API
 */

// Determinar la URL de la API según el entorno
const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';
const DEV_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const PROD_API_URL = import.meta.env.VITE_PRODUCTION_API_URL || 'https://crud-with-node-and-express.onrender.com';

// URL base de la API
export const API_BASE_URL = NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;

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
