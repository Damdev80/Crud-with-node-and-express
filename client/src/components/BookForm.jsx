import React, { useState } from 'react';

const BookForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    author_id: initialData.author_id || '',
    category_id: initialData.category_id || '',
    publication_year: initialData.publication_year || '',
    isbn: initialData.isbn || '',
    available_copies: initialData.available_copies || '',
    description: initialData.description || '',
    cover_image: null,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = e => {
    setForm(prev => ({ ...prev, cover_image: e.target.files[0] }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Título" className="input" required />
      <input name="author_id" value={form.author_id} onChange={handleChange} placeholder="ID Autor" className="input" required />
      <input name="category_id" value={form.category_id} onChange={handleChange} placeholder="ID Categoría" className="input" required />
      <input name="publication_year" value={form.publication_year} onChange={handleChange} placeholder="Año publicación" className="input" />
      <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN" className="input" />
      <input name="available_copies" value={form.available_copies} onChange={handleChange} placeholder="Copias disponibles" className="input" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="textarea" />
      <input type="file" onChange={handleFile} className="input" />
      <button type="submit" className="bg-blue-600 text-white rounded-xl py-2 px-4">Guardar</button>
    </form>
  );
};

export default BookForm;