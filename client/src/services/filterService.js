// Servicio para obtener categorías, autores y editoriales desde el backend
import { apiRequest } from './apiService.js';

export const getCategories = async () => {
  const response = await apiRequest('/categories');
  if (!response.success) throw new Error('Error al obtener categorías');
  return response;
};

export const getAuthors = async () => {
  const response = await apiRequest('/authors');
  if (!response.success) throw new Error('Error al obtener autores');
  return response;
};

export const getEditorials = async () => {
  const response = await apiRequest('/editorials');
  if (!response.success) throw new Error('Error al obtener editoriales');
  return response;
};
