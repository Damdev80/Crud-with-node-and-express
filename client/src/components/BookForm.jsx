import { useState, useEffect } from "react"
import { FaBook, FaUpload, FaTimes, FaSave, FaArrowLeft } from "react-icons/fa"

const BookForm = ({ onSubmit, onCancel, initialData = {}, authors = [], categories = [] }) => {
  const [form, setForm] = useState({
    title: initialData.title || "",
    author_id: initialData.author_id || "",
    category_id: initialData.category_id || "",
    publication_year: initialData.publication_year || "",
    isbn: initialData.isbn || "",
    available_copies: initialData.available_copies || "",
    description: initialData.description || "",
    cover_image: null,
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("");
  // Inicializar imagePreview correctamente para edición y nuevo libro
  const initialImagePreview = initialData.cover_image
    ? (initialData.cover_image.startsWith('http')
        ? initialData.cover_image
        : `http://localhost:3000/uploads/${initialData.cover_image}`)
    : null;

  const [imagePreview, setImagePreview] = useState(initialImagePreview)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validar el formulario cuando cambian los valores
  useEffect(() => {
    validateForm()
  }, [form])

  // Si el libro viene de la API para editar, puede que los campos sean distintos
  useEffect(() => {
    if (initialData && initialData.book_id) {
      setForm({
        title: initialData.title || "",
        author_id: initialData.author_id || "",
        category_id: initialData.category_id || "",
        publication_year: initialData.publication_year || "",
        isbn: initialData.isbn || "",
        available_copies: initialData.available_copies || "",
        description: initialData.description || "",
        cover_image: null,
      });
      setImagePreview(
        initialData.cover_image
          ? (initialData.cover_image.startsWith('http')
              ? initialData.cover_image
              : `http://localhost:3000/uploads/${initialData.cover_image}`)
          : null
      );
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {}
    // Validación de título
    if (!form.title.trim()) newErrors.title = "El título es obligatorio"
    // Validación de autor (solo letras, espacios y acentos)
    if (typeof form.author_id !== "string" || !form.author_id.trim()) {
      newErrors.author_id = "El autor es obligatorio"
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/.test(form.author_id.trim())) {
      newErrors.author_id = "El autor solo puede contener letras y espacios"
    }
    // Validación de categoría (solo letras, espacios y acentos)
    if (typeof form.category_id !== "string" || !form.category_id.trim()) {
      newErrors.category_id = "La categoría es obligatoria"
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/.test(form.category_id.trim())) {
      newErrors.category_id = "La categoría solo puede contener letras y espacios"
    }

    if (form.publication_year) {
      const year = Number.parseInt(form.publication_year)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 1000 || year > currentYear) {
        newErrors.publication_year = `El año debe ser un número entre 1000 y ${currentYear}`
      }
    }

    if (form.isbn && !/^(?:\d{10}|\d{13})$/.test(form.isbn.replace(/-/g, ""))) {
      newErrors.isbn = "El ISBN debe tener 10 o 13 dígitos"
    }

    if (form.available_copies) {
      const copies = Number.parseInt(form.available_copies)
      if (isNaN(copies) || copies < 0) {
        newErrors.available_copies = "Las copias deben ser un número positivo"
      }
    }

    if (form.description && form.description.length > 1000) {
      newErrors.description = "La descripción no puede exceder los 1000 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm((prev) => ({ ...prev, cover_image: file }))
      previewImage(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({ ...prev, cover_image: file }))
      previewImage(file)
    }
  }

  const previewImage = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setForm((prev) => ({ ...prev, cover_image: null }))
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      let dataToSend;
      if (!initialData.id) {
        // CREAR: enviar nombres
        dataToSend = {
          ...form,
          author_name: form.author_id,
          category_name: form.category_id,
        };
        delete dataToSend.author_id;
        delete dataToSend.category_id;
      } else {
        // EDITAR: enviar IDs
        dataToSend = { ...form };
      }
      await onSubmit(dataToSend)
      setSuccessMessage(initialData.id ? "¡Libro actualizado exitosamente!" : "¡Libro agregado exitosamente!");
      setTimeout(() => setSuccessMessage(""), 3500);
      // Resetear el formulario después de enviar exitosamente
      if (!initialData.id) {
        setForm({
          title: "",
          author_id: "",
          category_id: "",
          publication_year: "",
          isbn: "",
          available_copies: "",
          description: "",
          cover_image: null,
        })
        setImagePreview(null)
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      setSuccessMessage("");
      setErrors({ general: error.message || "Ocurrió un error al agregar el libro. Intenta de nuevo." });
      setTimeout(() => setErrors({}), 3500);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <header className="bg-amber-700 text-white rounded-t-xl shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaBook className="text-3xl" />
            <span className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Gestión de Libros</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="italic text-amber-100 text-sm">Biblioteca Virtual</span>
            <a
              href="/"
              className="ml-4 flex items-center px-4 py-2 border border-white rounded-lg text-white hover:bg-amber-800 transition-colors shadow"
            >
              <FaArrowLeft className="mr-2" />
              Regresar
            </a>
          </div>
        </header>
      </div>

      <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">{initialData.id ? "Editar Libro" : "Nuevo Libro"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Cien años de soledad"
              className={`w-full px-4 py-2 rounded-lg border ${errors.title ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
              required
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              name="author_id"
              value={form.author_id}
              onChange={handleChange}
              placeholder="Ej: Gabriel García Márquez"
              className={`w-full px-4 py-2 rounded-lg border ${errors.author_id ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
              required
              autoComplete="off"
            />
            {errors.author_id && <p className="mt-1 text-sm text-red-500">{errors.author_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <input
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              placeholder="Ej: Novela"
              className={`w-full px-4 py-2 rounded-lg border ${errors.category_id ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
              required
              autoComplete="off"
            />
            {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año de publicación</label>
              <input
                name="publication_year"
                value={form.publication_year}
                onChange={handleChange}
                placeholder="Ej: 2023"
                className={`w-full px-4 py-2 rounded-lg border ${errors.publication_year ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.publication_year && <p className="mt-1 text-sm text-red-500">{errors.publication_year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Copias disponibles</label>
              <input
                name="available_copies"
                value={form.available_copies}
                onChange={handleChange}
                placeholder="Ej: 5"
                type="number"
                min="0"
                className={`w-full px-4 py-2 rounded-lg border ${errors.available_copies ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.available_copies && <p className="mt-1 text-sm text-red-500">{errors.available_copies}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              placeholder="Ej: 978-3-16-148410-0"
              className={`w-full px-4 py-2 rounded-lg border ${errors.isbn ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {errors.isbn && <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Escribe una breve sinopsis del libro..."
              rows="4"
              className={`w-full px-4 py-2 rounded-lg border ${errors.description ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none`}
            />
            <div className="flex justify-between mt-1">
              <p
                className={`text-xs ${form.description.length > 900 ? "text-amber-600" : "text-gray-500"} ${form.description.length > 1000 ? "text-red-500" : ""}`}
              >
                {form.description.length}/1000 caracteres
              </p>
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portada del libro</label>

            {imagePreview ? (
              <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div
                className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                  isDragging
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-300 hover:border-amber-500 hover:bg-amber-50"
                } transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("cover_image").click()}
              >
                <FaUpload className="text-amber-500 text-2xl mb-2" />
                <p className="text-sm text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG o JPEG (máx. 5MB)</p>
              </div>
            )}

            <input type="file" id="cover_image" onChange={handleFile} accept="image/*" className="hidden" />
          </div>
        </div>

        {/* Botones de acción - ocupan todo el ancho */}
        <div className="col-span-1 md:col-span-2 flex justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className={`flex items-center px-6 py-2 rounded-lg text-white transition-colors ${
              isSubmitting || Object.keys(errors).length > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-800"
            }`}
          >
            <FaSave className="mr-2" />
            {isSubmitting ? "Guardando..." : initialData.id ? "Actualizar libro" : "Guardar libro"}
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 text-red-800 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {errors.general}
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <div className="flex flex-col items-center animate-fade-in">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-amber-300 border-t-amber-700 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaBook className="text-amber-700 text-3xl animate-bounce" />
              </div>
            </div>
            <span className="text-amber-800 font-semibold animate-pulse text-lg">Guardando libro...</span>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-10 bg-amber-50 border-t border-amber-200 py-6 rounded-b-xl shadow-inner text-center">
        <p className="text-sm text-amber-700">&copy; {new Date().getFullYear()} Biblioteca Virtual &mdash; CRUD desarrollado con Node.js, Express, MySQL y React</p>
      </footer>
    </div>
  )
}

export default BookForm