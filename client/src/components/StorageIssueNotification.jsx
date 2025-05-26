import React from 'react';
import { FaExclamationTriangle, FaCloud, FaTimes } from 'react-icons/fa';

const StorageIssueNotification = ({ 
  isVisible, 
  onDismiss, 
  missingCount = 0,
  storageStatus = {} 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 shadow-lg rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              Problema de Almacenamiento Detectado
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Se detectaron {missingCount} imágenes faltantes. Esto puede ser debido a:
              </p>
              <ul className="mt-2 list-disc list-inside">
                <li>Almacenamiento temporal en el servidor</li>
                <li>Reinicios del sistema</li>
                <li>Problemas de conectividad</li>
              </ul>
            </div>
            <div className="mt-3">
              <div className="flex items-center text-sm">
                <FaCloud className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-amber-800 font-medium">
                  Recomendación: Migración a almacenamiento en la nube
                </span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onDismiss}
              className="rounded-md bg-amber-50 text-amber-400 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-amber-50"
            >
              <span className="sr-only">Dismiss</span>
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {storageStatus.recommendation && (
          <div className="mt-3 pt-3 border-t border-amber-200">
            <div className="text-xs text-amber-600">
              <strong>Estado:</strong> {storageStatus.recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageIssueNotification;
