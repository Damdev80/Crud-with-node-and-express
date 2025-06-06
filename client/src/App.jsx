import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import AuthorDashboard from './pages/AuthorDashboard';
import LoanDashboard from './pages/LoanDashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryDashboard from './pages/CategoryDashboard';
import EditorialDashboard from './pages/EditorialDashboard';
import UserAdminDashboard from './pages/UserAdminDashboardSimple';
import { AuthProvider } from './context/AuthContext';
import { StorageProvider } from './context/StorageContext';
import ProtectedRoute from './components/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <StorageProvider>
        <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard principal (accesible para todos los usuarios) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>          } 
        />
        
        {/* Historial de préstamos (accesible para todos los usuarios) */}
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas para bibliotecarios y admins */}
        <Route 
          path="/add" 
          element={
            <ProtectedRoute roles={['librarian', 'admin']}>
              <AddBook />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit/:id" 
          element={
            <ProtectedRoute roles={['librarian', 'admin']}>
              <EditBook />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/author-dashboard" 
          element={
            <ProtectedRoute roles={['librarian', 'admin']}>
              <AuthorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/loan-dashboard" 
          element={
            <ProtectedRoute roles={['librarian', 'admin']}>
              <LoanDashboard />
            </ProtectedRoute>
          } 
        />        <Route 
          path="/category-dashboard" 
          element={
            <ProtectedRoute roles={['librarian', 'admin']}>
              <CategoryDashboard />
            </ProtectedRoute>
          }        />
        <Route 
          path="/editorial-dashboard" 
          element={
            <ProtectedRoute roles={['librarian', 'admin']}>
              <EditorialDashboard />        </ProtectedRoute>
          } 
        />
        
        {/* Ruta de administración de usuarios (solo para administradores) */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute roles={['admin']}>
              <UserAdminDashboard />
            </ProtectedRoute>
          }        />
      </Routes>
      </StorageProvider>
    </AuthProvider>
  );
}

