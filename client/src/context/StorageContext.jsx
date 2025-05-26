import  { createContext, useContext, useState, useEffect } from 'react';
import useImagePersistence from '../hooks/useImagePersistence';
import StorageIssueNotification from '../components/StorageIssueNotification';

const StorageContext = createContext();

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

export const StorageProvider = ({ children }) => {
  const { 
    reportMissingImage, 
    missingImages, 
    storageIssueDetected, 
    getStorageStatus,
    clearMissingImages,
    errorCount 
  } = useImagePersistence();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);

  // Mostrar notificación cuando se detecte un problema de almacenamiento
  useEffect(() => {
    if (storageIssueDetected && !notificationDismissed) {
      setShowNotification(true);
    }
  }, [storageIssueDetected, notificationDismissed]);

  const dismissNotification = () => {
    setShowNotification(false);
    setNotificationDismissed(true);
    
    // Auto-reset después de 5 minutos para permitir nuevas notificaciones
    setTimeout(() => {
      setNotificationDismissed(false);
    }, 5 * 60 * 1000);
  };

  const contextValue = {
    reportMissingImage,
    missingImages,
    storageIssueDetected,
    getStorageStatus,
    clearMissingImages,
    errorCount,
    showNotification,
    dismissNotification
  };

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
      <StorageIssueNotification
        isVisible={showNotification}
        onDismiss={dismissNotification}
        missingCount={missingImages.length}
        storageStatus={getStorageStatus()}
      />
    </StorageContext.Provider>
  );
};

export default StorageContext;
