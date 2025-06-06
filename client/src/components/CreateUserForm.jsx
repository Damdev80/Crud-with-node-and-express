// Componente para crear usuarios con selección de rol (solo para administradores)
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaUsersCog, FaEnvelope, FaLock, FaUserPlus, FaArrowLeft, FaShieldAlt, FaCheck, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import RoleSelector from './RoleSelector';

const CreateUserForm = ({ onSuccess }) => {
  const { register, isAdmin } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validar fortaleza de contraseña
  useEffect(() => {
    const password = form.password;
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    // Calcular fortaleza (0-100)
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    
    setPasswordStrength(strength);
  }, [form.password]);

  // Obtener el color de la barra de fortaleza
  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength <= 20) return "bg-red-500";
    if (passwordStrength <= 40) return "bg-orange-500";
    if (passwordStrength <= 60) return "bg-yellow-500";
    if (passwordStrength <= 80) return "bg-green-400";
    return "bg-green-600";
  };

  // Obtener el texto de fortaleza
  const getStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 20) return "Muy débil";
    if (passwordStrength <= 40) return "Débil";
    if (passwordStrength <= 60) return "Moderada";
    if (passwordStrength <= 80) return "Fuerte";
    return "Muy fuerte";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar fortaleza de contraseña
    if (passwordStrength < 60) {
      setError('La contraseña es demasiado débil. Debe incluir letras mayúsculas, minúsculas, números y caracteres especiales.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      setSuccess(`Usuario ${form.name} creado exitosamente con rol de ${getRoleName(form.role)}`);
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      
      // Notificar al componente padre del éxito
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el nombre legible del rol
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

  // Si el usuario actual no es admin, mostrar mensaje de acceso denegado
  if (!isAdmin()) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <FaUsersCog className="text-xl mr-3" />
          <h3 className="font-bold text-lg">Acceso Denegado</h3>
        </div>
        <p className="mt-2">No tienes permisos para acceder a esta funcionalidad.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto border border-blue-100">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-full">
          <FaUserPlus className="text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-[#2366a8] ml-3">Crear Nuevo Usuario</h2>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded shadow-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-5 bg-green-50 border-l-4 border-green-400 text-green-700 p-4 rounded shadow-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-[#2366a8] font-medium text-sm">
            Nombre completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaUser />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Nombre del usuario"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-[#2366a8] font-medium text-sm">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaEnvelope />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-[#2366a8] font-medium text-sm">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Contraseña segura"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {/* Indicador de fortaleza de contraseña */}
          {form.password && (
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs font-medium text-gray-600">
                  {getStrengthText()}
                </span>
                <span className="text-xs text-gray-500">
                  {passwordStrength}% segura
                </span>
              </div>
            </div>
          )}

          {/* Requisitos de contraseña */}
          {form.password && (
            <div className="mt-2 bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-[#2366a8] font-medium mb-2">La contraseña debe contener:</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center">
                  {form.password.length >= 8 ? (
                    <FaCheck className="text-green-500 mr-1" />
                  ) : (
                    <FaTimes className="text-red-500 mr-1" />
                  )}
                  <span className={form.password.length >= 8 ? "text-green-700" : "text-red-700"}>
                    Mínimo 8 caracteres
                  </span>
                </div>
                <div className="flex items-center">
                  {/[A-Z]/.test(form.password) ? (
                    <FaCheck className="text-green-500 mr-1" />
                  ) : (
                    <FaTimes className="text-red-500 mr-1" />
                  )}
                  <span className={/[A-Z]/.test(form.password) ? "text-green-700" : "text-red-700"}>
                    Mayúsculas
                  </span>
                </div>
                <div className="flex items-center">
                  {/[a-z]/.test(form.password) ? (
                    <FaCheck className="text-green-500 mr-1" />
                  ) : (
                    <FaTimes className="text-red-500 mr-1" />
                  )}
                  <span className={/[a-z]/.test(form.password) ? "text-green-700" : "text-red-700"}>
                    Minúsculas
                  </span>
                </div>
                <div className="flex items-center">
                  {/[0-9]/.test(form.password) ? (
                    <FaCheck className="text-green-500 mr-1" />
                  ) : (
                    <FaTimes className="text-red-500 mr-1" />
                  )}
                  <span className={/[0-9]/.test(form.password) ? "text-green-700" : "text-red-700"}>
                    Números
                  </span>
                </div>
                <div className="flex items-center">
                  {/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? (
                    <FaCheck className="text-green-500 mr-1" />
                  ) : (
                    <FaTimes className="text-red-500 mr-1" />
                  )}
                  <span className={/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? "text-green-700" : "text-red-700"}>
                    Caracteres especiales
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          <RoleSelector 
            selectedRole={form.role} 
            onChange={handleRoleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creando usuario...
            </>
          ) : (
            <>
              <FaUserPlus className="mr-2" />
              Crear Usuario
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
