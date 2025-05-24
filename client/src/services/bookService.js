import apiService from './apiService.js';

export const getBooks = async () => {
  try {
    const data = await apiService.get('/books');
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener libros:', error);
    return [];
  }
};
