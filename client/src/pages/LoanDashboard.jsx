"use client"

import { useState, useEffect, useRef } from "react"
import { API_ENDPOINTS } from '../config/api.js'
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
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export default function LoanDashboard() {
  const { isLibrarianOrAdmin } = useAuth();
  
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
  
  // Redireccionar si no es bibliotecario o admin
  if (!isLibrarianOrAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

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
    // Cargar primero libros y usuarios, luego préstamos
    const loadAll = async () => {
      const booksData = await fetchBooks()
      const usersData = await fetchUsers()
      await fetchLoans(booksData, usersData)
    }
    loadAll()
  }, [])

  // Filtrar y ordenar préstamos cuando cambian los filtros
  useEffect(() => {
    if (loans.length > 0) {
      filterAndSortLoans()
    }
  }, [loans, searchTerm, filterStatus, sortConfig])

  // Función para obtener libros
  const fetchBooks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_NODE_ENV === 'production' ? 'https://crud-with-node-and-express.onrender.com' : 'http://localhost:8000'}/api/books`)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      setBooks(data.data || [])
      return data.data || []
    } catch (err) {
      console.error("Error fetching books:", err)
      setBooks([])
      return []
    }
  }  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      // Obtener el usuario actual del localStorage
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      
      if (!currentUser || !currentUser.user_id) {
        console.error("Usuario no autenticado");
        setNotification({
          show: true,
          type: "error",
          message: "Debe iniciar sesión para ver la lista de usuarios"
        });
        return [];
      }
        const res = await fetch(API_ENDPOINTS.users, {
        headers: {
          'Content-Type': 'application/json',
          // Incluir las credenciales de autenticación
          'x-user-id': currentUser.user_id,
          'x-user-role': currentUser.role
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
      }
      
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
        console.log("Usuarios cargados:", data.data.length);
        return data.data;
      } else {
        console.warn("Formato de respuesta inesperado:", data);
        setUsers([]);
        return [];
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setNotification({
        show: true,
        type: "error",
        message: `Error al cargar usuarios: ${err.message}`
      });
      setUsers([]);
      return [];
    }
  }
  // Función para obtener préstamos (ahora recibe books/users)
  const fetchLoans = async (booksArg = books, usersArg = users) => {
    setIsLoading(true)
    setError(null)
    
    // Verificación de depuración
    console.log("Libros disponibles:", booksArg.length)
    console.log("Usuarios disponibles:", usersArg.length)
    
    try {
      // Obtener el usuario actual del localStorage para autenticación
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        const res = await fetch(API_ENDPOINTS.loans, {
        headers: {
          'x-user-id': currentUser.user_id,
          'x-user-role': currentUser.role
        }
      })
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      const loansArray = Array.isArray(data) ? data : data.data
      if (!Array.isArray(loansArray)) throw new Error("Respuesta inesperada de la API de préstamos")
      // Enriquecer los datos con los arrays recibidos
      const enrichedLoans = loansArray.map((loan) => {
        const today = new Date()
        const returnDate = loan.return_date ? new Date(loan.return_date) : null
        let status = "active"
        if (loan.actual_return_date) status = "returned"
        else if (returnDate && returnDate < today) status = "overdue"
        const book = booksArg.find((b) => b.book_id === loan.book_id)
        const user = usersArg.find((u) => u.user_id === loan.user_id)
        return {
          ...loan,
          status,
          book_title: book ? book.title : `Libro #${loan.book_id}`,
          user_name: user ? user.name : `Usuario #${loan.user_id}`,
        }
      })
      setLoans(enrichedLoans)
      filterAndSortLoans([...enrichedLoans])
    } catch (err) {
      console.error("Error fetching loans:", err)
      setError(err.message || "Error al cargar los préstamos")
    } finally {
      setIsLoading(false)
    }
  }

  // Enriquecer los datos de préstamos con información de libros y usuarios
  const enrichLoansData = (loans) => {
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

      // Buscar título del libro y nombre del usuario usando los arrays actuales
      const book = books.find((b) => b.book_id === loan.book_id)
      const user = users.find((u) => u.user_id === loan.user_id)

      return {
        ...loan,
        status,
        book_title: book ? book.title : `Libro #${loan.book_id}`,
        user_name: user ? user.name : `Usuario #${loan.user_id}`,
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
      // Obtener el usuario actual del localStorage
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      
      if (!currentUser || !currentUser.user_id) {
        throw new Error('Debe iniciar sesión para gestionar préstamos');
      }
      
      if (editLoan) {
        const res = await fetch(`${API_ENDPOINTS.loans}/${editLoan.loan_id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            // Incluir las credenciales de autenticación
            'x-user-id': currentUser.user_id,
            'x-user-role': currentUser.role
          },
          body: JSON.stringify(form),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
        }
        showNotification("success", "Préstamo actualizado correctamente")
      } else {
        const res = await fetch(API_ENDPOINTS.loans, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            // Incluir las credenciales de autenticación
            'x-user-id': currentUser.user_id,
            'x-user-role': currentUser.role
          },
          body: JSON.stringify(form),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
        }
        showNotification("success", "Préstamo registrado correctamente")
      }

      setShowForm(false)
      setEditLoan(null)
      resetForm()
      const booksData = await fetchBooks()
      const usersData = await fetchUsers()
      await fetchLoans(booksData, usersData)
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
      // Obtener el usuario actual del localStorage
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      
      if (!currentUser || !currentUser.user_id) {
        throw new Error('Debe iniciar sesión para eliminar un préstamo');
      }
      
      const res = await fetch(`${API_ENDPOINTS.loans}/${confirmDelete.loan_id}`, { 
        method: "DELETE",
        headers: {
          // Incluir las credenciales de autenticación
          'x-user-id': currentUser.user_id,
          'x-user-role': currentUser.role
        }
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
      }

      showNotification("success", "Préstamo eliminado correctamente")
      const booksData = await fetchBooks()
      const usersData = await fetchUsers()
      await fetchLoans(booksData, usersData) // Espera a que termine antes de continuar
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
      // Obtener el usuario actual del localStorage
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      
      if (!currentUser || !currentUser.user_id) {
        throw new Error('Debe iniciar sesión para devolver un libro');
      }
      
      const res = await fetch(`${API_ENDPOINTS.loans}/${loan.loan_id}/return`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          // Incluir las credenciales de autenticación
          'x-user-id': currentUser.user_id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({ actual_return_date: new Date().toISOString().split("T")[0] }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);
      }
      showNotification("success", "Libro marcado como devuelto correctamente")
      const booksData = await fetchBooks()
      const usersData = await fetchUsers()
      await fetchLoans(booksData, usersData) // Espera a que termine antes de continuar
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
    return user ? user.name : `Usuario #${userId}`
  }

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "-"

    const date = new Date(dateString)
    const options = { year: "numeric", month: "2-digit", day: "2-digit" }
    const formattedDate = date.toLocaleDateString("es-ES", options)

    return formattedDate.replace(/\//g, "-")
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
        {/* Botón de regreso al dashboard */}
        <div className="mb-6">
          <button
            className="flex items-center bg-gradient-to-r from-[#79b2e9] to-[#2366a8] hover:from-[#5a9de0] hover:to-[#1d5a9a] text-white px-4 py-2 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2"
            type="button"
            onClick={() => window.location.replace('/dashboard')}
          >
            <span className="mr-2">←</span> Volver al Dashboard
          </button>
        </div>

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
                </label>                <select
                  id="user_id"
                  name="user_id"
                  value={form.user_id}
                  onChange={handleInput}
                  className={`w-full border ${formErrors.user_id ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                  required
                  disabled={users.length === 0}
                >
                  <option value="">{users.length === 0 ? "No hay usuarios disponibles" : "Selecciona un usuario"}</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {formErrors.user_id && <p className="text-red-500 text-sm mt-1">{formErrors.user_id}</p>}
                {users.length === 0 && (
                  <p className="text-amber-500 text-sm mt-1">
                    <FaInfoCircle className="inline mr-1" />
                    No se pudieron cargar los usuarios. Verifica que tienes permisos de administrador o bibliotecario.
                  </p>
                )}
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
                  filterStatus === "all"
                    ? "bg-[#2366a8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterStatus("all")}
              >
                Todos
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filterStatus === "active"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterStatus("active")}
              >
                Activos
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filterStatus === "overdue"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterStatus("overdue")}
              >
                Vencidos
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filterStatus === "returned"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterStatus("returned")}
              >
                Devueltos
              </button>
            </div>
          </div>
        )}

        {/* Aquí iría la tabla/lista de préstamos y paginación, etc. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredLoans.length === 0 ? (
            <div className="col-span-full text-gray-500 text-center">No hay préstamos registrados.</div>
          ) : (
            filteredLoans.map((loan) => (
              <div
                key={loan.loan_id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border border-[#e3f0fb] relative animate-fade-in min-w-0
                w-full "
                
              >
                <div className="flex items-center mb-3 min-w-0">
                  <div className="rounded-full bg-[#e3f0fb] p-3 mr-3">
                    <FaBook className="text-[#2366a8] text-xl" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-[#2366a8] leading-tight mb-1 truncate">{loan.book_title}</h3>
                    <p className="text-gray-500 text-sm flex items-center truncate">
                      <FaUser className="mr-1 text-[#79b2e9]" /> {loan.user_name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-3 w-auto">
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaCalendarAlt className="mr-2 text-[#79b2e9]" />
                    <span>Préstamo: <span className="font-medium">{formatDate(loan.loan_date)}</span></span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaCalendarCheck className="mr-2 text-[#79b2e9]" />
                    <span>Devolución: <span className="font-medium">{formatDate(loan.return_date)}</span></span>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(loan.status)} flex items-center`}>
                    {getStatusIcon(loan.status)} {getStatusText(loan.status)}
                  </span>
                </div>
                <div className="flex gap-2 mt-auto w-full">
                  {loan.status !== "returned" && (
                    <button
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center transition-colors min-w-0"
                      onClick={() => handleMarkAsReturned(loan)}
                      title="Marcar como devuelto"
                      style={{ wordBreak: 'break-word' }}
                    >
                      <FaCheck className="mr-1" /> Devolver
                    </button>
                  )}
                  <button
                    className="p-2  bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center justify-center transition-colors min-w-0"
                    onClick={() => handleEdit(loan)}
                    title="Editar"
                    style={{ wordBreak: 'break-word' }}
                  >
                    <FaEdit className="mr-1" /> 
                  </button>
                  <button
                    className="p-2   bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors min-w-0"
                    onClick={() => handleDeleteConfirm(loan)}
                    title="Eliminar"
                    style={{ wordBreak: 'break-word' }}
                  >
                    <FaTrash className="mr-1" /> 
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
