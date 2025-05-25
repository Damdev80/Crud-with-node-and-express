"use client"

import { useState, useEffect, useRef } from "react"
import {
  FaBook,
  FaSearch,
  FaFilter,
  FaThLarge,
  FaList,
  FaPlus,
  FaDownload,
  FaPrint,
  FaChartBar,
  FaEye,
  FaBookOpen,
  FaCalendarAlt,
  FaUserFriends,
  FaUserCog,
  FaSignOutAlt
} from "react-icons/fa"
import {Footer} from "../components/Footer"
import { getCategories, getAuthors } from '../services/filterService';
import { getLoans } from '../services/loanService';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from '../config/api.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin, isLibrarianOrAdmin } = useAuth();
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [viewMode, setViewMode] = useState("grid")
  const [showAddBook, setShowAddBook] = useState(false)
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    categories: 0,
    authors: 0,
    recentlyAdded: 0,
    mostViewed: null,
    loans: 0,
  })
  const [pageTransition, setPageTransition] = useState(false)
  const containerRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loans, setLoans] = useState([]);

  // Categorías de ejemplo
  const exampleCategories = [
    { id: "all", name: "Todas" },
    { id: "1", name: "Novela" },
    { id: "2", name: "Poesía" },
    { id: "3", name: "Ensayo" },
    { id: "4", name: "Ciencia Ficción" },
    { id: "5", name: "Historia" },
  ]

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    if (books.length > 0) {
      filterBooks()
      calculateStats()
    }
  }, [books, searchTerm, selectedCategory, selectedAuthor])
  // Actualizar autores, categorías y préstamos cada vez que se agregue/borre un libro o autor
  useEffect(() => {
    // Obtener categorías y actualizar stats
    const updateCategories = async () => {
      try {
        const data = await getCategories();
        // Si la respuesta es { success, data }
        const categoriesArr = Array.isArray(data) ? data : data.data;
        setCategories(categoriesArr || []);
        setStats((prev) => ({ ...prev, categories: (categoriesArr || []).length }));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        setStats((prev) => ({ ...prev, categories: 0 }));
      }
    };
    
    // Obtener autores y actualizar stats
    const updateAuthors = async () => {
      try {
        const data = await getAuthors();
        // Si la respuesta es { success, data }
        const authorsArr = Array.isArray(data) ? data : data.data;
        setAuthors(authorsArr || []);
        setStats((prev) => ({ ...prev, authors: (authorsArr || []).length }));
      } catch (error) {
        console.error('Error fetching authors:', error);
        setAuthors([]);
        setStats((prev) => ({ ...prev, authors: 0 }));
      }
    };

    // Obtener préstamos y actualizar stats
    const updateLoans = async () => {
      try {
        const loansData = await getLoans();
        setLoans(loansData || []);
        setStats((prev) => ({ ...prev, loans: (loansData || []).length }));
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoans([]);
        setStats((prev) => ({ ...prev, loans: 0 }));
      }
    };

    updateCategories();
    updateAuthors();
    updateLoans();
  }, [books]);

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.books)
      const data = await response.json()

      if (data.data) {
        setBooks(data.data)
        setFilteredBooks(data.data)
      } else {
        // Datos de ejemplo en caso de que la API no responda
        const sampleBooks = generateSampleBooks()
        setBooks(sampleBooks)
        setFilteredBooks(sampleBooks)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setError("No se pudieron cargar los libros. Por favor, intenta de nuevo más tarde.")

      // Datos de ejemplo en caso de error
      const sampleBooks = generateSampleBooks()
      setBooks(sampleBooks)
      setFilteredBooks(sampleBooks)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSampleBooks = () => {
    return [
      {
        book_id: "1",
        title: "Cien años de soledad",
        author: { name: "Gabriel García Márquez" },
        category: { name: "Novela" },
        category_id: "1",
        description:
          "Una saga familiar que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.",
        publication_year: "1967",
        isbn: "978-0307474728",
        available_copies: 10,
        cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
        views: 245,
        added_date: "2023-01-15",
      },
      {
        book_id: "2",
        title: "El laberinto de la soledad",
        author: { name: "Octavio Paz" },
        category: { name: "Ensayo" },
        category_id: "3",
        description:
          "Ensayo sobre la identidad mexicana y la psicología del mexicano, explorando la historia y cultura de México.",
        publication_year: "1950",
        isbn: "978-9681603014",
        available_copies: 5,
        cover_image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=687&auto=format&fit=crop",
        views: 120,
        added_date: "2023-02-20",
      },
      {
        book_id: "3",
        title: "Rayuela",
        author: { name: "Julio Cortázar" },
        category: { name: "Novela" },
        category_id: "1",
        description:
          "Una novela experimental que puede leerse de múltiples maneras, siguiendo el orden propuesto por el autor o eligiendo un camino propio.",
        publication_year: "1963",
        isbn: "978-8437601722",
        available_copies: 3,
        cover_image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=688&auto=format&fit=crop",
        views: 189,
        added_date: "2023-03-05",
      },
      {
        book_id: "4",
        title: "Pedro Páramo",
        author: { name: "Juan Rulfo" },
        category: { name: "Novela" },
        category_id: "1",
        description:
          "Una novela que narra el viaje de Juan Preciado a Comala para encontrar a su padre, Pedro Páramo, donde descubre un pueblo habitado por espectros.",
        publication_year: "1955",
        isbn: "978-8437604183",
        available_copies: 7,
        cover_image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=687&auto=format&fit=crop",
        views: 210,
        added_date: "2023-04-10",
      },
      {
        book_id: "5",
        title: "Ficciones",
        author: { name: "Jorge Luis Borges" },
        category: { name: "Cuentos" },
        category_id: "4",
        description:
          "Colección de cuentos que exploran temas como el infinito, el tiempo, los laberintos y los espejos.",
        publication_year: "1944",
        isbn: "978-0802130303",
        available_copies: 2,
        cover_image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=687&auto=format&fit=crop",
        views: 156,
        added_date: "2023-05-15",
      },
      {
        book_id: "6",
        title: "La ciudad y los perros",
        author: { name: "Mario Vargas Llosa" },
        category: { name: "Novela" },
        category_id: "1",
        description: "Novela ambientada en el Colegio Militar Leoncio Prado que narra la vida de un grupo de cadetes.",
        publication_year: "1963",
        isbn: "978-8420471830",
        available_copies: 4,
        cover_image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=687&auto=format&fit=crop",
        views: 98,
        added_date: "2023-06-20",
      },
    ]
  }

  const filterBooks = () => {
    let result = [...books]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.author?.name && book.author.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      result = result.filter((book) => String(book.category_id) === String(selectedCategory))
    }

    // Filtrar por autor
    if (selectedAuthor !== "all") {
      result = result.filter((book) => String(book.author_id) === String(selectedAuthor))
    }

    setFilteredBooks(result)
  }
  const calculateStats = () => {
    // Calcular estadísticas básicas de libros
    const totalBooks = books.length;
    const availableBooks = books.filter((book) => book.available_copies > 0).length;
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const recentlyAdded = books.filter((book) => {
      if (!book.added_date) return false;
      let addedDate;
      if (typeof book.added_date === 'string') {
        addedDate = new Date(book.added_date);
      } else if (book.added_date instanceof Date) {
        addedDate = book.added_date;
      } else {
        return false;
      }
      return !isNaN(addedDate) && addedDate >= thirtyDaysAgo;
    }).length;

    // Libro más rentado (por cantidad de préstamos)
    let mostRented = null;
    if (books.length > 0 && Array.isArray(loans) && loans.length > 0) {
      const loanCounts = {};
      loans.forEach((loan) => {
        if (!loan.book_id) return;
        loanCounts[loan.book_id] = (loanCounts[loan.book_id] || 0) + 1;
      });
      const mostRentedBookId = Object.keys(loanCounts).reduce((a, b) => loanCounts[a] > loanCounts[b] ? a : b);
      mostRented = books.find((b) => String(b.book_id) === String(mostRentedBookId));
      if (mostRented) mostRented.rentCount = loanCounts[mostRentedBookId];
    }    setStats((prevStats) => ({
      ...prevStats, // Mantener authors, categories, loans que se actualizan en otros useEffect
      totalBooks,
      availableBooks,
      recentlyAdded,
      mostViewed: mostRented, // Cambiado a mostRented
    }));
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handleAddBook = async (bookData) => {
    // Aquí iría la lógica para añadir un libro a través de la API
    // Si implementas la API, muestra la alerta después de guardar correctamente:
    // try {
    //   const response = await fetch('http://localhost:3000/api/books', { ... })
    //   if (response.ok) {
    //     alert('Libro añadido con éxito')
    //   }
    // } catch (e) { ... }

    console.log("Añadiendo libro:", bookData)
    setShowAddBook(false)

    // Simulación de añadir un libro
    const newBook = {
      book_id: `${books.length + 1}`,
      title: bookData.title,
      author: { name: "Autor del libro" }, // Esto vendría de la API
      category: { name: "Categoría" }, // Esto vendría de la API
      category_id: bookData.category_id,
      description: bookData.description,
      publication_year: bookData.publication_year,
      isbn: bookData.isbn,
      available_copies: bookData.available_copies,
      cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
      views: 0,
      added_date: new Date().toISOString().split("T")[0],
    }

    setBooks([...books, newBook])
    alert("Libro añadido con éxito")
  }

  const exportCatalog = () => {
    // Lógica para exportar el catálogo
    alert("Exportando catálogo...")
  }

  const printCatalog = () => {
    // Lógica para imprimir el catálogo
    window.print()
  }

  const handleAddBookTransition = () => {
    setPageTransition(true)
    setTimeout(() => {
      window.location.href = '/add'
    }, 400)
  }

  // Función para abrir el modal con la info del libro
  const openBookModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const closeBookModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedBook(null), 300); // Espera animación
  };

  // Resetear a la página 1 si cambian los filtros o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedAuthor]);
  const statCards = [{
    icon: <FaBookOpen className="text-[#2366a8] text-xl" />, 
    bg: "bg-[#e3f0fb]", 
    label: "Total de Editoriales", 
    value: stats.totalBooks,
    onClick: () => navigate('/editorial-dashboard')
  }, {
    icon: <FaBook className="text-green-700 text-xl" />, 
    bg: "bg-green-100", 
    label: "Categoría", 
    value: stats.categories,
    onClick: () => navigate('/category-dashboard')
  }, {
    icon: <FaUserFriends className="text-[#79b2e9] text-xl" />, 
    bg: "bg-[#e3f0fb]", 
    label: "Autores", 
    value: stats.authors,
    onClick: () => navigate('/author-dashboard')
  }, {
    icon: <FaCalendarAlt className="text-purple-700 text-xl" />, 
    bg: "bg-purple-100", 
    label: "Préstamos", 
    value: stats.loans,
    onClick: () => isLibrarianOrAdmin() ? navigate('/loan-dashboard') : alert("Solo bibliotecarios y administradores pueden acceder a esta sección"),
    restricted: !isLibrarianOrAdmin()
  }];

  return (
    <div ref={containerRef} className={`min-h-screen bg-[#f7fafc] transition-opacity duration-400 ${pageTransition ? 'opacity-0' : 'opacity-100'}`}>      {/* Cabecera */}
      <header className="bg-[#79b2e9] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaBook className="text-2xl" />
            <h1 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
              Mi Biblioteca
            </h1>
          </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">            {/* Solo mostrar botón de añadir libro si es bibliotecario o admin */}
            {isLibrarianOrAdmin() && (
              <button
                onClick={handleAddBookTransition}
                className="flex items-center bg-[#79b2e9] hover:bg-[#2366a8] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" />
                Añadir Libro
              </button>
            )}
              {/* Mostrar enlace a administración de usuarios solo para admins */}
            {isAdmin() && (
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center bg-[#2366a8] hover:bg-[#1d5a9a] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaUserCog className="mr-2" />
                Admin Usuarios
              </button>
            )}
              {/* Botón de cerrar sesión */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center bg-white text-[#2366a8] border border-[#2366a8] hover:bg-[#e3f0fb] px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">          {/* Tarjetas de estadísticas con animación fade-in escalonada y navegación */}
          {statCards.map((stat, idx) => (
            <div
              key={stat.label}
              className={`bg-white rounded-xl shadow-md p-6 flex items-center cursor-pointer hover:bg-[#e3f0fb] transition-colors ${stat.restricted ? 'relative' : ''}`}
              style={{
                opacity: 0,
                transform: 'translateY(32px)',
                animation: `fade-in 0.7s cubic-bezier(0.4,0,0.2,1) forwards`,
                animationDelay: `${(idx * 0.10).toFixed(2)}s`,
              }}
              onClick={stat.onClick}
              onAnimationEnd={e => {
                e.currentTarget.style.opacity = 1;
                e.currentTarget.style.transform = 'none';
              }}
            >
              {stat.restricted && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-60 flex items-center justify-center rounded-xl">
                  <span className="bg-white px-2 py-1 rounded text-xs text-gray-600 font-medium shadow">
                    Acceso restringido
                  </span>
                </div>
              )}
              <div className={`rounded-full ${stat.bg} p-3 mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Libro más visto */}
        {stats.mostViewed && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaEye className="mr-2 text-amber-700" />
              <span className="tracking-wide">Libro más popular</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-32 h-48 overflow-hidden rounded-lg shadow-md mb-4 md:mb-0 md:mr-6 animate-fade-in">
                <img
                  src={`${API_ENDPOINTS.uploads}/${stats.mostViewed.cover_image}`}
                  alt={stats.mostViewed.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in"
                />
              </div>
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 animate-fade-in animate-delay-200">{stats.mostViewed?.title || 'Sin datos'}</h3>
                <p className="text-gray-600 animate-fade-in animate-delay-300">
                  {stats.mostViewed?.author?.name
                    || (stats.mostViewed && typeof stats.mostViewed.author === 'object' && `${stats.mostViewed.author.first_name || ''} ${stats.mostViewed.author.last_name || ''}`.trim())
                    || (typeof stats.mostViewed?.author === 'string' && stats.mostViewed.author)
                    || authors.find(a => String(a.id || a.author_id) === String(stats.mostViewed?.author_id))?.name
                    || authors.find(a => String(a.id || a.author_id) === String(stats.mostViewed?.author_id)) && `${authors.find(a => String(a.id || a.author_id) === String(stats.mostViewed?.author_id))?.first_name || ''} ${authors.find(a => String(a.id || a.author_id) === String(stats.mostViewed?.author_id))?.last_name || ''}`.trim()
                    || 'Autor desconocido'}
                </p>
                <p className="text-sm text-gray-500 mt-2 animate-fade-in animate-delay-400">
                  <span className="font-medium">{stats.mostViewed?.rentCount || 0}</span> préstamos
                </p>
                <p className="text-sm text-gray-500 mt-1 animate-fade-in animate-delay-500">
                  {stats.mostViewed.available_copies}{" "}
                  {stats.mostViewed.available_copies === 1 ? "copia disponible" : "copias disponibles"}
                </p>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2 animate-fade-in animate-delay-600">{stats.mostViewed.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 pb-12">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Catálogo de Libros</h2>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Buscador */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar libros..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79b2e9] w-full md:w-64"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Filtro de categorías */}
              <div className="relative group">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat.category_id} value={cat.id || cat.category_id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Filtro de autores */}
              <div className="relative group">
                <select
                  value={selectedAuthor}
                  onChange={e => setSelectedAuthor(e.target.value)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black bg-white focus:ring-2 focus:ring-[#79b2e9]"
                  style={{ color: '#111' }}
                >
                  <option value="all">Todos los autores</option>
                  {authors.map((author) => (
                    <option key={author.id || author.author_id} value={author.id || author.author_id}>
                      {author.name || `${author.first_name || ''} ${author.last_name || ''}`.trim()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cambio de vista */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid" ? "bg-[#e3f0fb] text-[#2366a8]" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
                    viewMode === "list" ? "bg-[#e3f0fb] text-[#2366a8]" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaList />
                </button>
              </div>

              {/* Acciones adicionales */}
              <div className="flex space-x-2">
                <button
                  onClick={exportCatalog}
                  className="p-2 text-gray-600 hover:text-[#2366a8] hover:bg-[#e3f0fb] rounded-lg"
                  title="Exportar catálogo"
                >
                  <FaDownload />
                </button>
                <button
                  onClick={printCatalog}
                  className="p-2 text-gray-600 hover:text-[#2366a8] hover:bg-[#e3f0fb] rounded-lg"
                  title="Imprimir catálogo"
                >
                  <FaPrint />
                </button>
                <button
                  onClick={() => alert("Ver estadísticas")}
                  className="p-2 text-gray-600 hover:text-[#2366a8] hover:bg-[#e3f0fb] rounded-lg"
                  title="Ver estadísticas"
                >
                  <FaChartBar />
                </button>
              </div>
            </div>
          </div>

          {/* Estado de carga */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <div className="relative mb-4">
                <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-700 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBook className="text-blue-700 text-3xl animate-bounce" />
                </div>
              </div>
              <p className="text-lg text-blue-700 font-semibold animate-pulse">Cargando libros...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg animate-fade-in">
              <p>{error}</p>
              <button onClick={fetchBooks} className="mt-2 text-sm font-medium underline">Intentar de nuevo</button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <FaBook className="mx-auto text-4xl text-gray-300 mb-4 animate-bounce" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron libros</h3>
              <p className="text-gray-500">{searchTerm || selectedCategory !== "all"
                ? "Intenta con otros filtros de búsqueda"
                : "Añade libros a tu biblioteca para comenzar"}</p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 px-4 py-2 bg-[#e3f0fb] text-[#2366a8] rounded-lg hover:bg-[#79b2e9] hover:text-white transition-colors animate-fade-in"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Vista de cuadrícula o lista */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedBooks.map((book, idx) => (
                    <div
                      key={book.book_id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                      style={{
                        opacity: 0,
                        transform: 'translateY(32px)',
                        animation: `fade-in 0.7s cubic-bezier(0.4,0,0.2,1) forwards`,
                        animationDelay: `${(idx * 0.08).toFixed(2)}s`,
                      }}
                      onAnimationEnd={e => {
                        e.currentTarget.style.opacity = 1;
                        e.currentTarget.style.transform = 'none';
                      }}
                      onClick={() => openBookModal(book)}
                    >
                      <div className="h-48 overflow-hidden flex flex-col items-center justify-center relative">
                        <img
                          src={book.cover_image && book.cover_image.startsWith('http')
                            ? book.cover_image                            : book.cover_image
                              ? `${API_ENDPOINTS.uploads}/${book.cover_image}`
                              : '/public/vite.svg'}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          className="absolute top-2 right-2 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full shadow-md transition-colors z-10"
                          title="Editar libro"
                          onClick={() => window.location.href = `/edit/${book.book_id}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-[#2366a8] mb-2 cursor-pointer hover:underline" onClick={() => window.location.href = '/author-dashboard'}>
                          {/* Mostrar autor correctamente, incluso si viene como string o id */}
                          {book.author?.name
                            || (book.author && typeof book.author === 'object' && `${book.author.first_name || ''} ${book.author.last_name || ''}`.trim())
                            || (typeof book.author === 'string' && book.author)
                            || authors.find(a => String(a.id || a.author_id) === String(book.author_id))?.name
                            || authors.find(a => String(a.id || a.author_id) === String(book.author_id)) && `${authors.find(a => String(a.id || a.author_id) === String(book.author_id))?.first_name || ''} ${authors.find(a => String(a.id || a.author_id) === String(book.author_id))?.last_name || ''}`.trim()
                            || 'Autor desconocido'}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-[#e3f0fb] text-[#2366a8] px-2 py-1 rounded-full">
                            {book.category?.name ||
                              categories.find(
                                (cat) => String(cat.id || cat.category_id) === String(book.category_id)
                              )?.name ||
                              'Sin categoría'}
                          </span>
                          <span className="text-xs text-gray-500">{book.available_copies} disponibles</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {paginatedBooks.map((book) => (
                    <div key={book.book_id} className="py-4 flex items-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openBookModal(book)}>
                      <div className="w-16 h-24 overflow-hidden rounded mr-4">
                        <img
                          src={`${API_ENDPOINTS.uploads}/${book.cover_image}`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{book.title}</h3>
                        <p className="text-sm text-[#2344a8]">
                          {book.author?.name || book.author || authors.find(a => String(a.id || a.author_id) === String(book.author_id))?.name || 'Autor desconocido'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ISBN: {book.isbn || "N/A"} • Publicado: {book.publication_year || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-[#e3f0fb] text-[#2366a8] px-2 py-1 rounded-full">
                          {book.category?.name ||
                            categories.find(
                              (cat) => String(cat.id || cat.category_id) === String(book.category_id)
                            )?.name ||
                            'Sin categoría'}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {book.available_copies} {book.available_copies === 1 ? "copia" : "copias"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Paginación simple */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <button
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 mr-2"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-1 text-gray-700 font-semibold bg-[#e3f0fb] rounded border border-[#79b2e9]">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 ml-2"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer/>
      {/* Modal para añadir libro */}
      {showAddBook && (() => {
        window.location.href = '/add';
        return null;
      })()}

      {/* Modal para ver información del libro */}
      {showModal && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: 'rgba(121,178,233,0.35)', backdropFilter: 'blur(6px)'}} onClick={closeBookModal}>
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 animate-modal-pop"
            style={{ animation: 'modal-pop 0.35s cubic-bezier(0.4,0,0.2,1)' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-[#79b2e9] text-2xl font-bold focus:outline-none"
              onClick={closeBookModal}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <img
                src={selectedBook.cover_image && selectedBook.cover_image.startsWith('http')
                  ? selectedBook.cover_image                  : selectedBook.cover_image
                    ? `${API_ENDPOINTS.uploads}/${selectedBook.cover_image}`
                    : '/public/vite.svg'}
                alt={selectedBook.title}
                className="w-40 h-60 object-cover rounded-lg shadow mb-4 border"
              />
              <h2 className="text-2xl font-bold text-[#2366a8] mb-1 text-center">{selectedBook.title}</h2>
              <p className="text-md text-[#2366a8] mb-2 text-center">{selectedBook.author?.name}</p>
              <span className="text-xs bg-[#e3f0fb] text-[#2366a8] px-2 py-1 rounded-full mb-2">{selectedBook.category?.name}</span>
              <p className="text-sm text-gray-700 mb-2 text-center">{selectedBook.description}</p>
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                <div className="text-xs text-gray-500">Año: <span className="font-semibold text-gray-700">{selectedBook.publication_year || 'N/A'}</span></div>
                <div className="text-xs text-gray-500">ISBN: <span className="font-semibold text-gray-700">{selectedBook.isbn || 'N/A'}</span></div>
                <div className="text-xs text-gray-500">Copias: <span className="font-semibold text-gray-700">{selectedBook.available_copies}</span></div>
                <div className="text-xs text-gray-500">Vistas: <span className="font-semibold text-gray-700">{selectedBook.views || 0}</span></div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes modal-pop {
              0% { opacity: 0; transform: scale(0.85) translateY(40px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-modal-pop { animation: modal-pop 0.35s cubic-bezier(0.4,0,0.2,1); }
            .animate-fade-in-fast { animation: fade-in 0.2s cubic-bezier(0.4,0,0.2,1); }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
