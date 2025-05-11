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
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthorDashboard() {
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
  const getRandomBookCount = () => Math.floor(Math.random() * 15) + 1

  useEffect(() => {
    fetchAuthors()
  }, [])

  useEffect(() => {
    if (authors.length > 0) {
      filterAndSortAuthors()
    }
  }, [authors, searchTerm, sortConfig])

  const fetchAuthors = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("http://localhost:3000/api/authors")
      if (!res.ok) throw new Error("Error al cargar los autores")
      const data = await res.json()

      // Añadir conteo de libros simulado para cada autor
      const authorsWithBooks = data.map((author) => ({
        ...author,
        book_count: getRandomBookCount(),
      }))

      setAuthors(authorsWithBooks)
    } catch (err) {
      console.error("Error fetching authors:", err)
      setError(err.message || "Ha ocurrido un error al cargar los autores")
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

    if (!validateForm()) return

    setIsLoading(true)
    try {
      if (editAuthor) {
        await fetch(`http://localhost:3000/api/authors/${editAuthor.author_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        showNotification("success", "Autor actualizado correctamente")
      } else {
        await fetch("http://localhost:3000/api/authors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    })
    setFormErrors({})
  }

  const handleEdit = (author) => {
    setEditAuthor(author)
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
    setAuthorToDelete(author)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!authorToDelete) return

    setIsLoading(true)
    try {
      await fetch(`http://localhost:3000/api/authors/${authorToDelete.author_id}`, { method: "DELETE" })
      showNotification("success", "Autor eliminado correctamente")
      fetchAuthors()
    } catch (err) {
      console.error("Error deleting author:", err)
      showNotification("error", `Error: ${err.message || "No se pudo eliminar el autor"}`)
    } finally {
      setIsLoading(false)
      setShowDeleteModal(false)
      setAuthorToDelete(null)
    }
  }

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
          <button
            className="flex items-center bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white px-5 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2"
            onClick={() => {
              setShowForm(true)
              setEditAuthor(null)
              resetForm()
            }}
          >
            <FaPlus className="mr-2" /> Nuevo Autor
          </button>
        </div>

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

        {/* Formulario */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[#e3f0fb]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#2366a8] flex items-center">
                    {editAuthor ? (
                      <>
                        <FaEdit className="mr-2" /> Editar Autor
                      </>
                    ) : (
                      <>
                        <FaPlus className="mr-2" /> Nuevo Autor
                      </>
                    )}
                  </h2>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setShowForm(false)
                      setEditAuthor(null)
                    }}
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="first_name">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleInput}
                      className={`w-full border ${
                        formErrors.first_name ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                      placeholder="Ej: Gabriel"
                    />
                    {formErrors.first_name && <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="last_name">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleInput}
                      className={`w-full border ${
                        formErrors.last_name ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                      placeholder="Ej: García Márquez"
                    />
                    {formErrors.last_name && <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="birth_date">
                      Fecha de nacimiento
                    </label>
                    <input
                      id="birth_date"
                      name="birth_date"
                      type="date"
                      value={form.birth_date}
                      onChange={handleInput}
                      className={`w-full border ${
                        formErrors.birth_date ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                    />
                    {formErrors.birth_date && <p className="text-red-500 text-sm mt-1">{formErrors.birth_date}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="nationality">
                      Nacionalidad
                    </label>
                    <input
                      id="nationality"
                      name="nationality"
                      value={form.nationality}
                      onChange={handleInput}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all"
                      placeholder="Ej: Colombiano"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="biography">
                      Biografía
                    </label>
                    <textarea
                      id="biography"
                      name="biography"
                      value={form.biography}
                      onChange={handleInput}
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all"
                      placeholder="Breve biografía del autor..."
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      onClick={() => {
                        setShowForm(false)
                        setEditAuthor(null)
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white transition-colors"
                    >
                      {editAuthor ? "Actualizar Autor" : "Añadir Autor"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estado de carga */}
        {isLoading && !showForm && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2366a8] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando autores...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error al cargar los autores</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              className="px-4 py-2 bg-[#2366a8] text-white rounded-lg hover:bg-[#79b2e9] transition-colors"
              onClick={fetchAuthors}
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Lista de autores */}
        {!isLoading && !error && (
          <>
            {filteredAuthors.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-[#2366a8] text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron autores</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? `No hay resultados para "${searchTerm}". Intenta con otra búsqueda.`
                    : "Aún no hay autores registrados. ¡Añade tu primer autor!"}
                </p>
                {searchTerm && (
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => setSearchTerm("")}
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuthors.map((author) => (
                  <motion.div
                    key={author.author_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-[#e3f0fb]"
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 ${getAvatarColor(
                            author.first_name + author.last_name,
                          )}`}
                        >
                          {getInitials(author.first_name, author.last_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                            {author.first_name} {author.last_name}
                          </h3>
                          <div className="flex flex-wrap gap-y-1">
                            {author.nationality && (
                              <div className="flex items-center text-sm text-gray-600 mr-4">
                                <FaGlobe className="text-[#79b2e9] mr-1" />
                                <span>{author.nationality}</span>
                              </div>
                            )}
                            {author.birth_date && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FaBirthdayCake className="text-[#79b2e9] mr-1" />
                                <span>{new Date(author.birth_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {author.biography && (
                        <p className="text-gray-600 text-sm mt-4 line-clamp-3">{author.biography}</p>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center text-sm font-medium text-[#2366a8]">
                          <FaBook className="mr-1" />
                          <span>
                            {author.book_count} {author.book_count === 1 ? "libro" : "libros"}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="p-2 bg-[#e3f0fb] text-[#2366a8] rounded-lg hover:bg-[#79b2e9] hover:text-white transition-colors"
                            onClick={() => handleEdit(author)}
                            aria-label={`Editar ${author.first_name} ${author.last_name}`}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            onClick={() => confirmDelete(author)}
                            aria-label={`Eliminar ${author.first_name} ${author.last_name}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
