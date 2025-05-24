/**
 * Servicio centralizado para la API
 * Maneja todas las peticiones al backend con una configuración común
 */

// Determinar la URL de la API según el entorno
const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';
const DEV_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const PROD_API_URL = import.meta.env.VITE_PRODUCTION_API_URL || 'https://biblioteca-api.onrender.com';

// URL base de la API
const API_URL = NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;

/**
 * Función genérica para hacer peticiones a la API
 * @param {string} endpoint - Endpoint a llamar, ej: '/books'
 * @param {Object} options - Opciones para fetch
 * @returns {Promise} - La respuesta de la API
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}/api${endpoint}`;
  
  // Obtener datos de autenticación del localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // Configuración por defecto de las cabeceras
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agregar cabeceras de autenticación si hay usuario
  if (user) {
    headers['x-user-id'] = user.user_id;
    headers['x-user-role'] = user.role;
  }

  // Configuración completa de la petición
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Manejar respuestas no JSON y errores
    if (!response.ok) {
      const errorData = await response.text();
      try {
        const parsedError = JSON.parse(errorData);
        throw new Error(parsedError.message || response.statusText);
      } catch (e) {
        throw new Error(errorData || response.statusText);
      }
    }
    
    // Intenta parsear como JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Métodos comunes para diferentes tipos de peticiones
 */
export const apiService = {
  // GET request
  get: (endpoint) => apiRequest(endpoint),
  
  // POST request
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // PUT request
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // DELETE request
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE'
  }),
  
  // Form data upload (para imágenes)
  upload: (endpoint, formData) => {
    return apiRequest(endpoint, {
      method: 'POST',
      headers: {}, // No incluir Content-Type para que el navegador lo establezca correctamente
      body: formData
    });
  },
  
  // URL base para recursos estáticos (imágenes)
  getResourceUrl: (path) => `${API_URL}${path}`
};

export default apiService;
