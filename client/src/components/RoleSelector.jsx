// Componente de selección de rol para formularios de usuario
import { FaUser, FaBook, FaUserCog } from 'react-icons/fa';

/**
 * Componente de selección de rol para formularios
 * @param {Object} props
 * @param {string} props.selectedRole - Rol seleccionado actualmente ('user', 'librarian', 'admin')
 * @param {Function} props.onChange - Función a ejecutar cuando se selecciona un rol
 * @param {boolean} [props.disabled=false] - Si el selector está deshabilitado
 */
const RoleSelector = ({ selectedRole, onChange, disabled = false }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-[#2366a8] font-medium text-sm">
        Rol de usuario
      </label>
      <div className="grid grid-cols-3 gap-3">
        <div
          className={`border rounded-lg p-3 flex flex-col items-center ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} transition-all ${
            selectedRole === 'user'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
          }`}
          onClick={() => !disabled && onChange('user')}
        >
          <FaUser className="text-xl mb-1" />
          <span className="font-medium">Usuario</span>
          <span className="text-xs text-gray-500 mt-1 text-center">Acceso básico</span>
        </div>

        <div
          className={`border rounded-lg p-3 flex flex-col items-center ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} transition-all ${
            selectedRole === 'librarian'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
          }`}
          onClick={() => !disabled && onChange('librarian')}
        >
          <FaBook className="text-xl mb-1" />
          <span className="font-medium">Bibliotecario</span>
          <span className="text-xs text-gray-500 mt-1 text-center">Gestión de préstamos</span>
        </div>

        <div
          className={`border rounded-lg p-3 flex flex-col items-center ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} transition-all ${
            selectedRole === 'admin'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
          }`}
          onClick={() => !disabled && onChange('admin')}
        >
          <FaUserCog className="text-xl mb-1" />
          <span className="font-medium">Administrador</span>
          <span className="text-xs text-gray-500 mt-1 text-center">Acceso completo</span>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
