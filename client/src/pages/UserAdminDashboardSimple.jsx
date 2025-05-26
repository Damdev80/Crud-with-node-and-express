import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserCog, FaUserPlus, FaFilter, FaSearch, FaTimes, FaChevronLeft, FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api.js';

const UserAdminDashboardSimple = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Calcular paginación
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Función para obtener el nombre del rol
  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'librarian': return 'Bibliotecario';
      case 'user': return 'Usuario';
      default: return role;
    }
  };
  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.users, {
        headers: {
          'x-user-id': user?.user_id,
          'x-user-role': user?.role
        }
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar los usuarios');
      }

      const data = await response.json();
      const usersData = data.data || [];
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Error al cargar usuarios');
      
      // Datos de muestra para desarrollo
      const sampleUsers = [
        { user_id: 1, name: 'Admin Principal', email: 'admin@biblioteca.com', role: 'admin' },
        { user_id: 2, name: 'Bibliotecario Juan', email: 'juan@biblioteca.com', role: 'librarian' },
        { user_id: 3, name: 'Usuario Maria', email: 'maria@ejemplo.com', role: 'user' },
      ];
      setUsers(sampleUsers);
      setFilteredUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id, user?.role]);
  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtrar usuarios
  useEffect(() => {
    if (users.length > 0) {
      let filtered = [...users];

      if (searchTerm) {
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (roleFilter !== 'all') {
        filtered = filtered.filter((u) => u.role === roleFilter);
      }

      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [users, searchTerm, roleFilter]);

  // Eliminar usuario
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
      const response = await fetch(`${API_ENDPOINTS.users}/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.user_id,
          'x-user-role': user?.role
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error al eliminar usuario: ' + err.message);
    }
  };

  // Cambiar rol de usuario
  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.users}/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.user_id,
          'x-user-role': user?.role
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Error al cambiar rol');
      }

      alert(`Rol actualizado correctamente a: ${getRoleName(newRole)}`);
      fetchUsers();
    } catch (err) {
      console.error('Error changing role:', err);
      alert('Error al cambiar rol: ' + err.message);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto shadow-md"
          >
            <FaChevronLeft className="mr-2" /> Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2366a8] flex items-center">
              <FaUserCog className="mr-2 text-[#2366a8]" /> 
              Administración de Usuarios
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona usuarios y sus permisos de acceso en el sistema
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center shadow-md hover:shadow-lg"
            >
              <FaChevronLeft className="mr-2" /> Volver al Dashboard
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 border border-blue-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full md:w-48 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="all">Todos los roles</option>
                  <option value="user">Usuarios</option>
                  <option value="librarian">Bibliotecarios</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Contador de resultados */}
          {filteredUsers.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Mostrando {filteredUsers.length} de {users.length} usuarios
              {searchTerm && <span> que coinciden con "{searchTerm}"</span>}
              {roleFilter !== 'all' && <span> con rol: {getRoleName(roleFilter)}</span>}
            </div>
          )}
        </div>

        {/* Lista de usuarios */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Cargando usuarios...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg inline-block">
                <span>{error}</span>
              </div>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="p-8 text-center">
              <FaUser className="mx-auto text-4xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron usuarios</h3>
              <p className="text-gray-500">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Intenta con otros filtros de búsqueda' 
                  : 'No hay usuarios registrados en el sistema'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Tabla de usuarios */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map((usr) => (
                      <tr key={usr.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`${
                              usr.role === 'admin' 
                                ? 'bg-purple-600' 
                                : usr.role === 'librarian'
                                  ? 'bg-blue-600'
                                  : 'bg-gray-600'
                            } text-white p-2 rounded-full mr-3`}>
                              <FaUser />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{usr.name}</div>
                              <div className="text-xs text-gray-500">ID: {usr.user_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{usr.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            usr.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : usr.role === 'librarian'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getRoleName(usr.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <div className="flex justify-end gap-2">
                            <select
                              value={usr.role}
                              onChange={(e) => handleChangeRole(usr.user_id, e.target.value)}
                              className="text-xs border border-gray-300 rounded-lg p-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="user">Usuario</option>
                              <option value="librarian">Bibliotecario</option>
                              <option value="admin">Administrador</option>
                            </select>
                            <button
                              onClick={() => handleDeleteUser(usr.user_id)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar usuario"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Información de paginación */}
                    <div className="text-sm text-gray-600">
                      Mostrando {((currentPage - 1) * usersPerPage) + 1} a {Math.min(currentPage * usersPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
                    </div>
                    
                    {/* Controles de paginación */}
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        ««
                      </button>
                      
                      <button
                        className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        «
                      </button>

                      <span className="px-4 py-2 text-sm font-medium">
                        {currentPage} de {totalPages}
                      </span>

                      <button
                        className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        »
                      </button>
                      
                      <button
                        className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        »»
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAdminDashboardSimple;
