// Utilitarios para manejo de URLs de imágenes con fallbacks robustos
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Banco de imágenes de fallback por categoría
const FALLBACK_IMAGES = {
  // Novelas
  '1': [
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format'
  ],
  // Poesía  
  '2': [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop&auto=format'
  ],
  // Ensayo
  '3': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format'
  ],
  // Ciencia Ficción
  '4': [
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1614849286447-520e2193fa6e?w=300&h=400&fit=crop&auto=format'
  ],
  // Historia
  '5': [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop&auto=format'
  ],
  // Default (cualquier categoría)
  'default': [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop&auto=format'
  ]
};

/**
 * Genera una URL de imagen fallback basada en la categoría y título del libro
 * @param {string} categoryId - ID de la categoría del libro
 * @param {string} bookTitle - Título del libro para consistencia
 * @returns {string} URL de imagen fallback
 */
export const getFallbackImageUrl = (categoryId, bookTitle = '') => {
  const categoryImages = FALLBACK_IMAGES[categoryId] || FALLBACK_IMAGES.default;
  
  // Usar el título del libro para seleccionar consistentemente la misma imagen
  let index = 0;
  if (bookTitle) {
    // Crear un hash simple del título para consistencia
    index = bookTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % categoryImages.length;
  }
  
  return categoryImages[index];
};

/**
 * Procesa la URL de imagen del libro con fallbacks
 * @param {string} originalImage - URL de imagen original del libro
 * @param {string} categoryId - ID de categoría para fallback
 * @param {string} bookTitle - Título del libro
 * @returns {object} Objeto con URLs primary y fallback
 */
export const processBookImageUrl = (originalImage, categoryId, bookTitle = '') => {
  let primaryUrl = null;
  let fallbackUrl = getFallbackImageUrl(categoryId, bookTitle);

  // Si tenemos imagen original
  if (originalImage) {
    // Si ya es una URL externa (http/https), usarla directamente
    if (originalImage.startsWith('http')) {
      primaryUrl = originalImage;
    } else {
      // Construir URL del servidor
      primaryUrl = `${API_BASE}/uploads/${originalImage}`;
    }
  }

  return {
    primary: primaryUrl,
    fallback: fallbackUrl,
    hasOriginal: !!originalImage
  };
};

/**
 * Hook para verificar si una imagen está disponible
 * @param {string} imageUrl - URL de la imagen a verificar
 * @returns {Promise<boolean>} Promise que resuelve true si la imagen está disponible
 */
export const checkImageAvailability = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve(false);
      return;
    }

    const img = new Image();
    
    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000); // Timeout de 5 segundos

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };

    img.src = imageUrl;
  });
};

/**
 * Configuración de categorías para el sistema de fallbacks
 */
export const CATEGORY_CONFIG = {
  '1': { name: 'Novela', color: '#3B82F6' },
  '2': { name: 'Poesía', color: '#8B5CF6' },
  '3': { name: 'Ensayo', color: '#F59E0B' },
  '4': { name: 'Ciencia Ficción', color: '#10B981' },
  '5': { name: 'Historia', color: '#EF4444' },
  'default': { name: 'General', color: '#6B7280' }
};

export default {
  getFallbackImageUrl,
  processBookImageUrl,
  checkImageAvailability,
  CATEGORY_CONFIG,
  FALLBACK_IMAGES
};
