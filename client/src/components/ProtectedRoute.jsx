import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rutas según los roles de usuario
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijo a renderizar si el usuario está autorizado
 * @param {string|string[]} [props.roles] - Roles permitidos para acceder a esta ruta
 * @param {boolean} [props.authRequired=true] - Si se requiere autenticación para la ruta
 */
const ProtectedRoute = ({ children, roles, authRequired = true }) => {
  const { user, loading, hasRole } = useAuth();

  // Mientras se carga la información del usuario, mostramos un spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no se requiere autenticación, renderizar el componente hijo
  if (!authRequired) {
    return children;
  }

  // Si se requiere autenticación y no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se requieren roles específicos y el usuario no tiene ese rol, mostrar página de acceso denegado
  if (roles && !hasRole(roles)) {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos suficientes para acceder a esta página.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;
