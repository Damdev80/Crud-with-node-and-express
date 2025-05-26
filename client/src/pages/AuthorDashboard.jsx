// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';
import { getAuthHeaders } from '../utils/authHeaders.js';
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
import { motion, AnimatePresence } from "framer-motion" // eslint-disable-line no-unused-vars

export default function AuthorDashboard() {
  const { isLibrarianOrAdmin } = useAuth()
  const navigate = useNavigate()
  const [authors, setAuthors] = useState([])
  const [_filteredAuthors, setFilteredAuthors] = useState([])
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
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [authorsPerPage] = useState(8) // 8 autores por página para mantener consistencia con el grid
  
  // Calcular paginación
  const totalPages = Math.ceil(_filteredAuthors.length / authorsPerPage)
  const paginatedAuthors = _filteredAuthors.slice(
    (currentPage - 1) * authorsPerPage,
    currentPage * authorsPerPage
  )

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
      console.log('✅ [AuthorDashboard] Data received:', data)

      // Manejar tanto respuestas con estructura {success, data} como arrays directos
      let authorsArray;
      if (data.success && Array.isArray(data.data)) {
        authorsArray = data.data;
      } else if (Array.isArray(data)) {
        authorsArray = data;
      } else {
        console.warn("Respuesta inesperada de la API de autores:", data)
        authorsArray = [];
      }

      console.log('📚 [AuthorDashboard] Authors array:', authorsArray.length, 'authors')

      // Añadir conteo de libros simulado para cada autor
      const authorsWithBooks = authorsArray.map((author) => ({
        ...author,
        book_count: getRandomBookCount(),
      }))

      setAuthors(authorsWithBooks)
    } catch (err) {
      console.error("❌ [AuthorDashboard] Error fetching authors:", err)
      setError(`Error de conexión: ${err.message}`)
      setAuthors([]) // ← IMPORTANTE: asegurar que authors sea un array
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
    // Resetear a la primera página cuando cambian los filtros
    setCurrentPage(1)
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
              Nacionalidad            </button>
          </div>
        </div>

        {/* Lista de autores */}
        {isLoading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-4xl text-[#2366a8] mx-auto mb-4" />
            <p className="text-gray-600">Cargando autores...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchAuthors}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : _filteredAuthors.length === 0 ? (
          <div className="text-center py-12">
            <FaBook className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron autores</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "No hay autores que coincidan con tu búsqueda" : "Comienza añadiendo tu primer autor"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-[#2366a8] hover:bg-[#1d5a9a] text-white rounded-lg transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedAuthors.map((author) => (
              <motion.div
                key={author.author_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2366a8] to-[#79b2e9] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">
                      {`${author.first_name?.charAt(0) || ""}${author.last_name?.charAt(0) || ""}`.toUpperCase()}
                    </span>
                  </div>

                  {/* Nombre */}
                  <h3 className="text-xl font-bold text-[#2366a8] text-center mb-2">
                    {author.first_name} {author.last_name}
                  </h3>

                  {/* Información adicional */}
                  <div className="space-y-2 mb-4">
                    {author.nationality && (
                      <div className="flex items-center text-gray-600">
                        <FaGlobe className="mr-2 text-[#79b2e9]" />
                        <span className="text-sm">{author.nationality}</span>
                      </div>
                    )}
                    {author.birth_date && (
                      <div className="flex items-center text-gray-600">
                        <FaBirthdayCake className="mr-2 text-[#79b2e9]" />
                        <span className="text-sm">{new Date(author.birth_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <FaBook className="mr-2 text-[#79b2e9]" />
                      <span className="text-sm">{author.book_count || 0} libro{author.book_count === 1 ? "" : "s"}</span>
                    </div>
                  </div>

                  {/* Biografía */}
                  {author.biography && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{author.biography}</p>
                  )}

                  {/* Botones de acción */}
                  {isLibrarianOrAdmin() && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
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
                        }}
                        className="p-2 rounded-full bg-[#2366a8] hover:bg-[#1d5a9a] text-white transition-colors shadow"
                        title="Editar autor"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setAuthorToDelete(author);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow"
                        title="Eliminar autor"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Información de paginación */}
              <div className="text-sm text-gray-600">
                Mostrando {((currentPage - 1) * authorsPerPage) + 1} a {Math.min(currentPage * authorsPerPage, _filteredAuthors.length)} de {_filteredAuthors.length} autores
              </div>
              
              {/* Controles de paginación */}
              <div className="flex items-center gap-2">
                {/* Botón Primera página */}
                <button
                  className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  title="Primera página"
                >
                  ««
                </button>
                
                {/* Botón Anterior */}
                <button
                  className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Página anterior"
                >
                  «
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                    let end = Math.min(totalPages, start + maxVisible - 1);
                    
                    if (end - start < maxVisible - 1) {
                      start = Math.max(1, end - maxVisible + 1);
                    }

                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`px-3 py-2 rounded border ${
                            i === currentPage
                              ? 'bg-[#2366a8] border-[#2366a8] text-white'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                          onClick={() => setCurrentPage(i)}
                        >
                          {i}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                {/* Botón Siguiente */}
                <button
                  className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  title="Página siguiente"
                >
                  »
                </button>
                
                {/* Botón Última página */}
                <button
                  className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  title="Última página"
                >
                  »»
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  )
}
