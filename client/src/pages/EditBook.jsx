"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaBook, FaArrowLeft, FaExclamationTriangle, FaSave, FaTimes } from "react-icons/fa"
import BookForm from "../components/BookForm"

export default function EditBook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3000/api/books/${id}`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.data) {
        setBook(data.data)
      } else {
        throw new Error("No se encontró información del libro")
      }
    } catch (error) {
      console.error("Error fetching book:", error)
      setError(error.message || "No se pudo cargar la información del libro")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (formData) => {
    setIsSaving(true)
    setError(null)

    try {
      const data = new FormData()

      for (const key in formData) {
        if (key === "cover_image" && formData[key] instanceof File) {
          data.append(key, formData[key])
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key])
        }
      }

      const response = await fetch(`http://localhost:3000/api/books/${id}`, {
        method: "PUT",
        body: data,
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Mostrar confirmación de éxito
      setShowConfirmation(true)

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      console.error("Error updating book:", error)
      setError(error.message || "No se pudo actualizar el libro")
      window.scrollTo(0, 0) // Desplazar hacia arriba para mostrar el error
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(-1) // Volver a la página anterior
  }

  const handleRetry = () => {
    fetchBook()
  }

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cargando libro</h2>
          <p className="text-gray-600">Obteniendo información del libro...</p>
        </div>
      </div>
    )
  }

  // Renderizar estado de error
  if (error && !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar el libro</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar confirmación de éxito
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Libro actualizado!</h2>
          <p className="text-gray-600">Los cambios se han guardado correctamente.</p>
          <div className="mt-6 text-sm text-gray-500">Redirigiendo al catálogo...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Botón para volver */}
        <button
          onClick={handleCancel}
          className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Volver al catálogo</span>
        </button>

        {/* Contenedor principal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cabecera */}
          <div className="bg-amber-900 text-white px-6 py-4 flex items-center">
            <FaBook className="text-2xl mr-3" />
            <h1 className="text-xl font-bold">Editar Libro</h1>
          </div>

          {/* Mensaje de error (si existe) */}
          {error && (
            <div className="bg-red-50 text-red-700 px-6 py-4 border-b border-red-100">
              <div className="flex items-center">
                <FaExclamationTriangle className="mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Contenido */}
          <div className="p-6">
            {book && (
              <>
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
                  {book.author && <p className="text-gray-600">por {book.author.name}</p>}
                </div>

                <BookForm
                  onSubmit={handleEdit}
                  onCancel={handleCancel}
                  initialData={{ ...book, id: book.book_id }}
                  isSubmitting={isSaving}
                />
              </>
            )}
          </div>
        </div>

        {/* Botones de acción flotantes (versión móvil) */}
        <div className="fixed bottom-4 right-4 flex space-x-2 md:hidden">
          <button
            onClick={handleCancel}
            className="bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes />
          </button>
          <button
            onClick={() => document.querySelector('form button[type="submit"]').click()}
            className="bg-amber-700 text-white p-3 rounded-full shadow-lg hover:bg-amber-800 transition-colors"
            disabled={isSaving}
          >
            <FaSave />
          </button>
        </div>
      </div>
    </div>
  )
}
