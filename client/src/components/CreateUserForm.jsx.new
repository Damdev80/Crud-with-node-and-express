// Componente para crear usuarios con selección de rol (solo para administradores)
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaUsersCog } from 'react-icons/fa';
import RoleSelector from './RoleSelector';

const CreateUserForm = () => {
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
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <div className="flex items-center">
          <FaUsersCog className="text-xl mr-2" />
          <h3 className="font-bold">Acceso Denegado</h3>
        </div>
        <p className="mt-2">No tienes permisos para acceder a esta funcionalidad.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-100 text-blue-700 p-3 rounded-full">
          <FaUsersCog className="text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 ml-3">Crear Nuevo Usuario</h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre del usuario"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contraseña segura"
          />
        </div>

        <div className="mb-6">
          <RoleSelector 
            selectedRole={form.role} 
            onChange={handleRoleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
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
            "Crear Usuario"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
