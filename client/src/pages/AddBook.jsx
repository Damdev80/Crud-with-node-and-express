import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../components/BookForm';
import { API_BASE_URL } from '../config/api.js';
import { getAuthHeadersFormData } from '../utils/authHeaders.js';

export default function AddBook() {
  const [pageTransition, setPageTransition] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setPageTransition(false), 10);
  }, []);

  const handleAdd = async (data) => {
    setPageTransition(true);
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }    await fetch(`${API_BASE_URL}/api/books/with-image`, {
      method: 'POST',
      headers: getAuthHeadersFormData(),
      body: formData,
    });
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div ref={containerRef} className={`p-6 transition-opacity duration-400 ${pageTransition ? 'opacity-0' : 'opacity-100'}`}>
      {/* Botón de regreso al dashboard */}
      <BookForm onSubmit={handleAdd} onCancel={() => navigate('/dashboard')} />
      {showSuccess && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ¡Libro agregado exitosamente!
          <div className="mt-2 text-sm text-gray-500">Redirigiendo al catálogo...</div>
        </div>
      )}
    </div>
  );
}
