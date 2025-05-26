// Hook para manejar imágenes faltantes y notificar problemas de persistencia
import { useState } from 'react';

const useImagePersistence = () => {
  const [missingImages, setMissingImages] = useState([]);
  const [storageIssueDetected, setStorageIssueDetected] = useState(false);

  // Contador de errores de imágenes en la sesión actual
  const [errorCount, setErrorCount] = useState(0);
  const ERROR_THRESHOLD = 3; // Umbral para detectar problema sistemático

  const reportMissingImage = (imageSrc, context = '') => {
    console.warn(`🖼️ Missing image detected: ${imageSrc} (${context})`);
    
    setMissingImages(prev => {
      const newEntry = {
        src: imageSrc,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      // Evitar duplicados
      const exists = prev.some(img => img.src === imageSrc);
      if (exists) return prev;

      const updated = [...prev, newEntry];
      
      // Incrementar contador de errores
      setErrorCount(prev => prev + 1);
      
      // Detectar problema sistemático
      if (updated.length >= ERROR_THRESHOLD) {
        setStorageIssueDetected(true);
        reportStorageIssue(updated);
      }

      return updated;
    });
  };
  const reportStorageIssue = async (missingImagesList) => {
    try {
      // Log detallado del problema
      console.error('🚨 STORAGE PERSISTENCE ISSUE DETECTED', {
        missingCount: missingImagesList.length,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        missingImages: missingImagesList
      });

    } catch (error) {
      console.error('Error reporting storage issue:', error);
    }
  };

  const getStorageStatus = () => {
    return {
      hasIssues: storageIssueDetected,
      missingCount: missingImages.length,
      errorCount,
      recommendation: storageIssueDetected 
        ? 'CLOUD_STORAGE_MIGRATION_NEEDED' 
        : 'OK'
    };
  };

  const clearMissingImages = () => {
    setMissingImages([]);
    setErrorCount(0);
    setStorageIssueDetected(false);
  };

  return {
    reportMissingImage,
    missingImages,
    storageIssueDetected,
    getStorageStatus,
    clearMissingImages,
    errorCount
  };
};

export default useImagePersistence;
