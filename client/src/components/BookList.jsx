import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import BookModal from './BookModal';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/books')
      .then(res => res.json())
      .then(data => setBooks(data.data || []));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {books.map(book => (
        <BookCard key={book.book_id} book={book} onClick={() => setSelected(book)} />
      ))}
      <BookModal open={!!selected} onOpenChange={() => setSelected(null)} book={selected} />
    </div>
  );
};

export default BookList;