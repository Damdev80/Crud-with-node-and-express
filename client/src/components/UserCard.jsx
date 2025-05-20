// Componente para mostrar un usuario en formato de tarjeta
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaTrash, FaUserCog, FaUserTie, FaUserCheck, FaStar, FaIdCard, FaCrown } from 'react-icons/fa';

const UserCard = ({ user, onChangeRole, onDelete }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isHovered, setIsHovered] = useState(false);

  // Actualizar el estado interno cuando cambia el rol externo
  useEffect(() => {
    setSelectedRole(user.role);
  }, [user.role]);
  // Función para obtener el estilo de la tarjeta según el rol
  const getCardStyle = (role) => {
    // Estilo minimalista para todas las tarjetas
    return 'border-gray-200 shadow-sm';
  };

  // Función para obtener el ícono según el rol
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaCrown className="text-purple-600" />;
      case 'librarian':
        return <FaUserTie className="text-blue-600" />;
      default:
        return <FaUserCheck className="text-gray-600" />;
    }
  };

  // Función para obtener el nombre del rol
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
  
  // Función para obtener el color de la etiqueta según el rol
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'librarian':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Manejador para el cambio de rol
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    if (typeof onChangeRole === 'function') {
      onChangeRole(user.user_id, newRole);
    } else {
      console.error('onChangeRole is not a function');
    }
  };
  
  // Manejador para eliminar usuario
  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(user.user_id);
    } else {
      console.error('onDelete is not a function');
    }
  };
    return (
    <div 
      className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 relative transform hover:shadow-md w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >      
      {/* Cabecera de la tarjeta (blanca) */}
      <div className="bg-white text-gray-800 p-4 relative border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="bg-gray-100 p-2 rounded-full relative overflow-hidden shadow-inner flex-shrink-0">
              <FaUser className="text-gray-600 text-lg relative z-10" />
              <div className="absolute inset-0 bg-gray-200/50 rounded-full animate-pulse"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold truncate text-base" title={user.name}>{user.name}</h3>
              <div className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1 mt-1 w-full">
                <FaEnvelope className="mr-2 flex-shrink-0 text-gray-500" />
                <span className="truncate" title={user.email}>{user.email}</span>
              </div>
            </div>
          </div>
          
          {/* Etiqueta de rol con color */}
          <div className={`p-2 rounded-lg border ${getRoleBadgeColor(user.role)} ml-2 flex-shrink-0 flex flex-col items-center`}>
            {getRoleIcon(user.role)}
            <span className="text-xs font-medium block text-center mt-1">{getRoleName(user.role)}</span>
          </div>
        </div>
      </div>
      
      {/* Cuerpo de la tarjeta */}
      <div className="p-4 relative">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
            <FaIdCard className="text-blue-600 text-xs" />
            <span className="text-xs text-blue-800 font-medium">ID: {user.user_id}</span>
          </div>
          {/* Badge para admin */}
          {user.role === 'admin' && (
            <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
              <FaStar className="mr-1 text-purple-600 text-xs" />
              Admin
            </div>
          )}
        </div>
        
        {/* Selector de rol */}
        <div className="mt-3">
          <label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
            <FaUserCog className="mr-1 text-blue-600 text-xs" />
            Rol de usuario
          </label>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
          >
            <option value="user">Usuario</option>
            <option value="librarian">Bibliotecario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
      
      {/* Botón de eliminar */}
      <div className="px-4 pb-4 pt-2">
        <button
          type="button"
          onClick={handleDelete}
          className="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          <FaTrash className="mr-2 text-xs" /> 
          Eliminar usuario
        </button>
      </div>
    </div>
  );
};

export default UserCard;
