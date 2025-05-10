import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import AuthorDashboard from './pages/AuthorDashboard';
import LoanDashboard from './pages/LoanDashboard';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddBook />} />
      <Route path="/edit/:id" element={<EditBook />} />
      <Route path="/author-dashboard" element={<AuthorDashboard />} />
      <Route path="/loan-dashboard" element={<LoanDashboard />} />
    </Routes>
  );
}

