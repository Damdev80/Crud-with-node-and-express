import React, { useState } from "react";
import { FaStar, FaBook, FaClock } from "react-icons/fa";
import { API_ENDPOINTS } from '../config/api.js';
import BookImage from './BookImage';

function BookCard({ book, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative h-[420px] w-[280px] cursor-pointer"
      style={{
        perspective: "1000px"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(book)}
    >
      {/* Efecto de libro con lomo */}
      <div 
        className={`absolute inset-0 transition-all duration-700`}
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered ? "rotateY(10deg)" : "rotateY(0deg)"
        }}
      >
        {/* Lomo del libro */}
        <div 
          className="absolute left-0 top-0 h-full w-[20px] rounded-l-md shadow-inner"
          style={{
            background: "linear-gradient(to right, #5d4037, #795548)",
            transformOrigin: "right",
          }}
        />

        {/* Portada del libro */}
        <div className="absolute inset-0 rounded-r-md overflow-hidden shadow-xl bg-white border-r border-t border-b border-gray-200">          {/* Imagen de portada */}
          <div className="relative h-[65%] overflow-hidden">
            <BookImage
              src={book.cover_image ? `${API_ENDPOINTS.uploads}/${book.cover_image}` : null}
              alt={book.title}
              className="w-full h-full transition-transform duration-700 group-hover:scale-110"
              fallbackType="book"
            />
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
              }}
            />
          </div>

          {/* Contenido del libro */}
          <div className="p-5 bg-white relative">
            <div className="flex justify-between items-start">
              <h2 
                className="text-xl font-bold text-gray-800 group-hover:text-amber-800 transition-colors"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {book.title}
              </h2>
              {book.rating && (
                <div className="flex items-center">
                  <FaStar className="h-4 w-4 text-amber-500" style={{ fill: "#f59e0b" }} />
                  <span className="ml-1 text-sm font-medium text-gray-600">{book.rating}</span>
                </div>
              )}
            </div>

            {book.author && <p className="text-sm text-gray-500 mt-1 italic">por {book.author}</p>}

            <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">{book.description}</p>

            {/* Detalles adicionales */}
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
              {book.pages && (
                <div className="flex items-center">
                  <FaBook className="h-3.5 w-3.5 mr-1 text-amber-700" />
                  <span>{book.pages} páginas</span>
                </div>
              )}

              {book.readTime && (
                <div className="flex items-center">
                  <FaClock className="h-3.5 w-3.5 mr-1 text-amber-700" />
                  <span>{book.readTime}</span>
                </div>
              )}

              {book.year && (
                <div className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fff3cd", color: "#92400e" }}>
                  {book.year}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sombra del libro */}
      <div 
        className="absolute -bottom-6 left-4 right-2 h-6 rounded-full transform-gpu transition-all duration-500 group-hover:opacity-70"
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
          filter: isHovered ? "blur(12px)" : "blur(8px)"
        }}
      />
    </div>
  );
}

export default BookCard;