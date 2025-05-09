export const getBooks = async () => {
  const res = await fetch("http://localhost:3000/api/books");
  const data = await res.json();
  return data.data || [];
};
