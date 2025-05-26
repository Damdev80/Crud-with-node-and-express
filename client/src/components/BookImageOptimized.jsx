import { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api.js';
import { getFallbackImageUrl, CATEGORY_CONFIG } from '../utils/imageUrls';

const BookImageOptimized = ({ 
  originalImage,
  bookTitle,
  categoryId,
  alt,
  className = "",
  onImageError = null
}) => {
  const [imageStatus, setImageStatus] = useState('loading');
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);  useEffect(() => {
    if (!originalImage) {
      // Si no hay imagen original, ir directo al placeholder
      setImageStatus('placeholder');
      return;
    }

    // Construir URL de la imagen original
    let primaryUrl;
    if (originalImage.startsWith('http')) {
      primaryUrl = originalImage;
    } else {
      primaryUrl = `${API_ENDPOINTS.uploads}/${originalImage}`;
    }

    setImageStatus('loading');
    setCurrentImageUrl(primaryUrl);
    setUsedFallback(false);
    
    // Precargar imagen para verificar que existe
    const img = new Image();
    
    img.onload = () => {
      setImageStatus('loaded');
    };
    
    img.onerror = () => {
      console.warn(`⚠️ Failed to load original image: ${primaryUrl} for book: ${bookTitle}`);
      
      // Intentar fallback solo si falla la original
      const fallbackUrl = getFallbackImageUrl(categoryId, bookTitle);
      
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setCurrentImageUrl(fallbackUrl);
        setImageStatus('loaded');
        setUsedFallback(true);
        if (onImageError) onImageError(primaryUrl);
      };
      
      fallbackImg.onerror = () => {
        console.error(`❌ Fallback image also failed for book: ${bookTitle}`);
        setImageStatus('placeholder');
      };
      
      fallbackImg.src = fallbackUrl;
    };
    
    img.src = primaryUrl;
  }, [originalImage, categoryId, bookTitle, onImageError]);
  // Loading state
  if (imageStatus === 'loading') {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center animate-pulse`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#79b2e9] mx-auto mb-2"></div>
          <p className="text-xs text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  // Successfully loaded image
  if (imageStatus === 'loaded' && currentImageUrl) {
    return (
      <div className={`${className} relative`}>
        <img
          src={currentImageUrl}
          alt={alt || bookTitle}
          className="w-full h-full object-cover"
        />
        
        {/* Indicador de que es imagen de fallback */}
        {usedFallback && (
          <div className="absolute top-1 right-1">
            <div 
              className="bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded"
              title="Imagen de respaldo"
            >
              📷
            </div>
          </div>
        )}
      </div>
    );
  }

  // Placeholder (cuando no hay imagen disponible)
  const categoryConfig = CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG.default;
  
  return (
    <div 
      className={`${className} flex flex-col items-center justify-center text-white relative overflow-hidden`}
      style={{ 
        background: `linear-gradient(135deg, ${categoryConfig.color}AA, ${categoryConfig.color}DD)` 
      }}
    >
      {/* Patrón de fondo sutil */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="relative z-10 text-center p-4">
        <FaBook className="text-3xl mb-2 opacity-80" />
        <p className="text-xs text-center opacity-90 px-2 leading-tight">
          {bookTitle ? (
            <>
              <span className="font-medium block mb-1">{bookTitle}</span>
              <span className="opacity-75">{categoryConfig.name}</span>
            </>
          ) : (
            'Sin portada'
          )}
        </p>
      </div>
      
      {/* Badge de categoría */}
      <div className="absolute bottom-1 left-1">
        <div className="bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
          {categoryConfig.name}
        </div>
      </div>
    </div>
  );
};

export default BookImageOptimized;
