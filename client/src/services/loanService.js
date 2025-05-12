// Servicio para obtener préstamos desde el backend

export const getLoans = async () => {
  const res = await fetch('http://localhost:3000/api/loans');
  if (!res.ok) throw new Error('Error al obtener préstamos');
  const data = await res.json();
  // Compatibilidad con respuesta { success, data }
  return Array.isArray(data) ? data : data.data;
};
