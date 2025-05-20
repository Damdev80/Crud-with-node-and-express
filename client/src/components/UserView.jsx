// Componente de vista de usuarios que permite alternar entre tabla y tarjetas
import { useState } from 'react';
import { FaTable, FaThLarge, FaUser, FaSearch, FaChevronRight, FaInfoCircle, FaTrash } from 'react-icons/fa';
import UserCard from './UserCard';
import '../styles/animation.css';

const UserView = ({ users, loading, error, onChangeRole, onDeleteUser, searchTerm, setSearchTerm, roleFilter, setRoleFilter }) => {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' o 'table'
  const [animate, setAnimate] = useState(false);

  // Función para obtener el estilo de la insignia según el rol
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-400';
      case 'librarian':
        return 'bg-blue-100 text-blue-800 border-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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

  if (loading) {
    return (
      <div className="p-8 text-center animate-fadeIn">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-gray-600">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center animate-fadeIn">
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg inline-block">
          <FaInfoCircle className="inline mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center animate-fadeIn">
        <div className="bg-blue-50 p-8 rounded-xl inline-block shadow-sm">
          <FaUser className="mx-auto text-blue-500 text-5xl mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'all'
              ? 'Prueba con diferentes criterios de búsqueda'
              : 'No hay usuarios registrados en el sistema'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">      {/* Barra de herramientas mejorada */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 md:p-4 border-b border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/10 rounded-lg px-3 py-1.5 flex items-center">
              <FaUser className="text-blue-600 mr-2" />
              <span className="text-[#2366a8] font-medium text-sm md:text-base">
                {users.length} {users.length === 1 ? 'usuario' : 'usuarios'} 
              </span>
            </div>
            {(searchTerm || roleFilter !== 'all') && (
              <div className="text-xs md:text-sm text-gray-500 flex items-center">
                <FaChevronRight className="mx-1 text-gray-400" />
                <span className="hidden sm:inline">Filtros aplicados</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => {
                setAnimate(true);
                setTimeout(() => {
                  setViewMode('table');
                  setAnimate(false);
                }, 300);
              }}
              className={`p-2 rounded-lg ${
                viewMode === 'table'
                  ? 'bg-[#2366a8] text-white shadow-sm'
                  : 'bg-white text-[#2366a8] hover:bg-blue-50'
              } transition-all duration-300 flex items-center`}
              title="Vista de tabla"
            >
              <FaTable className="mr-1" />
              <span className="text-xs font-medium">Tabla</span>
            </button>
            <button
              onClick={() => {
                setAnimate(true);
                setTimeout(() => {
                  setViewMode('cards'); 
                  setAnimate(false);
                }, 300);
              }}
              className={`p-2 rounded-lg ${
                viewMode === 'cards'
                  ? 'bg-[#2366a8] text-white shadow-sm'
                  : 'bg-white text-[#2366a8] hover:bg-blue-50'
              } transition-all duration-300 flex items-center`}
              title="Vista de tarjetas"
            >
              <FaThLarge className="mr-1" />
              <span className="text-xs font-medium">Tarjetas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor con animación */}
      <div className={animate ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}>
        {viewMode === 'cards' ? (          <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 animate-fadeIn">
            {users.map((user, index) => (
              <div 
                key={user.user_id} 
                className="transition-all duration-500 animate-cardReveal"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <UserCard
                  user={user}
                  onChangeRole={(userId, newRole) => {
                    console.log(`Changing role for user ${userId} to ${newRole}`);
                    onChangeRole(userId, newRole);
                  }}
                  onDelete={(userId) => {
                    console.log(`Deleting user ${userId}`);
                    onDeleteUser(userId);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto animate-fadeIn">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-[#2366a8] uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-[#2366a8] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-[#2366a8] uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="py-3 px-6 text-right text-xs font-medium text-[#2366a8] uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">                {users.map((user, index) => (
                  <tr 
                    key={user.user_id} 
                    className="hover:bg-blue-50/30 transition-colors duration-200"
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      animation: 'fadeIn 0.3s ease-in-out forwards'
                    }}
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`${
                          user.role === 'admin' 
                            ? 'bg-gradient-to-r from-purple-600 to-purple-800' 
                            : user.role === 'librarian'
                              ? 'bg-gradient-to-r from-blue-600 to-blue-800'
                              : 'bg-gradient-to-r from-gray-600 to-gray-800'
                        } text-white p-2 rounded-full mr-3`}>
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
                          onChange={(e) => onChangeRole(user.user_id, e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg p-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="user">Usuario</option>
                          <option value="librarian">Bibliotecario</option>
                          <option value="admin">Administrador</option>
                        </select>
                        <button
                          onClick={() => onDeleteUser(user.user_id)}
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
        )}
      </div>
    </div>
  );
};

export default UserView;
