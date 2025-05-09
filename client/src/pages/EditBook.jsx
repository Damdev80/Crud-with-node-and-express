import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BookForm from '../components/BookForm';

export default function EditBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data.data));
  }, [id]);

  const handleEdit = async (formData) => {
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    await fetch(`http://localhost:3000/api/books/${id}`, {
      method: 'PUT',
      body: data,
    });

    window.location.href = '/';
  };

  if (!book) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Editar Libro</h2>
      <BookForm onSubmit={handleEdit} initialData={book} />
    </div>
  );
}
