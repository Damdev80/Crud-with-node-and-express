// Servicio para obtener categorías, autores y editoriales desde el backend

export const getCategories = async () => {
  const res = await fetch('http://localhost:3000/api/categories');
  if (!res.ok) throw new Error('Error al obtener categorías');
  return await res.json();
};

export const getAuthors = async () => {
  const res = await fetch('http://localhost:3000/api/authors');
  if (!res.ok) throw new Error('Error al obtener autores');
  return await res.json();
};

export const getEditorials = async () => {
  const res = await fetch('http://localhost:3000/api/editorials');
  if (!res.ok) throw new Error('Error al obtener editoriales');
  return await res.json();
};
