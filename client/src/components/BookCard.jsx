import React from 'react';

const BookCard = ({ book, onClick }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(book)}
    >
      <img
        src={`http://localhost:3000/uploads/${book.cover_image}`}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-1">{book.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-2">{book.description}</p>
      </div>
    </div>
  );
};

export default BookCard;
