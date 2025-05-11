"use client"

import { useState, useEffect, useRef } from "react"
import {
  FaBook,
  FaUser,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSort,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaExchangeAlt,
  FaInfoCircle,
  FaArrowLeft,
  FaTimes,
  FaCheck,
} from "react-icons/fa"

export default function LoanDashboard() {
  // Estados principales
  const [loans, setLoans] = useState([])
  const [filteredLoans, setFilteredLoans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editLoan, setEditLoan] = useState(null)
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Estados para filtros y ordenación
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "loan_date", direction: "desc" })
  const [showFilters, setShowFilters] = useState(false)

  // Estado del formulario con validación
  const [form, setForm] = useState({
    book_id: "",
    user_id: "",
    loan_date: "",
    return_date: "",
  })
  const [formErrors, setFormErrors] = useState({})

  // Referencia para el formulario (para scroll)
  const formRef = useRef(null)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchLoans()
    fetchBooks()
    fetchUsers()
  }, [])

  // Filtrar y ordenar préstamos cuando cambian los filtros
  useEffect(() => {
    if (loans.length > 0) {
      filterAndSortLoans()
    }
  }, [loans, searchTerm, filterStatus, sortConfig])

  // Función para obtener préstamos
  const fetchLoans = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("http://localhost:3000/api/loans")
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()

      // Enriquecer los datos con información de libros y usuarios
      const enrichedLoans = await enrichLoansData(data)
      setLoans(enrichedLoans)
    } catch (err) {
      console.error("Error fetching loans:", err)
      setError(err.message || "Error al cargar los préstamos")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener libros
  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/books")
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      setBooks(data.data || [])
    } catch (err) {
      console.error("Error fetching books:", err)
      setBooks([])
    }
  }

  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users")
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      setUsers(data.data || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setUsers([])
    }
  }

  // Enriquecer los datos de préstamos con información de libros y usuarios
  const enrichLoansData = async (loans) => {
    // En un entorno real, esto podría hacerse en el backend
    // Aquí simulamos la obtención de datos adicionales
    return loans.map((loan) => {
      // Calcular estado del préstamo
      const today = new Date()
      const returnDate = loan.return_date ? new Date(loan.return_date) : null
      let status = "active"

      if (loan.returned_date) {
        status = "returned"
      } else if (returnDate && returnDate < today) {
        status = "overdue"
      }

      return {
        ...loan,
        status,
        // Estos datos se rellenarán cuando tengamos la información real
        book_title: "Cargando...",
        user_name: "Cargando...",
      }
    })
  }

  // Filtrar y ordenar préstamos
  const filterAndSortLoans = () => {
    let filtered = [...loans]

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (loan) =>
          loan.book_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.user_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Aplicar filtro de estado
    if (filterStatus !== "all") {
      filtered = filtered.filter((loan) => loan.status === filterStatus)
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

    setFilteredLoans(filtered)
  }

  // Manejar cambios en el formulario
  const handleInput = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Limpiar error específico cuando el usuario corrige
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  // Validar formulario
  const validateForm = () => {
    const errors = {}
    if (!form.book_id) errors.book_id = "Selecciona un libro"
    if (!form.user_id) errors.user_id = "Selecciona un usuario"
    if (!form.loan_date) errors.loan_date = "La fecha de préstamo es obligatoria"

    // Validar que la fecha de devolución sea posterior a la de préstamo
    if (form.loan_date && form.return_date) {
      const loanDate = new Date(form.loan_date)
      const returnDate = new Date(form.return_date)
      if (returnDate < loanDate) {
        errors.return_date = "La fecha de devolución debe ser posterior a la de préstamo"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      if (editLoan) {
        const res = await fetch(`http://localhost:3000/api/loans/${editLoan.loan_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        showNotification("success", "Préstamo actualizado correctamente")
      } else {
        const res = await fetch("http://localhost:3000/api/loans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        showNotification("success", "Préstamo registrado correctamente")
      }

      setShowForm(false)
      setEditLoan(null)
      resetForm()
      fetchLoans()
    } catch (err) {
      console.error("Error saving loan:", err)
      showNotification("error", `Error: ${err.message || "No se pudo guardar el préstamo"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Resetear formulario
  const resetForm = () => {
    setForm({
      book_id: "",
      user_id: "",
      loan_date: "",
      return_date: "",
    })
    setFormErrors({})
  }

  // Preparar edición de préstamo
  const handleEdit = (loan) => {
    setEditLoan(loan)
    setForm({
      book_id: loan.book_id,
      user_id: loan.user_id,
      loan_date: loan.loan_date || "",
      return_date: loan.return_date || "",
    })
    setShowForm(true)
    setFormErrors({})

    // Scroll al formulario
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  // Confirmar eliminación de préstamo
  const handleDeleteConfirm = (loan) => {
    setConfirmDelete(loan)
  }

  // Eliminar préstamo
  const handleDelete = async () => {
    if (!confirmDelete) return

    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/api/loans/${confirmDelete.loan_id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)

      showNotification("success", "Préstamo eliminado correctamente")
      fetchLoans()
    } catch (err) {
      console.error("Error deleting loan:", err)
      showNotification("error", `Error: ${err.message || "No se pudo eliminar el préstamo"}`)
    } finally {
      setIsLoading(false)
      setConfirmDelete(null)
    }
  }

  // Marcar préstamo como devuelto
  const handleMarkAsReturned = async (loan) => {
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/api/loans/${loan.loan_id}/return`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returned_date: new Date().toISOString().split("T")[0] }),
      })

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      showNotification("success", "Libro marcado como devuelto correctamente")
      fetchLoans()
    } catch (err) {
      console.error("Error marking loan as returned:", err)
      showNotification("error", `Error: ${err.message || "No se pudo marcar como devuelto"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar notificación
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" })
    }, 3000)
  }

  // Manejar ordenación
  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Obtener estadísticas de préstamos
  const getStats = () => {
    const total = loans.length
    const active = loans.filter((loan) => loan.status === "active").length
    const overdue = loans.filter((loan) => loan.status === "overdue").length
    const returned = loans.filter((loan) => loan.status === "returned").length

    return { total, active, overdue, returned }
  }

  // Obtener nombre del libro por ID
  const getBookTitle = (bookId) => {
    const book = books.find((b) => b.book_id === bookId)
    return book ? book.title : `Libro #${bookId}`
  }

  // Obtener nombre del usuario por ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.user_id === userId)
    return user ? `${user.first_name} ${user.last_name}` : `Usuario #${userId}`
  }

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Calcular días restantes o de retraso
  const getDaysRemaining = (loan) => {
    if (loan.status === "returned") return null

    const today = new Date()
    const returnDate = new Date(loan.return_date)
    const diffTime = returnDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  // Obtener color según estado del préstamo
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "returned":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Obtener texto según estado del préstamo
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Activo"
      case "overdue":
        return "Vencido"
      case "returned":
        return "Devuelto"
      default:
        return "Desconocido"
    }
  }

  // Obtener icono según estado del préstamo
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="mr-1" />
      case "overdue":
        return <FaExclamationTriangle className="mr-1" />
      case "returned":
        return <FaCalendarCheck className="mr-1" />
      default:
        return <FaInfoCircle className="mr-1" />
    }
  }

  // Estadísticas
  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f0fb] via-[#f7fafc] to-[#e3f0fb] p-4 md:p-8">
      {/* Notificación */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white flex items-center animate-fade-in`}
        >
          {notification.type === "success" ? <FaCheck className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
          {notification.message}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 animate-modal">
            <div className="text-center mb-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmar eliminación</h3>
              <p className="text-gray-600">
                ¿Estás seguro de que deseas eliminar el préstamo del libro{" "}
                <span className="font-semibold">{getBookTitle(confirmDelete.book_id)}</span>?
                <br />
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                onClick={() => setConfirmDelete(null)}
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
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#2366a8] mb-2 flex items-center">
              <FaExchangeAlt className="mr-3" />
              Gestión de Préstamos
            </h1>
            <p className="text-gray-600">
              Administra los préstamos de tu biblioteca. Registra nuevos préstamos y devoluciones.
            </p>
          </div>
          <button
            className="flex items-center bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white px-5 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2"
            onClick={() => {
              setShowForm(true)
              setEditLoan(null)
              resetForm()
              // Scroll al formulario
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth" })
              }, 100)
            }}
          >
            <FaPlus className="mr-2" /> Nuevo Préstamo
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaExchangeAlt className="text-blue-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total de Préstamos</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaCheckCircle className="text-green-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Préstamos Activos</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.active}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <FaExclamationTriangle className="text-red-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Préstamos Vencidos</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.overdue}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaCalendarCheck className="text-blue-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Libros Devueltos</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.returned}</h3>
            </div>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div
            ref={formRef}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[#e3f0fb] animate-slide-down"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2366a8] flex items-center">
                {editLoan ? (
                  <>
                    <FaEdit className="mr-2" /> Editar Préstamo
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Nuevo Préstamo
                  </>
                )}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowForm(false)
                  setEditLoan(null)
                }}
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="book_id">
                  Libro <span className="text-red-500">*</span>
                </label>
                <select
                  id="book_id"
                  name="book_id"
                  value={form.book_id}
                  onChange={handleInput}
                  className={`w-full border ${
                    formErrors.book_id ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                  required
                >
                  <option value="">Selecciona un libro</option>
                  {books.map((book) => (
                    <option key={book.book_id} value={book.book_id}>
                      {book.title}
                    </option>
                  ))}
                </select>
                {formErrors.book_id && <p className="text-red-500 text-sm mt-1">{formErrors.book_id}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="user_id">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <select
                  id="user_id"
                  name="user_id"
                  value={form.user_id}
                  onChange={handleInput}
                  className={`w-full border ${
                    formErrors.user_id ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                  required
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
                {formErrors.user_id && <p className="text-red-500 text-sm mt-1">{formErrors.user_id}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="loan_date">
                  Fecha de préstamo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    id="loan_date"
                    name="loan_date"
                    type="date"
                    value={form.loan_date}
                    onChange={handleInput}
                    className={`w-full border ${
                      formErrors.loan_date ? "border-red-500" : "border-gray-300"
                    } rounded-lg pl-10 pr-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                    required
                  />
                </div>
                {formErrors.loan_date && <p className="text-red-500 text-sm mt-1">{formErrors.loan_date}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="return_date">
                  Fecha de devolución prevista
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarCheck className="text-gray-400" />
                  </div>
                  <input
                    id="return_date"
                    name="return_date"
                    type="date"
                    value={form.return_date}
                    onChange={handleInput}
                    className={`w-full border ${
                      formErrors.return_date ? "border-red-500" : "border-gray-300"
                    } rounded-lg pl-10 pr-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                  />
                </div>
                {formErrors.return_date && <p className="text-red-500 text-sm mt-1">{formErrors.return_date}</p>}
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center"
                  onClick={() => {
                    setShowForm(false)
                    setEditLoan(null)
                  }}
                >
                  <FaArrowLeft className="mr-2" /> Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white transition-colors flex items-center"
                >
                  {editLoan ? (
                    <>
                      <FaEdit className="mr-2" /> Actualizar Préstamo
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" /> Registrar Préstamo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título de libro o nombre de usuario..."
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
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />
              Filtros
              {filterStatus !== "all" && (
                <span className="ml-2 bg-[#2366a8] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                sortConfig.key === "loan_date"
                  ? "bg-[#2366a8] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleSort("loan_date")}
            >
              {sortConfig.key === "loan_date" && sortConfig.direction === "asc" ? (
                <FaSortAlphaDown className="mr-2" />
              ) : sortConfig.key === "loan_date" && sortConfig.direction === "desc" ? (
                <FaSortAlphaUp className="mr-2" />
              ) : (
                <FaSort className="mr-2" />
              )}
              Fecha
            </button>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">Filtrar por estado</h3>
              <button className="text-sm text-[#2366a8] hover:text-[#79b2e9]" onClick={() => setFilterStatus("all")}>
                Limpiar filtros
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filterStatus === "all" ? "bg-[#2366a8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterStatus("all")}
              >
                Todos
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filterStatus === "active"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
                onClick={() => setFilterStatus("active")}
              >
                <FaCheckCircle className="mr-2" />
                Activos
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filterStatus === "overdue" ? "bg-red-600 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
                onClick={() => setFilterStatus("overdue")}
              >
                <FaExclamationTriangle className="mr-2" />
                Vencidos
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filterStatus === "returned" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
                onClick={() => setFilterStatus("returned")}
              >
                <FaCalendarCheck className="mr-2" />
                Devueltos
              </button>
            </div>
          </div>
        )}

        {/* Estado de carga */}
        {isLoading && !showForm && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2366a8] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando préstamos...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error al cargar los préstamos</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              className="px-4 py-2 bg-[#2366a8] text-white rounded-lg hover:bg-[#79b2e9] transition-colors"
              onClick={fetchLoans}
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Lista de préstamos */}
        {!isLoading && !error && (
          <>
            {filteredLoans.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-[#2366a8] text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron préstamos</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "No hay préstamos que coincidan con tus criterios de búsqueda."
                    : "Aún no hay préstamos registrados. ¡Registra tu primer préstamo!"}
                </p>
                {(searchTerm || filterStatus !== "all") && (
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setSearchTerm("")
                      setFilterStatus("all")
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLoans.map((loan) => {
                  const daysRemaining = getDaysRemaining(loan)
                  const bookTitle = getBookTitle(loan.book_id)
                  const userName = getUserName(loan.user_id)

                  return (
                    <div
                      key={loan.loan_id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-[#e3f0fb] animate-fade-in"
                    >
                      <div className="p-6">
                        {/* Cabecera con estado */}
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <FaBook className="mr-2 text-[#2366a8]" />
                            <span className="truncate">{bookTitle}</span>
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(
                              loan.status,
                            )}`}
                          >
                            {getStatusIcon(loan.status)}
                            {getStatusText(loan.status)}
                          </span>
                        </div>

                        {/* Información del préstamo */}
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600 flex items-center">
                            <FaUser className="mr-2 text-[#79b2e9]" />
                            {userName}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <FaCalendarAlt className="mr-2 text-[#79b2e9]" />
                            Préstamo: {formatDate(loan.loan_date)}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <FaCalendarCheck className="mr-2 text-[#79b2e9]" />
                            Devolución prevista: {formatDate(loan.return_date)}
                          </p>
                          {loan.returned_date && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaCheckCircle className="mr-2 text-green-500" />
                              Devuelto el: {formatDate(loan.returned_date)}
                            </p>
                          )}
                        </div>

                        {/* Días restantes o de retraso */}
                        {daysRemaining !== null && loan.status !== "returned" && (
                          <div
                            className={`text-sm font-medium mb-4 ${
                              daysRemaining < 0
                                ? "text-red-600"
                                : daysRemaining <= 2
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {daysRemaining < 0
                              ? `${Math.abs(daysRemaining)} días de retraso`
                              : daysRemaining === 0
                                ? "Vence hoy"
                                : `${daysRemaining} días restantes`}
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <button
                              className="p-2 bg-[#e3f0fb] text-[#2366a8] rounded-lg hover:bg-[#79b2e9] hover:text-white transition-colors"
                              onClick={() => handleEdit(loan)}
                              title="Editar préstamo"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                              onClick={() => handleDeleteConfirm(loan)}
                              title="Eliminar préstamo"
                            >
                              <FaTrash />
                            </button>
                          </div>

                          {loan.status !== "returned" && (
                            <button
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm flex items-center"
                              onClick={() => handleMarkAsReturned(loan)}
                            >
                              <FaCheckCircle className="mr-1" />
                              Marcar como devuelto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 2000px;
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .animate-modal {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
