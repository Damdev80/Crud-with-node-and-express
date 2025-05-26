import { useState, useEffect } from 'react';
import { FaBook, FaExclamationTriangle } from 'react-icons/fa';
import { processBookImageUrl, checkImageAvailability, CATEGORY_CONFIG } from '../utils/imageUrls';

const BookImageOptimized = ({ 
  originalImage,
  bookTitle,
  categoryId,
  alt,
  className = "",
  onImageError = null
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imageStatus, setImageStatus] = useState('loading');
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setImageStatus('loading');
      
      const { primary, fallback } = processBookImageUrl(originalImage, categoryId, bookTitle);
      
      // Intentar cargar la imagen principal primero
      if (primary && !hasTriedFallback) {
        const isAvailable = await checkImageAvailability(primary);
        if (isAvailable) {
          setCurrentImageUrl(primary);
          setImageStatus('loaded');
          return;
        }
      }
      
      // Si falla la principal, usar fallback
      if (fallback) {
        const isFallbackAvailable = await checkImageAvailability(fallback);
        if (isFallbackAvailable) {
          setCurrentImageUrl(fallback);
          setImageStatus('loaded');
          setHasTriedFallback(true);
          
          // Reportar que usamos fallback
          if (onImageError && primary) {
            onImageError(primary);
          }
          return;
        }
      }
      
      // Si todo falla, mostrar placeholder
      setImageStatus('placeholder');
    };

    loadImage();
  }, [originalImage, categoryId, bookTitle, hasTriedFallback, onImageError]);

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
          onError={() => {
            // Si falla después de cargar, intentar fallback
            if (!hasTriedFallback) {
              setHasTriedFallback(true);
              setImageStatus('loading');
            } else {
              setImageStatus('placeholder');
            }
          }}
        />
        
        {/* Indicador de que es imagen de fallback */}
        {hasTriedFallback && (
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
