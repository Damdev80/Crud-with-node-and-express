import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserEdit, FaTrash, FaUserCog, FaUserPlus, FaFilter, FaSearch, FaTimes, FaChevronLeft, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import CreateUserForm from '../components/CreateUserForm';
import UserView from '../components/UserView';

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
  };  // Eliminar usuario
  const handleDeleteUser = async (userId) => {
    try {
      if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        console.log('Eliminando usuario con ID:', userId);
        
        // Hacer la solicitud al backend para eliminar el usuario
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            // En un entorno de producción, usar un token JWT
            'x-user-id': user?.user_id,
            'x-user-role': user?.role
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar usuario');
        }

        // Si la eliminación fue exitosa, actualizar la UI
        const updatedUsers = users.filter(u => u.user_id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers.filter(u => {
          // Mantener los filtros actuales
          const matchesSearch = !searchTerm || 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesRole = roleFilter === 'all' || u.role === roleFilter;
          return matchesSearch && matchesRole;
        }));
        
        console.log('Usuario eliminado correctamente');
        alert('Usuario eliminado correctamente');
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert(`Error al eliminar usuario: ${err.message}`);
    }
  };  // Cambiar rol de usuario
  const handleChangeRole = async (userId, newRole) => {
    try {
      console.log(`Cambiando rol para usuario ${userId} a ${newRole}`);
        const userToUpdate = users.find(u => u.user_id === userId);
      if (!userToUpdate) {
        throw new Error('Usuario no encontrado');
      }

      // Hacer la solicitud al backend para actualizar el rol del usuario
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          // En un entorno de producción, usar un token JWT
          'x-user-id': user?.user_id,
          'x-user-role': user?.role
        },
        body: JSON.stringify({ 
          ...userToUpdate, 
          role: newRole 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar rol');
      }

      // Si la actualización fue exitosa, actualizar la UI
      const updatedUsers = users.map(u => 
        u.user_id === userId ? { ...u, role: newRole } : u
      );
      
      setUsers(updatedUsers);
      
      // También actualizar los usuarios filtrados para que la UI se actualice inmediatamente
      setFilteredUsers(prev => 
        prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u)
      );
      
      console.log(`Rol actualizado a: ${newRole} para usuario ID: ${userId}`);
      alert(`Rol actualizado correctamente a: ${getRoleName(newRole)}`);
    } catch (err) {
      console.error('Error al actualizar rol:', err);
      alert(`Error al actualizar rol: ${err.message}`);
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
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-red-100">
          <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-3 rounded-full inline-flex mb-4">
            <FaUserCog className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">
            Esta página está disponible solo para administradores. No tienes permisos suficientes para acceder.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto shadow-md"
          >
            <FaChevronLeft className="mr-2" /> Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 transition-all">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado mejorado con animaciones */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 animate-fadeIn">
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
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center shadow-md hover:shadow-lg ${showCreateForm ? 'bg-red-600' : ''}`}
            >
              {showCreateForm ? (
                <>
                  <FaArrowLeft className="mr-2" /> Volver a Usuarios
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" /> Crear Usuario
                </>
              )}
            </button>
          </div>
        </div>

        {/* Formulario de creación de usuario con animación */}
        {showCreateForm ? (
          <div className="mb-8 animate-scaleIn">
            <CreateUserForm onSuccess={() => {
              setShowCreateForm(false);
              fetchUsers();
            }} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            {/* Filtros mejorados con mejor UI */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 border border-blue-50 transition-all">
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
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                  }}
                  className={`bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center ${(!searchTerm && roleFilter === 'all') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!searchTerm && roleFilter === 'all'}
                >
                  <FaTimes className="mr-2" /> Limpiar filtros
                </button>
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

            {/* Componente de vista de usuarios con contenedor optimizado */}
            <div className="max-w-full overflow-hidden bg-gray-50 rounded-xl shadow-sm border border-gray-100">
              <UserView 
                users={filteredUsers}
                loading={loading}
                error={error}
                onChangeRole={handleChangeRole}
                onDeleteUser={handleDeleteUser}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAdminDashboard;
