import { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.js';

// Crear el contexto
const AuthContext = createContext();

// Función para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde el almacenamiento local al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.users}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Guardar usuario en estado y localStorage
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      
      return data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.users}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (requiredRoles) => {
    if (!user) return false;
    
    // Convertir a array si es string
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    return roles.includes(user.role);
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => hasRole('admin');
  
  // Verificar si el usuario es bibliotecario
  const isLibrarian = () => hasRole('librarian');
  
  // Verificar si el usuario es bibliotecario o administrador
  const isLibrarianOrAdmin = () => hasRole(['librarian', 'admin']);

  // Proveedor de contexto
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        hasRole,
        isAdmin,
        isLibrarian,
        isLibrarianOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
