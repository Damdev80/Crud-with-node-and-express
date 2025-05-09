"use client"

import { useState, useEffect } from "react"
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
} from "react-icons/fa"
import BookForm from "../components/BookForm"

const Dashboard = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showAddBook, setShowAddBook] = useState(false)
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    categories: 0,
    authors: 0,
    recentlyAdded: 0,
    mostViewed: null,
  })

  // Categorías de ejemplo
  const categories = [
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
  }, [books, searchTerm, selectedCategory])

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/books")
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
      result = result.filter((book) => book.category_id === selectedCategory)
    }

    setFilteredBooks(result)
  }

  const calculateStats = () => {
    // Calcular estadísticas básicas
    const totalBooks = books.length
    const availableBooks = books.filter((book) => book.available_copies > 0).length

    // Obtener categorías únicas
    const uniqueCategories = new Set(books.map((book) => book.category_id))

    // Obtener autores únicos
    const uniqueAuthors = new Set(books.map((book) => book.author?.name).filter(Boolean))

    // Libros añadidos en los últimos 30 días
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentlyAdded = books.filter((book) => {
      if (!book.added_date) return false
      const addedDate = new Date(book.added_date)
      return addedDate >= thirtyDaysAgo
    }).length

    // Libro más visto
    let mostViewed = null
    if (books.length > 0) {
      mostViewed = books.reduce((prev, current) => ((prev.views || 0) > (current.views || 0) ? prev : current))
    }

    setStats({
      totalBooks,
      availableBooks,
      categories: uniqueCategories.size,
      authors: uniqueAuthors.size,
      recentlyAdded,
      mostViewed,
    })
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handleAddBook = (bookData) => {
    // Aquí iría la lógica para añadir un libro a través de la API
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Cabecera */}
      <header className="bg-amber-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FaBook className="text-2xl" />
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
                Mi Biblioteca
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddBook(true)}
                className="flex items-center bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" />
                Añadir Libro
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <FaBookOpen className="text-amber-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total de Libros</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalBooks}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaBook className="text-green-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Libros Disponibles</p>
              <p className="text-2xl font-bold text-gray-800">{stats.availableBooks}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaUserFriends className="text-blue-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Autores</p>
              <p className="text-2xl font-bold text-gray-800">{stats.authors}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FaCalendarAlt className="text-purple-700 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Añadidos Recientes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.recentlyAdded}</p>
            </div>
          </div>
        </div>

        {/* Libro más visto */}
        {stats.mostViewed && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaEye className="mr-2 text-amber-700" />
              Libro más popular
            </h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-32 h-48 overflow-hidden rounded-lg shadow-md mb-4 md:mb-0 md:mr-6">
                <img
                  src={`http://localhost:3000/uploads/${stats.mostViewed.cover_image}`}
                  alt={stats.mostViewed.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{stats.mostViewed.title}</h3>
                <p className="text-gray-600">{stats.mostViewed.author?.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">{stats.mostViewed.views}</span> visualizaciones
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.mostViewed.available_copies}{" "}
                  {stats.mostViewed.available_copies === 1 ? "copia disponible" : "copias disponibles"}
                </p>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{stats.mostViewed.description}</p>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-64"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Filtro de categorías */}
              <div className="relative group">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FaFilter className="mr-2 text-gray-500" />
                  <span>{categories.find((c) => c.id === selectedCategory)?.name || "Categorías"}</span>
                </button>

                <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden hidden group-hover:block">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-2 hover:bg-amber-50 ${
                        selectedCategory === category.id ? "bg-amber-100 font-medium" : ""
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cambio de vista */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid" ? "bg-amber-100 text-amber-800" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
                    viewMode === "list" ? "bg-amber-100 text-amber-800" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaList />
                </button>
              </div>

              {/* Acciones adicionales */}
              <div className="flex space-x-2">
                <button
                  onClick={exportCatalog}
                  className="p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg"
                  title="Exportar catálogo"
                >
                  <FaDownload />
                </button>
                <button
                  onClick={printCatalog}
                  className="p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg"
                  title="Imprimir catálogo"
                >
                  <FaPrint />
                </button>
                <button
                  onClick={() => alert("Ver estadísticas")}
                  className="p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg"
                  title="Ver estadísticas"
                >
                  <FaChartBar />
                </button>
              </div>
            </div>
          </div>

          {/* Estado de carga */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              <p>{error}</p>
              <button onClick={fetchBooks} className="mt-2 text-sm font-medium underline">
                Intentar de nuevo
              </button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <FaBook className="mx-auto text-4xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron libros</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== "all"
                  ? "Intenta con otros filtros de búsqueda"
                  : "Añade libros a tu biblioteca para comenzar"}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
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
                  {filteredBooks.map((book) => (
                    <div
                      key={book.book_id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`http://localhost:3000/uploads/${book.cover_image}`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{book.author?.name}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                            {book.category?.name}
                          </span>
                          <span className="text-xs text-gray-500">{book.available_copies} disponibles</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <div key={book.book_id} className="py-4 flex items-center hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-24 overflow-hidden rounded mr-4">
                        <img
                          src={`http://localhost:3000/uploads/${book.cover_image}`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          ISBN: {book.isbn || "N/A"} • Publicado: {book.publication_year || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                          {book.category?.name}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {book.available_copies} {book.available_copies === 1 ? "copia" : "copias"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Paginación (simplificada) */}
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="px-3 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200">1</button>
                  <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">3</button>
                  <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Siguiente
                  </button>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal para añadir libro */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Añadir Nuevo Libro</h2>
                <button onClick={() => setShowAddBook(false)} className="text-gray-400 hover:text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <BookForm onSubmit={handleAddBook} onCancel={() => setShowAddBook(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
