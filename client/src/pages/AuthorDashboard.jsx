"use client"

import { useState, useEffect } from "react"
import {
  FaUserEdit,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaSort,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaExclamationTriangle,
  FaBook,
  FaGlobe,
  FaBirthdayCake,
  FaTimes,
  FaCheck,
  FaSpinner,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config/api.js'
import { getAuthHeaders } from '../utils/authHeaders.js';

export default function AuthorDashboard() {
  const { isLibrarianOrAdmin } = useAuth();
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([])
  const [filteredAuthors, setFilteredAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editAuthor, setEditAuthor] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "last_name", direction: "asc" })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [authorToDelete, setAuthorToDelete] = useState(null)
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })
  const [formErrors, setFormErrors] = useState({})

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    nationality: "",
    biography: "",
  })
  // Simular conteo de libros para cada autor
  const getRandomBookCount = () => Math.floor(Math.random() * 15) + 1;
  
  useEffect(() => {
    fetchAuthors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (authors.length > 0) {
      filterAndSortAuthors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authors, searchTerm, sortConfig]);
  
  const fetchAuthors = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('🔍 [AuthorDashboard] Fetching authors from:', `${API_BASE_URL}/api/authors`)
      const res = await fetch(`${API_BASE_URL}/api/authors`)
      console.log('📡 [AuthorDashboard] Response status:', res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ [AuthorDashboard] Error response:', errorText)
        throw new Error(`Error ${res.status}: ${errorText || 'Error al cargar los autores'}`)
      }
      
      const data = await res.json()
      console.log('✅ [AuthorDashboard] Authors received:', data.length, 'authors')

      // Añadir conteo de libros simulado para cada autor
      const authorsWithBooks = data.map((author) => ({
        ...author,
        book_count: getRandomBookCount(),
      }))

      setAuthors(authorsWithBooks)
    } catch (err) {
      console.error("❌ [AuthorDashboard] Error fetching authors:", err)
      setError(`Error de conexión: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortAuthors = () => {
    let filtered = [...authors]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (author) =>
          `${author.first_name} ${author.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (author.nationality && author.nationality.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Ordenar
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] || ""
      const bValue = b[sortConfig.key] || ""

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })

    setFilteredAuthors(filtered)
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const validateForm = () => {
    const errors = {}
    if (!form.first_name.trim()) errors.first_name = "El nombre es requerido"
    if (!form.last_name.trim()) errors.last_name = "El apellido es requerido"

    if (form.birth_date) {
      const birthDate = new Date(form.birth_date)
      const today = new Date()
      if (birthDate > today) {
        errors.birth_date = "La fecha no puede ser futura"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Limpiar error específico cuando el usuario corrige
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return    setIsLoading(true)
    try {
      if (editAuthor) {
        await fetch(`${API_BASE_URL}/api/authors/${editAuthor.author_id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
        })
        showNotification("success", "Autor actualizado correctamente")
      } else {
        await fetch(`${API_BASE_URL}/api/authors`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
        })
        showNotification("success", "Autor añadido correctamente")
      }
      setShowForm(false)
      setEditAuthor(null)
      resetForm()
      fetchAuthors()
    } catch (err) {
      console.error("Error saving author:", err)
      showNotification("error", `Error: ${err.message || "No se pudo guardar el autor"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      birth_date: "",
      nationality: "",
      biography: "",
    });
    setFormErrors({});
  };

  const handleEdit = (author) => {
    setEditAuthor(author);
    setForm({
      first_name: author.first_name || "",
      last_name: author.last_name || "",
      birth_date: author.birth_date || "",
      nationality: author.nationality || "",
      biography: author.biography || "",
    })
    setShowForm(true)
    setFormErrors({})
  }

  const confirmDelete = (author) => {
    setAuthorToDelete(author);
    setShowDeleteModal(true);
  };
  
  const handleDelete = async () => {
    if (!authorToDelete) return;

    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/authors/${authorToDelete.author_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      showNotification("success", "Autor eliminado correctamente");
      fetchAuthors();
    } catch (err) {
      console.error("Error deleting author:", err);
      showNotification("error", `Error: ${err.message || "No se pudo eliminar el autor"}`);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setAuthorToDelete(null);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" })
    }, 3000)
  }

  // Generar iniciales para avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  // Generar color de fondo para avatar basado en nombre
  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ]
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f0fb] via-[#f7fafc] to-[#e3f0fb] p-4 md:p-8">
      {/* Notificación */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white flex items-center`}
          >
            {notification.type === "success" ? (
              <FaCheck className="mr-2" />
            ) : (
              <FaExclamationTriangle className="mr-2" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmar eliminación</h3>
              <p className="text-gray-600">
                ¿Estás seguro de que deseas eliminar a{" "}
                <span className="font-semibold">
                  {authorToDelete?.first_name} {authorToDelete?.last_name}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Botón de regreso al dashboard */}
        <div className="mb-6">
          <button
            className="flex items-center bg-gradient-to-r from-[#79b2e9] to-[#2366a8] hover:from-[#5a9de0] hover:to-[#1d5a9a] text-white px-4 py-2 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2"
            type="button"
            onClick={() => navigate('/dashboard')}
          >
            <span className="mr-2">←</span> Volver al Dashboard
          </button>
        </div>

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#2366a8] mb-2 flex items-center">
              <FaUserEdit className="mr-3" />
              Gestión de Autores
            </h1>
            <p className="text-gray-600">
              Administra los autores de tu biblioteca. Añade, edita o elimina según sea necesario.
            </p>
          </div>
          {isLibrarianOrAdmin() && (
            <button
              className="flex items-center bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white px-5 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2"
              type="button"
              onClick={() => {
                setShowForm(true)
                setEditAuthor(null)
                resetForm()
              }}
            >
              <FaPlus className="mr-2" /> Nuevo Autor
            </button>
          )}
        </div>

        {/* Formulario de autor (ahora arriba) */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-md p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-[#2366a8] mb-4">
                {editAuthor ? "Editar Autor" : "Añadir Nuevo Autor"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first_name">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      className={`block w-full px-4 py-3 rounded-lg border focus:outline-none transition-all ${
                        formErrors.first_name ? "border-red-500" : "border-gray-300"
                      }`}
                      value={form.first_name}
                      onChange={handleInput}
                      required
                    />
                    {formErrors.first_name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.first_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last_name">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      className={`block w-full px-4 py-3 rounded-lg border focus:outline-none transition-all ${
                        formErrors.last_name ? "border-red-500" : "border-gray-300"
                      }`}
                      value={form.last_name}
                      onChange={handleInput}
                      required
                    />
                    {formErrors.last_name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.last_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="birth_date">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      id="birth_date"
                      name="birth_date"
                      className={`block w-full px-4 py-3 rounded-lg border focus:outline-none transition-all ${
                        formErrors.birth_date ? "border-red-500" : "border-gray-300"
                      }`}
                      value={form.birth_date}
                      onChange={handleInput}
                    />
                    {formErrors.birth_date && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.birth_date}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nationality">
                      Nacionalidad
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      className="block w-full px-4 py-3 rounded-lg border focus:outline-none transition-all border-gray-300"
                      value={form.nationality}
                      onChange={handleInput}
                    />
                  </div>                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="biography">
                      Biografía
                    </label>
                    <textarea
                      id="biography"
                      name="biography"
                      rows="4"
                      className="block w-full px-4 py-3 rounded-lg border focus:outline-none transition-all border-gray-300"
                      value={form.biography}
                      onChange={handleInput}
                    ></textarea>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2366a8] hover:bg-[#1d5a9a] rounded-lg text-white transition-colors"
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                    ) : editAuthor ? (
                      "Actualizar Autor"
                    ) : (
                      "Añadir Autor"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o nacionalidad..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex gap-2 self-end">
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                sortConfig.key === "last_name"
                  ? "bg-[#2366a8] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleSort("last_name")}
            >
              {sortConfig.key === "last_name" && sortConfig.direction === "asc" ? (
                <FaSortAlphaDown className="mr-2" />
              ) : sortConfig.key === "last_name" && sortConfig.direction === "desc" ? (
                <FaSortAlphaUp className="mr-2" />
              ) : (
                <FaSort className="mr-2" />
              )}
              Nombre
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                sortConfig.key === "nationality"
                  ? "bg-[#2366a8] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleSort("nationality")}
            >
              {sortConfig.key === "nationality" && sortConfig.direction === "asc" ? (
                <FaSortAlphaDown className="mr-2" />
              ) : sortConfig.key === "nationality" && sortConfig.direction === "desc" ? (
                <FaSortAlphaUp className="mr-2" />
              ) : (
                <FaSort className="mr-2" />
              )}
              Nacionalidad
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                sortConfig.key === "book_count"
                  ? "bg-[#2366a8] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleSort("book_count")}
            >
              {sortConfig.key === "book_count" && sortConfig.direction === "asc" ? (
                <FaSortAlphaDown className="mr-2" />
              ) : sortConfig.key === "book_count" && sortConfig.direction === "desc" ? (
                <FaSortAlphaUp className="mr-2" />
              ) : (
                <FaSort className="mr-2" />
              )}
              Libros
            </button>
          </div>
        </div>

        {/* Grid de autores como cards visuales */}
        <div className="">
          {isLoading ? (
            <div className="py-4 text-center">
              <FaSpinner className="animate-spin text-[#2366a8] h-6 w-6 mx-auto" />
            </div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">
              <FaExclamationTriangle className="inline-block mr-2" />
              {error}
            </div>
          ) : filteredAuthors.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              <FaBook className="inline-block mb-2" />
              No se encontraron autores que coincidan con tu búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAuthors.map((author) => (
                <motion.div
                  key={author.author_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative bg-[#fff] rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[260px]"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 text-xl font-bold ${getAvatarColor(
                        (author.first_name || "") + (author.last_name || "")
                      )}`}
                    >
                      <span className="text-white">
                        {getInitials(author.first_name, author.last_name)}
                      </span>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-[#2366a8]">
                        {author.first_name} {author.last_name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaGlobe className="mr-1" />
                        {author.nationality || "-"}
                      </div>
                    </div>
                  </div>                  <div className="flex-1 mb-4">
                    <div className="text-gray-700 text-sm line-clamp-3 mb-2">
                      {author.biography ? author.biography : <span className="italic text-gray-400">Sin biografía</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-[#2366a8] font-medium">
                      <FaBook className="mr-1" />
                      {author.book_count || 0} libro{author.book_count === 1 ? "" : "s"}
                    </div>
                    {isLibrarianOrAdmin() && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(author)}
                          className="p-2 rounded-full bg-[#2366a8] hover:bg-[#1d5a9a] text-white transition-colors shadow"
                          title="Editar autor"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(author)}
                          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow"
                          title="Eliminar autor"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
