import BookForm from '../components/BookForm';

export default function AddBook() {
  const handleAdd = async (data) => {
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }

    await fetch('http://localhost:3000/api/books/with-image', {
      method: 'POST',
      body: formData,
    });

    window.location.href = '/';
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Agregar Libro</h2>
      <BookForm onSubmit={handleAdd} />
    </div>
  );
}
