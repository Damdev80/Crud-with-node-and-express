import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddBook />} />
      <Route path="/edit/:id" element={<EditBook />} />
    </Routes>
  );
}

