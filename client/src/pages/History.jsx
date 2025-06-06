import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api.js";
import { getAuthHeaders } from "../utils/authHeaders.js";
import {
  FaUser,
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
  FaArrowLeft,
  FaTimes,
  FaDownload,
  FaFileAlt,
  FaHistory,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
    // State hooks
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "loan_date",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [loansPerPage] = useState(10); // 10 préstamos por página

  // Calcular estadísticas
  const stats = {
    total: loans.length,
    active: loans.filter(loan => !loan.actual_return_date).length,
    returned: loans.filter(loan => loan.actual_return_date).length,
    overdue: loans.filter(loan => {
      const today = new Date();
      return !loan.actual_return_date && 
             loan.return_date && 
             new Date(loan.return_date) < today;
    }).length,
  };

  // Calcular paginación
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * loansPerPage,
    currentPage * loansPerPage
  );  // Función para obtener libros
  const fetchBooks = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.books);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

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

      return booksArray;
    } catch (err) {
      console.error("Error fetching books:", err);
      return [];
    }
  };  // Función para obtener el historial de préstamos
  const fetchLoanHistory = useCallback(async (booksArg) => {
    setIsLoading(true);
    setError(null);

    const validBooks = Array.isArray(booksArg) ? booksArg : [];

    try {
      const response = await fetch(API_ENDPOINTS.loans, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Error al obtener el historial");
      }

      const data = await response.json();
      
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

      // Filtrar solo los préstamos del usuario actual
      const userLoans = loansArray.filter(loan => loan.user_id === user.user_id);
      
      // Enriquecer los datos con información de libros
      const enrichedLoans = userLoans.map((loan) => {
        const today = new Date();
        const returnDate = loan.return_date ? new Date(loan.return_date) : null;
        let status = "active";
        if (loan.actual_return_date) status = "returned";
        else if (returnDate && returnDate < today) status = "overdue";

        const book = validBooks.find((b) => b.book_id === loan.book_id);
        return {
          ...loan,
          status,
          book_title: book ? book.title : `Libro #${loan.book_id}`,
        };
      });

      setLoans(enrichedLoans);
    } catch (error) {
      console.error("Error fetching loan history:", error);
      setError("No se pudo cargar el historial de préstamos");
    } finally {
      setIsLoading(false);
    }
  }, [user]);// Manejar ordenamiento
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };  // Función para descargar historial como PDF// Generar paz y salvo simple
  const generatePazYSalvo = (loan) => {
    try {
      const doc = new jsPDF();
      const today = new Date();
      const pageWidth = doc.internal.pageSize.width;
      
      // Título principal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('PAZ Y SALVO', pageWidth/2, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text('PRÉSTAMO DE BIBLIOTECA', pageWidth/2, 45, { align: 'center' });
      
      // Información básica
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      let yPos = 70;
      
      doc.text(`Usuario: ${user.name}`, 20, yPos);
      yPos += 10;
      doc.text(`Libro: ${loan.book_title}`, 20, yPos);
      yPos += 10;
      doc.text(`ID Préstamo: #${loan.loan_id}`, 20, yPos);
      yPos += 10;
      doc.text(`Fecha préstamo: ${new Date(loan.loan_date).toLocaleDateString('es-ES')}`, 20, yPos);
      yPos += 15;
      
      // Estado
      doc.setFont('helvetica', 'bold');
      if (loan.actual_return_date) {
        doc.text('ESTADO: DEVUELTO', 20, yPos);
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha devolución: ${new Date(loan.actual_return_date).toLocaleDateString('es-ES')}`, 20, yPos);
      } else {
        doc.text('ESTADO: ACTIVO', 20, yPos);
      }
      
      yPos += 30;
      
      // Certificación simple
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const certText = loan.actual_return_date 
        ? `Se certifica que el préstamo ha sido devuelto satisfactoriamente.`
        : `Se certifica que el préstamo se encuentra activo.`;
      
      doc.text(certText, 20, yPos);
      yPos += 30;
      
      // Fecha de generación
      doc.setFontSize(10);
      doc.text(`Generado: ${today.toLocaleDateString('es-ES')}`, 20, yPos);

      // Guardar el documento
      const fileName = `Paz_Y_Salvo_${loan.loan_id}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error al generar paz y salvo:', error);
      alert('Error al generar el paz y salvo.');
    }  };// Load data on mount
  useEffect(() => {
    const loadAll = async () => {
      if (user) {
        const booksData = await fetchBooks();
        await fetchLoanHistory(booksData);
      }
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);  // Filter & sort when data or filters change
  useEffect(() => {
    if (loans.length > 0) {
      let filtered = [...loans];

      // Aplicar filtro de búsqueda
      if (searchTerm) {
        filtered = filtered.filter(
          (loan) =>
            loan.book_title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro de estado
      if (filterStatus !== "all") {
        filtered = filtered.filter((loan) => loan.status === filterStatus);
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

      setFilteredLoans(filtered);
      // Resetear a la primera página cuando cambian los filtros
      setCurrentPage(1);
    } else {
      setFilteredLoans([]);
    }
  }, [loans, searchTerm, filterStatus, sortConfig]);
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e3f0fb] via-[#f7fafc] to-[#e3f0fb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2366a8] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f0fb] via-[#f7fafc] to-[#e3f0fb] p-4 md:p-8">
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
        </div>        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#2366a8] mb-2 flex items-center">
              <FaHistory className="mr-3" />
              Mi Historial de Préstamos
            </h1>
            <p className="text-gray-600">
              Revisa el historial completo de todos tus préstamos de biblioteca.
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaExchangeAlt className="text-blue-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Mis Préstamos</p>
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

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título de libro..."
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
        )}

        {/* Lista de préstamos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {error ? (
            <div className="col-span-full text-center py-8">
              <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredLoans.length === 0 ? (
            <div className="col-span-full text-gray-500 text-center py-8">
              {loans.length === 0
                ? "No tienes préstamos registrados."
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
                      ID: #{loan.loan_id}
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

                <div className="flex justify-center mt-4 pt-4 border-t border-gray-100 h-auto">
                  {loan.status === "returned" ? (
                    // Estado para libros ya devueltos
                    <div className="bg-green-50 text-green-600 rounded-lg px-4 py-2 flex justify-center items-center grow cursor-default">
                      Devuelto
                      <FaCheckCircle className="ml-2" />
                    </div>
                  ) : loan.status === "overdue" ? (
                    // Estado para libros vencidos
                    <div className="bg-red-50 text-red-600 rounded-lg px-4 py-2 flex justify-center items-center grow cursor-default">
                      Vencido
                      <FaExclamationTriangle className="ml-2" />
                    </div>
                  ) : (
                    // Estado para libros activos
                    <div className="bg-blue-50 text-blue-600 rounded-lg px-4 py-2 flex justify-center items-center grow cursor-default">
                      Activo
                      <FaClock className="ml-2" />
                    </div>
                  )}
                  
                  {/* Botón de Paz y Salvo */}
                  <button
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors grow-0 ml-2"
                    onClick={() => generatePazYSalvo(loan)}
                    title={`Generar paz y salvo para préstamo #${loan.loan_id}`}
                  >
                    <FaFileAlt />
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
