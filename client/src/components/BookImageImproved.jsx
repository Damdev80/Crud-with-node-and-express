import { useState, useEffect } from 'react';
import { FaBook, FaExclamationTriangle, FaImage } from 'react-icons/fa';
import useImagePersistence from '../hooks/useImagePersistence';

const BookImage = ({ 
  src, 
  alt, 
  className = "", 
  fallbackType = "book", // "book", "placeholder", "none"
  onImageError = null,
  bookTitle = "" // Para context en el reporte
}) => {
  const [imageStatus, setImageStatus] = useState('loading');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  const { reportMissingImage } = useImagePersistence();

  useEffect(() => {
    if (!src) {
      setImageStatus('no-src');
      return;
    }

    setImageStatus('loading');
    
    // Preload image to check if it exists
    const img = new Image();
    
    img.onload = () => {
      setImageStatus('loaded');
    };
    
    img.onerror = () => {
      if (retryCount < maxRetries) {
        // Retry loading after a short delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        setImageStatus('error');
        
        // Reportar imagen faltante al sistema de persistencia
        if (src) {
          reportMissingImage(src, bookTitle ? `Book: ${bookTitle}` : 'Book cover');
        }
        
        if (onImageError) {
          onImageError(src);
        }
      }
    };
    
    img.src = src;
  }, [src, retryCount, maxRetries, onImageError, bookTitle, reportMissingImage]);

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
  if (imageStatus === 'loaded') {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  // Error or no source - show fallback
  const renderFallback = () => {
    switch (fallbackType) {
      case 'book':
        return (
          <div className={`${className} bg-gradient-to-br from-[#e3f0fb] to-[#79b2e9] flex flex-col items-center justify-center text-white`}>
            <FaBook className="text-3xl mb-2 opacity-80" />
            <p className="text-xs text-center opacity-90 px-2">
              Sin portada
            </p>
          </div>
        );
      
      case 'placeholder':
        return (
          <div className={`${className} bg-gray-200 flex flex-col items-center justify-center text-gray-500`}>
            <FaImage className="text-2xl mb-1" />
            <p className="text-xs text-center px-2">
              Imagen no disponible
            </p>
          </div>
        );
      
      case 'error':
        return (
          <div className={`${className} bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-500`}>
            <FaExclamationTriangle className="text-2xl mb-1" />
            <p className="text-xs text-center px-2">
              Error al cargar
            </p>
            {retryCount > 0 && (
              <button
                onClick={() => setRetryCount(0)}
                className="text-xs mt-1 underline hover:no-underline"
              >
                Reintentar
              </button>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderFallback();
};

export default BookImage;
