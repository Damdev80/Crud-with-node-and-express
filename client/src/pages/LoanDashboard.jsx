import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api.js";
import {
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
  FaUndo,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getAuthHeaders } from "../utils/authHeaders.js";

export default function LoanDashboard() {
  // Auth & routing hooks
  const { isLibrarianOrAdmin } = useAuth();
  const navigate = useNavigate(); // State hooks
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editLoan, setEditLoan] = useState(null);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmReturn, setConfirmReturn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "loan_date",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState({
    book_id: "",
    user_id: "",
    loan_date: "",
    return_date: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [loansPerPage] = useState(10); // 10 préstamos por página

  // Calcular paginación
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * loansPerPage,
    currentPage * loansPerPage
  ); // Load data on mount
  useEffect(() => {
    const loadAll = async () => {
      console.log("🔄 [LOAD] Iniciando carga de datos...");
      console.log(
        "🔄 [LOAD] Usuario actual:",
        JSON.parse(localStorage.getItem("user") || "{}")
      );
      console.log("🔄 [LOAD] Autenticación disponible:", getAuthHeaders());

      const booksData = await fetchBooks();
      console.log("📚 [LOAD] Books obtenidos:", booksData.length);

      const usersData = await fetchUsers();
      console.log("👥 [LOAD] Users obtenidos:", usersData.length);

      await fetchLoans(booksData, usersData);
      console.log("✅ [LOAD] Carga de datos completada");
      console.log(
        "📊 [LOAD] Estado final - loans:",
        loans.length,
        "filteredLoans:",
        filteredLoans.length
      );
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Filter & sort when data or filters change
  useEffect(() => {
    console.log("🔍 [FILTER-EFFECT] Ejecutando effect...");
    console.log("🔍 [FILTER-EFFECT] Estado actual:", {
      loansLength: loans.length,
      filteredLoansLength: filteredLoans.length,
      searchTerm,
      filterStatus,
    });

    if (loans.length > 0) {
      console.log("🔍 [FILTER-EFFECT] Llamando a filterAndSortLoans...");
      filterAndSortLoans();
    } else {
      console.log(
        "🔍 [FILTER-EFFECT] No hay loans, limpiando filteredLoans..."
      );
      setFilteredLoans([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans, searchTerm, filterStatus, sortConfig]);
  // Redirect unauthorized users
  if (!isLibrarianOrAdmin()) {
    console.log("🚫 [AUTH] Usuario no autorizado, redirigiendo...");
    return <Navigate to="/dashboard" replace />;
  }

  console.log(
    "📊 [RENDER] Renderizando LoanDashboard - loans:",
    loans.length,
    "filteredLoans:",
    filteredLoans.length
  );
  // Función para obtener libros
  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.books);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      console.log("📚 [BOOKS] Respuesta de API books:", data);

      // Manejar tanto respuestas con estructura {success, data} como arrays directos
      let booksArray;
      if (data.success && Array.isArray(data.data)) {
        booksArray = data.data;
      } else if (Array.isArray(data)) {
        booksArray = data;
      } else {
        console.warn("Respuesta inesperada de la API de libros:", data);
        booksArray = [];
      }

      setBooks(booksArray);
      return booksArray;
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(err.message);
      setBooks([]); // ← IMPORTANTE: asegurar que books sea un array
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      // Obtener el usuario actual del localStorage
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};

      if (!currentUser || !currentUser.user_id) {
        console.error("Usuario no autenticado");
        setNotification({
          show: true,
          type: "error",
          message: "Debe iniciar sesión para ver la lista de usuarios",
        });
        return [];
      }
      const res = await fetch(API_ENDPOINTS.users, {
        headers: {
          "Content-Type": "application/json",
          // Incluir las credenciales de autenticación
          "x-user-id": currentUser.user_id,
          "x-user-role": currentUser.role,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `Error ${res.status}: ${errorData.message || res.statusText}`
        );
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
        message: `Error al cargar usuarios: ${err.message}`,
      });
      setUsers([]);
      return [];
    }
  };
  // Función para obtener préstamos (ahora recibe books/users)
  const fetchLoans = async (booksArg = books, usersArg = users) => {
    setIsLoading(true);
    setError(null);

    // Asegurar que tenemos arrays válidos
    const validBooks = Array.isArray(booksArg) ? booksArg : [];
    const validUsers = Array.isArray(usersArg) ? usersArg : [];

    console.log("📚 [LOANS] Libros disponibles:", validBooks.length);
    console.log("👥 [LOANS] Usuarios disponibles:", validUsers.length);

    try {
      // Obtener el usuario actual del localStorage para autenticación
      const res = await fetch(API_ENDPOINTS.loans, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();

      console.log("🔍 [LOANS] Respuesta de API loans:", data);

      // Manejar tanto respuestas con estructura {success, data} como arrays directos
      let loansArray;
      if (data.success && Array.isArray(data.data)) {
        loansArray = data.data;
      } else if (Array.isArray(data)) {
        loansArray = data;
      } else {
        console.warn("Respuesta inesperada de la API de préstamos:", data);
        throw new Error("Respuesta inesperada de la API de préstamos");
      }

      // Enriquecer los datos con los arrays validados
      const enrichedLoans = loansArray.map((loan) => {
        const today = new Date();
        const returnDate = loan.return_date ? new Date(loan.return_date) : null;
        let status = "active";
        if (loan.actual_return_date) status = "returned";
        else if (returnDate && returnDate < today) status = "overdue";

        const book = validBooks.find((b) => b.book_id === loan.book_id);
        const user = validUsers.find((u) => u.user_id === loan.user_id);
        return {
          ...loan,
          status,
          book_title: book ? book.title : `Libro #${loan.book_id}`,
          user_name: user ? user.name : `Usuario #${loan.user_id}`,
        };
      });

      console.log("✅ [LOANS] Préstamos enriquecidos:", enrichedLoans);
      setLoans(enrichedLoans);
      console.log(
        "🔄 [LOANS] Estado loans actualizado, triggering filter effect..."
      );

      // IMMEDIATE FIX: Call filter directly since useEffect might not trigger immediately
      const filtered = enrichedLoans.filter((loan) => {
        let matchesSearch = true;
        if (searchTerm) {
          matchesSearch =
            loan.book_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loan.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
        }

        let matchesStatus = true;
        if (filterStatus !== "all") {
          matchesStatus = loan.status === filterStatus;
        }

        return matchesSearch && matchesStatus;
      });

      console.log(
        "🔄 [LOANS] Aplicando filtros inmediatamente:",
        filtered.length
      );
      setFilteredLoans(filtered);
    } catch (err) {
      console.error("❌ [LOANS] Error fetching loans:", err);
      setError(err.message || "Error al cargar los préstamos");
    } finally {
      setIsLoading(false);
    }
  };

  // (Función enrichLoansData eliminada porque no se utiliza) // Filtrar y ordenar préstamos
  const filterAndSortLoans = (loansToFilter = loans) => {
    console.log("🔍 [FILTER] Iniciando filtrado...");
    console.log("🔍 [FILTER] Parámetros:", {
      loansToFilterLength: loansToFilter.length,
      searchTerm,
      filterStatus,
      sortConfig,
    });

    let filtered = [...loansToFilter];
    console.log("🔍 [FILTER] Array inicial:", filtered.length);

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (loan) =>
          loan.book_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("🔍 [FILTER] Después de búsqueda:", filtered.length);
    }

    // Aplicar filtro de estado
    if (filterStatus !== "all") {
      filtered = filtered.filter((loan) => loan.status === filterStatus);
      console.log("🔍 [FILTER] Después de filtro de estado:", filtered.length);
    }

    // Ordenar
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    console.log("🔍 [FILTER] Resultado final:", filtered.length);
    setFilteredLoans(filtered);
    console.log("🔍 [FILTER] Estado filteredLoans actualizado");
    // Resetear a la primera página cuando cambian los filtros
    setCurrentPage(1);
    return filtered;
  };

  // Manejar cambios en el formulario
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Limpiar error específico cuando el usuario corrige
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    if (!form.book_id) errors.book_id = "Selecciona un libro";
    if (!form.user_id) errors.user_id = "Selecciona un usuario";
    if (!form.loan_date)
      errors.loan_date = "La fecha de préstamo es obligatoria";

    // Validar que la fecha de devolución sea posterior a la de préstamo
    if (form.loan_date && form.return_date) {
      const loanDate = new Date(form.loan_date);
      const returnDate = new Date(form.return_date);
      if (returnDate < loanDate) {
        errors.return_date =
          "La fecha de devolución debe ser posterior a la de préstamo";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }; // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 [FORM] Iniciando envío del formulario...");
    console.log("📝 [FORM] Datos del formulario:", form);

    if (!validateForm()) {
      console.log("❌ [FORM] Validación fallida:", formErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Obtener el usuario actual del localStorage
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      console.log("👤 [FORM] Usuario actual:", currentUser);

      if (!currentUser || !currentUser.user_id) {
        throw new Error("Debe iniciar sesión para gestionar préstamos");
      }
      if (editLoan) {
        console.log("✏️ [FORM] Editando préstamo:", editLoan.loan_id);
        const res = await fetch(`${API_ENDPOINTS.loans}/${editLoan.loan_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Incluir las credenciales de autenticación
            "x-user-id": currentUser.user_id,
            "x-user-role": currentUser.role,
          },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            `Error ${res.status}: ${errorData.message || res.statusText}`
          );
        }
        console.log("✅ [FORM] Préstamo actualizado exitosamente");
        showNotification("success", "Préstamo actualizado correctamente");
      } else {
        console.log("➕ [FORM] Creando nuevo préstamo");
        const res = await fetch(API_ENDPOINTS.loans, {
          method: "POST",
          headers: { ...getAuthHeaders() },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.log("❌ [FORM] Error en la respuesta:", errorData);
          throw new Error(
            `Error ${res.status}: ${errorData.message || res.statusText}`
          );
        }
        console.log("✅ [FORM] Préstamo creado exitosamente");
        showNotification("success", "Préstamo registrado correctamente");
      }

      console.log("🔄 [FORM] Limpiando formulario y recargando datos...");
      setShowForm(false);
      setEditLoan(null);
      resetForm();
      const booksData = await fetchBooks();
      const usersData = await fetchUsers();
      await fetchLoans(booksData, usersData);
      console.log("✅ [FORM] Proceso completado");
    } catch (err) {
      console.error("❌ [FORM] Error saving loan:", err);
      showNotification(
        "error",
        `Error: ${err.message || "No se pudo guardar el préstamo"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setForm({
      book_id: "",
      user_id: "",
      loan_date: "",
      return_date: "",
    });
    setFormErrors({});
  };

  // (Función handleEdit eliminada porque no se utiliza)

  // Confirmar eliminación de préstamo

  // Eliminar préstamo
  const handleDelete = async () => {
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      // Obtener el usuario actual del localStorage
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};

      if (!currentUser || !currentUser.user_id) {
        throw new Error("Debe iniciar sesión para eliminar un préstamo");
      }

      const res = await fetch(
        `${API_ENDPOINTS.loans}/${confirmDelete.loan_id}`,
        {
          method: "DELETE",
          headers: {
            // Incluir las credenciales de autenticación
            "x-user-id": currentUser.user_id,
            "x-user-role": currentUser.role,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `Error ${res.status}: ${errorData.message || res.statusText}`
        );
      }

      showNotification("success", "Préstamo eliminado correctamente");
      const booksData = await fetchBooks();
      const usersData = await fetchUsers();
      await fetchLoans(booksData, usersData); // Espera a que termine antes de continuar
    } catch (err) {
      console.error("Error deleting loan:", err);
      showNotification(
        "error",
        `Error: ${err.message || "No se pudo eliminar el préstamo"}`
      );
    } finally {
      setIsLoading(false);
      setConfirmDelete(null);
    }
  };

  // Manejar devolución de libro
  const handleReturnBook = async () => {
    if (!confirmReturn) return;

    setIsLoading(true);
    try {
      // Obtener el usuario actual del localStorage
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};

      if (!currentUser || !currentUser.user_id) {
        throw new Error("Debe iniciar sesión para devolver un préstamo");
      }

      const res = await fetch(
        `${API_ENDPOINTS.loans}/${confirmReturn.loan_id}/return`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Incluir las credenciales de autenticación
            "x-user-id": currentUser.user_id,
            "x-user-role": currentUser.role,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `Error ${res.status}: ${errorData.message || res.statusText}`
        );
      }

      showNotification("success", "Libro devuelto correctamente");
      const booksData = await fetchBooks();
      const usersData = await fetchUsers();
      await fetchLoans(booksData, usersData); // Espera a que termine antes de continuar
    } catch (err) {
      console.error("Error returning book:", err);
      showNotification(
        "error",
        `Error: ${err.message || "No se pudo devolver el libro"}`
      );
    } finally {
      setIsLoading(false);
      setConfirmReturn(null);
    }
  };

  // Mostrar notificación
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Manejar ordenación
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Obtener estadísticas de préstamos
  const getStats = () => {
    const total = loans.length;
    const active = loans.filter((loan) => loan.status === "active").length;
    const overdue = loans.filter((loan) => loan.status === "overdue").length;
    const returned = loans.filter((loan) => loan.status === "returned").length;

    return { total, active, overdue, returned };
  };

  const getBookTitle = (bookId) => {
    const book = books.find((b) => b.book_id === bookId);
    return book ? book.title : `Libro #${bookId}`;
  };

  // (Función getStatusColor eliminada porque no se utiliza)

  // Obtener icono según estado del préstamo
  // (Función eliminada porque no se utiliza) // Estadísticas
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f0fb] via-[#f7fafc] to-[#e3f0fb] p-4 md:p-8">
      {/* Error message */}
      {error && <div className="text-red-500 text-center mb-6">{error}</div>}
      {/* Notificación */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white flex items-center animate-fade-in`}
        >
          {notification.type === "success" ? (
            <FaCheck className="mr-2" />
          ) : (
            <FaExclamationTriangle className="mr-2" />
          )}
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirmar eliminación
              </h3>
              <p className="text-gray-600">
                ¿Estás seguro de que deseas eliminar el préstamo del libro{" "}
                <span className="font-semibold">
                  {getBookTitle(confirmDelete.book_id)}
                </span>
                ?
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

      {/* Modal de confirmación de devolución */}
      {confirmReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 animate-modal">
            <div className="text-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUndo className="text-green-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirmar devolución
              </h3>
              <p className="text-gray-600">
                ¿Estás seguro de que deseas marcar como devuelto el libro{" "}
                <span className="font-semibold">
                  {getBookTitle(confirmReturn.book_id)}
                </span>
                ?
                <br />
                Esta acción marcará el préstamo como completado.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                onClick={() => setConfirmReturn(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors"
                onClick={handleReturnBook}
              >
                Devolver Libro
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
            onClick={() => navigate("/dashboard")}
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
              Administra los préstamos de tu biblioteca. Registra nuevos
              préstamos y devoluciones.
            </p>
          </div>
          <button
            className="flex items-center bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white px-5 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2"
            onClick={() => {
              setShowForm(true);
              setEditLoan(null);
              resetForm();
              // Scroll al formulario
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
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
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.total}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaCheckCircle className="text-green-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Préstamos Activos</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.active}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <FaExclamationTriangle className="text-red-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Préstamos Vencidos</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.overdue}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaCalendarCheck className="text-blue-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Libros Devueltos</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.returned}
              </h3>
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
                  setShowForm(false);
                  setEditLoan(null);
                }}
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="book_id"
                >
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
                {formErrors.book_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.book_id}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="user_id"
                >
                  Usuario <span className="text-red-500">*</span>
                </label>{" "}
                <select
                  id="user_id"
                  name="user_id"
                  value={form.user_id}
                  onChange={handleInput}
                  className={`w-full border ${
                    formErrors.user_id ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                  required
                  disabled={users.length === 0}
                >
                  <option value="">
                    {users.length === 0
                      ? "No hay usuarios disponibles"
                      : "Selecciona un usuario"}
                  </option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {formErrors.user_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.user_id}
                  </p>
                )}
                {users.length === 0 && (
                  <p className="text-amber-500 text-sm mt-1">
                    <FaInfoCircle className="inline mr-1" />
                    No se pudieron cargar los usuarios. Verifica que tienes
                    permisos de administrador o bibliotecario.
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="loan_date"
                >
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
                      formErrors.loan_date
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg pl-10 pr-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                    required
                  />
                </div>
                {formErrors.loan_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.loan_date}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="return_date"
                >
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
                      formErrors.return_date
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg pl-10 pr-4 py-3 focus:border-[#79b2e9] focus:ring-2 focus:ring-[#79b2e9]/30 focus:outline-none transition-all`}
                  />
                </div>
                {formErrors.return_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.return_date}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center"
                  onClick={() => {
                    setShowForm(false);
                    setEditLoan(null);
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
              {sortConfig.key === "loan_date" &&
              sortConfig.direction === "asc" ? (
                <FaSortAlphaDown className="mr-2" />
              ) : sortConfig.key === "loan_date" &&
                sortConfig.direction === "desc" ? (
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
              <button
                className="text-sm text-[#2366a8] hover:text-[#79b2e9]"
                onClick={() => setFilterStatus("all")}
              >
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
        )}{" "}
        {/* Lista de préstamos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredLoans.length === 0 ? (
            <div className="col-span-full text-gray-500 text-center py-8">
              {loans.length === 0
                ? "No hay préstamos registrados."
                : "No se encontraron préstamos con los filtros aplicados."}
            </div>
          ) : (
            paginatedLoans.map((loan) => (
              <div
                key={loan.loan_id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {loan.book_title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <FaUser className="inline mr-1" />
                      {loan.user_name}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      loan.status === "active"
                        ? "bg-green-100 text-green-800"
                        : loan.status === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {loan.status === "active"
                      ? "Activo"
                      : loan.status === "overdue"
                      ? "Vencido"
                      : "Devuelto"}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      Préstamo: {new Date(loan.loan_date).toLocaleDateString()}
                    </span>
                  </div>
                  {loan.return_date && (
                    <div className="flex items-center">
                      <FaCalendarCheck className="mr-2" />
                      <span>
                        Devolución:{" "}
                        {new Date(loan.return_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {loan.actual_return_date && (
                    <div className="flex items-center">
                      <FaCheckCircle className="mr-2 text-green-600" />
                      <span>
                        Devuelto:{" "}
                        {new Date(loan.actual_return_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-center  mt-4 pt-4 border-t border-gray-100 h-auto">
                  {loan.status === "returned" ? (
                    // Botón para libros ya devueltos (deshabilitado pero visible)
                    <button
                      className="bg-green-50 text-green-600 rounded-lg transition-colors flex justify-center items-center grow cursor-default"
                      disabled
                      title="Libro devuelto"
                      aria-label={`Libro ${loan.book_title} ya devuelto`}
                    >
                      Devuelto
                      <FaCheckCircle className="ml-2" />
                    </button>
                  ) : (
                    // Botón para devolver (libros activos y vencidos)
                    <button
                      className="bg-[#dbeafe] text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors flex justify-center items-center grow"
                      onClick={() => setConfirmReturn(loan)}
                      title="Devolver libro"
                      aria-label={`Devolver libro ${loan.book_title}`}
                    >
                      Devolver
                      <FaUndo className="ml-2" />
                    </button>
                  )}
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors grow-0"
                    onClick={() => {
                      setEditLoan(loan);
                      setForm({
                        book_id: loan.book_id,
                        user_id: loan.user_id,
                        loan_date: loan.loan_date.split("T")[0],
                        return_date: loan.return_date
                          ? loan.return_date.split("T")[0]
                          : "",
                      });
                      setShowForm(true);
                      setTimeout(() => {
                        formRef.current?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    title="Editar préstamo"
                  >
                    <FaEdit />
                  </button>{" "}
                  {/* Botón de devolución - solo para préstamos activos y vencidos */}
                  <button
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors grow-0"
                    onClick={() => setConfirmDelete(loan)}
                    title="Eliminar préstamo"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Información de paginación */}
            <div className="text-sm text-gray-600">
              Mostrando {(currentPage - 1) * loansPerPage + 1} a{" "}
              {Math.min(currentPage * loansPerPage, filteredLoans.length)} de{" "}
              {filteredLoans.length} préstamos
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
                  let start = Math.max(
                    1,
                    currentPage - Math.floor(maxVisible / 2)
                  );
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
                            ? "bg-[#2366a8] border-[#2366a8] text-white"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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
      </div>
    </div>
  );
}
