import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserEdit, FaTrash, FaUserCog, FaUserPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import CreateUserForm from '../components/CreateUserForm';

const UserAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuarios
  useEffect(() => {
    if (users.length > 0) {
      let filtered = [...users];

      // Filtrar por término de búsqueda
      if (searchTerm) {
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filtrar por rol
      if (roleFilter !== 'all') {
        filtered = filtered.filter((u) => u.role === roleFilter);
      }

      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, roleFilter]);

  // Obtener usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Para este ejemplo, usamos el endpoint normal de usuarios
      // En una implementación real, deberías tener un endpoint específico para administradores
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          // En un sistema real, aquí irían los headers de autenticación
          'x-user-id': user?.user_id, // Simulamos headers para nuestro middleware
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
      // Para desarrollo, podemos usar datos de muestra
      const sampleUsers = getSampleUsers();
      setUsers(sampleUsers);
      setFilteredUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      // En un sistema real, enviar solicitud de eliminación
      // await fetch(`http://localhost:3000/api/users/${userId}`, {
      //   method: 'DELETE',
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Para este ejemplo, simplemente filtrar del estado
      setUsers(users.filter(u => u.user_id !== userId));
      alert('Usuario eliminado correctamente');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error al eliminar usuario');
    }
  };

  // Cambiar rol de usuario
  const handleChangeRole = async (userId, newRole) => {
    try {
      // En un sistema real, actualizar rol con una llamada a la API
      // await fetch(`http://localhost:3000/api/users/${userId}`, {
      //   method: 'PATCH',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}` 
      //   },
      //   body: JSON.stringify({ role: newRole })
      // });

      // Para este ejemplo, actualizar en el estado local
      setUsers(
        users.map(u => 
          u.user_id === userId ? { ...u, role: newRole } : u
        )
      );
      alert(`Rol actualizado a: ${newRole}`);
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Error al actualizar rol');
    }
  };

  // Usuarios de ejemplo para desarrollo
  const getSampleUsers = () => [
    { user_id: 1, name: 'Admin Usuario', email: 'admin@biblioteca.com', role: 'admin' },
    { user_id: 2, name: 'Bibliotecario Ejemplo', email: 'bibliotecario@biblioteca.com', role: 'librarian' },
    { user_id: 3, name: 'Usuario Normal', email: 'usuario@ejemplo.com', role: 'user' },
    { user_id: 4, name: 'Ana García', email: 'ana@ejemplo.com', role: 'user' },
    { user_id: 5, name: 'Carlos López', email: 'carlos@biblioteca.com', role: 'librarian' }
  ];

  // Mostrar mensaje si no es administrador
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 text-red-700 p-3 rounded-full inline-flex mb-4">
            <FaUserCog className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">
            Esta página está disponible solo para administradores. No tienes permisos suficientes para acceder.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Función para obtener el estilo de la insignia según el rol
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'librarian':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el nombre visible del rol
  const getRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'librarian':
        return 'Bibliotecario';
      default:
        return 'Usuario';
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaUserCog className="mr-2 text-blue-600" /> Administración de Usuarios
            </h1>
            <p className="text-gray-600 mt-1">Gestiona los usuarios y sus permisos en el sistema</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              {showCreateForm ? (
                <>
                  <FaFilter className="mr-2" /> Ver Usuarios
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" /> Crear Usuario
                </>
              )}
            </button>
          </div>
        </div>

        {/* Formulario de creación de usuario */}
        {showCreateForm ? (
          <div className="mb-8">
            <CreateUserForm />
          </div>
        ) : (
          <>
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full md:w-40 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="user">Usuarios</option>
                    <option value="librarian">Bibliotecarios</option>
                    <option value="admin">Administradores</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {/* Listado de usuarios */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-gray-600">Cargando usuarios...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
                    {error}
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <FaUser className="mx-auto text-gray-400 text-4xl mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No se encontraron usuarios</h3>
                  <p className="text-gray-500">
                    {searchTerm || roleFilter !== 'all'
                      ? 'Prueba con diferentes criterios de búsqueda'
                      : 'No hay usuarios registrados en el sistema'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 text-blue-700 p-2 rounded-full mr-3">
                                <FaUser />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500">ID: {user.user_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-gray-700">{user.email}</td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeStyle(
                                user.role
                              )}`}
                            >
                              {getRoleName(user.role)}
                            </span>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <div className="flex justify-end gap-2">
                              <select
                                value={user.role}
                                onChange={(e) => handleChangeRole(user.user_id, e.target.value)}
                                className="text-xs border border-gray-300 rounded p-1 bg-white"
                              >
                                <option value="user">Usuario</option>
                                <option value="librarian">Bibliotecario</option>
                                <option value="admin">Administrador</option>
                              </select>
                              <button
                                onClick={() => handleDeleteUser(user.user_id)}
                                className="text-red-600 hover:text-red-800 p-1"
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
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAdminDashboard;
