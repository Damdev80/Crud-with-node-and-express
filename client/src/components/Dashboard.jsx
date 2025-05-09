import React from 'react';
import BookList from '../components/BookList';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catálogo de Libros</h1>
      <BookList />
    </div>
  );
};

export default Dashboard;
