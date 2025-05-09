

export const BookModal = ({ open, onOpenChange, book }) => {
  if (!open || !book) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto relative">
        <button
          onClick={onOpenChange}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <img
          src={`http://localhost:3000/uploads/${book.cover_image}`}
          alt={book.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
        <p className="text-sm text-gray-700 mb-2">{book.description}</p>
        <p className="text-sm text-gray-500">Autor: {book.first_name} {book.last_name}</p>
        <p className="text-sm text-gray-500">Categoría: {book.category_name}</p>
        <p className="text-sm text-gray-500">Año: {book.publication_year}</p>
        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
      </div>
    </div>
  );
};

export default BookModal;