// Servicio para obtener préstamos desde el backend
import apiService from './apiService.js';

export const getLoans = async () => {
  try {
    const data = await apiService.get('/loans');
    // Compatibilidad con respuesta { success, data }
    return Array.isArray(data) ? data : data.data;
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    throw new Error('Error al obtener préstamos');
  }
};
