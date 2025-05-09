"use client"

import { useState } from "react"
import BookCard from "./BookCard"
import BookModal from "./BookModal"

const BookList = ({ books = [], viewMode = "grid", isLoading = false }) => {
  const [selected, setSelected] = useState(null)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-700">No hay libros disponibles</h3>
        <p className="mt-2 text-gray-500">Añade libros a tu biblioteca para comenzar</p>
      </div>
    )
  }

  return (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.book_id} book={book} onClick={() => setSelected(book)} />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {books.map((book) => (
            <div
              key={book.book_id}
              className="py-4 flex items-center hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelected(book)}
            >
              <div className="w-16 h-24 overflow-hidden rounded mr-4">
                <img
                  src={`http://localhost:3000/uploads/${book.cover_image}`}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author?.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  ISBN: {book.isbn || "N/A"} • Publicado: {book.publication_year || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {book.category?.name}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {book.available_copies} {book.available_copies === 1 ? "copia" : "copias"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <BookModal open={!!selected} onOpenChange={() => setSelected(null)} book={selected} />}
    </div>
  )
}

export default BookList
