import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import AuthorDashboard from './pages/AuthorDashboard';
import LoanDashboard from './pages/LoanDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add" element={<AddBook />} />
      <Route path="/edit/:id" element={<EditBook />} />
      <Route path="/author-dashboard" element={<AuthorDashboard />} />
      <Route path="/loan-dashboard" element={<LoanDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

