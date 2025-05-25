"use client"

import { useEffect, useState } from "react"
import { BookOpen, Plus, Pencil, Trash2, Save, Search, AlertCircle, ArrowUpDown } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { API_ENDPOINTS } from '../config/api.js'
import { getAuthHeaders } from '../utils/authHeaders.js'

export default function EditorialDashboard() {
  const { isLibrarianOrAdmin } = useAuth();
  const [editorials, setEditorials] = useState([])
  const [filteredEditorials, setFilteredEditorials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", description: "" })
  const [editEditorial, setEditEditorial] = useState(null)
  const [formError, setFormError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [editorialToDelete, setEditorialToDelete] = useState(null)
  const [activeView, setActiveView] = useState("grid")

  useEffect(() => {
    fetchEditorials()
  }, [])

  useEffect(() => {
    // Filter and sort editorials whenever search query or sort order changes
    let filtered = [...editorials]

    if (searchQuery) {
      filtered = filtered.filter(
        (ed) =>
          ed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ed.description && ed.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })

    setFilteredEditorials(filtered)
  }, [editorials, searchQuery, sortOrder])

  const fetchEditorials = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(API_ENDPOINTS.editorials)
      const data = await res.json()

      // Add a random book count for demonstration purposes
      const editorialsWithCount = (data.data || []).map((ed) => ({
        ...ed,
        book_count: Math.floor(Math.random() * 50),
        created_at: new Date().toISOString().split("T")[0],
      }))

      setEditorials(editorialsWithCount)
      setFilteredEditorials(editorialsWithCount)
    } catch (err) {
      setError("Error al cargar editoriales")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setFormError("El nombre es obligatorio")
      return
    }    try {
      if (editEditorial) {
        await fetch(`${API_ENDPOINTS.editorials}/${editEditorial.editorial_id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
        })
        alert("Editorial actualizada correctamente.")
      } else {
        await fetch(API_ENDPOINTS.editorials, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
        })
        alert("Editorial creada correctamente.")
      }
      setForm({ name: "", description: "" })
      setEditEditorial(null)
      setShowForm(false)
      fetchEditorials()
    } catch {
      setFormError("Error al guardar la editorial")
    }
  }

  const handleEdit = (editorial) => {
    setEditEditorial(editorial)
    setForm({ name: editorial.name, description: editorial.description || "" })
    setShowForm(true)
  }

  const confirmDelete = (id) => {
    setEditorialToDelete(id)
    setDeleteConfirmOpen(true)
  }
  const handleDelete = async () => {
    if (!editorialToDelete) return

    try {
      await fetch(`${API_ENDPOINTS.editorials}/${editorialToDelete}`, { 
        method: "DELETE",
        headers: getAuthHeaders()
      })
      alert("Editorial eliminada correctamente.")
      fetchEditorials()
    } catch {
      alert("No se pudo eliminar la editorial.")
    } finally {
      setDeleteConfirmOpen(false)
      setEditorialToDelete(null)
    }
  }

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div style={{ background: "#e3f0fb", minHeight: "100vh", padding: 32 }}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px #b6d4f5", padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        {/* Botón de regreso */}
        <button
          onClick={() => window.history.back()}
          style={{ background: "#e3f0fb", color: "#2366a8", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, marginRight: 4 }}
          className="flex justify-center items-center">←</span> Volver
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#2366a8", display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen style={{ width: 40, height: 40 }} /> Editoriales
            </h1>
            <p style={{ color: "#5a7ca8", marginTop: 8 }}>Gestiona las editoriales de tu biblioteca</p>
          </div>          {isLibrarianOrAdmin() && (
            <button
            className="flex justify-center items-center"
              onClick={() => {
                setShowForm(true)
                setEditEditorial(null)
                setForm({ name: "", description: "" })
              }}
              style={{ background: "#2366a8", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}
            >
              <Plus style={{ marginRight: 8, width: 20, height: 20, verticalAlign: "middle" }} /> Nueva Editorial
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, position: "relative" }}
          className="flex justify-center items"
          >
            <Search style={{ position: "absolute", left: 10, top: 10, color: "#b6d4f5", width: 18, height: 18 }} />
            <input
              placeholder="Buscar editoriales..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36, border: "1px solid #b6d4f5", borderRadius: 8, height: 40, width: "100%", background: "#f7fbff" }}
              
            />
          </div>
          <button
            onClick={toggleSort}
            title={`Ordenar ${sortOrder === "asc" ? "descendente" : "ascendente"}`}
            style={{ border: "1px solid #b6d4f5", background: "#fff", borderRadius: 8, width: 40, height: 40, cursor: "pointer" }}
            className="flex justify-center items-center"
          >
            <ArrowUpDown style={{ width: 18, height: 18, color: "#2366a8" }} />
          </button>
        </div>
        {isLoading ? (
          <div style={{ textAlign: "center", color: "#2366a8", padding: 40 }}>Cargando...</div>
        ) : error ? (
          <div style={{ background: "#ffeaea", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <AlertCircle style={{ marginRight: 8, verticalAlign: "middle" }} /> {error}
            <button onClick={fetchEditorials} style={{ marginLeft: 16, color: "#2366a8", background: "none", border: "none", cursor: "pointer" }}>Reintentar</button>
          </div>
        ) : filteredEditorials.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, background: "#f7fbff", borderRadius: 12, border: "1px dashed #b6d4f5" }}>
            <BookOpen style={{ width: 48, height: 48, color: "#b6d4f5", marginBottom: 16 }} />
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#2366a8" }}>No hay editoriales</h3>
            {searchQuery ? (
              <p style={{ color: "#5a7ca8", marginBottom: 16 }}>No se encontraron resultados para "{searchQuery}"</p>
            ) : (
              <p style={{ color: "#5a7ca8", marginBottom: 16 }}>Comienza creando tu primera editorial</p>
            )}
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "#fff", border: "1px solid #b6d4f5", borderRadius: 8, padding: "8px 16px", color: "#2366a8", cursor: "pointer" }}>Limpiar búsqueda</button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {filteredEditorials.map(ed => (
              <div key={ed.editorial_id} style={{ background: "#fff", border: "1px solid #b6d4f5", borderRadius: 12, boxShadow: "0 1px 4px #e3f0fb", padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 700, color: "#2366a8", fontSize: 18 }}>{ed.name}</span>
                    <span style={{ background: "#e3f0fb", color: "#2366a8", borderRadius: 16, padding: "2px 12px", fontSize: 13, fontWeight: 600 }}>{ed.book_count} {ed.book_count === 1 ? "libro" : "libros"}</span>
                  </div>
                  <div style={{ color: "#5a7ca8", fontSize: 13, marginTop: 4 }}>Creada: {ed.created_at}</div>
                  <div style={{ color: "#444", fontSize: 15, marginTop: 8 }}>{ed.description || "Sin descripción"}</div>
                </div>                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                  {isLibrarianOrAdmin() && (
                    <>
                      <button
                        onClick={() => handleEdit(ed)}
                        style={{ border: "1px solid #b6d4f5", color: "#2366a8", background: "#e3f0fb", borderRadius: 8, padding: "6px 14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        <Pencil style={{ width: 16, height: 16, marginRight: 6 }} /> Editar
                      </button>
                      <button
                        onClick={() => confirmDelete(ed.editorial_id)}
                        style={{ border: "1px solid #fca5a5", color: "#b91c1c", background: "#fff0f0", borderRadius: 8, padding: "6px 14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        <Trash2 style={{ width: 16, height: 16, marginRight: 6 }} /> Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {showForm && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #b6d4f5", padding: 32, minWidth: 340, maxWidth: 400 }}>
              <h2 style={{ color: "#2366a8", fontWeight: 700, fontSize: 22, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen style={{ width: 24, height: 24 }} /> {editEditorial ? "Editar Editorial" : "Nueva Editorial"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="name" style={{ color: "#2366a8", fontWeight: 600, display: "block", marginBottom: 4 }}>
                    Nombre <span style={{ color: "#b91c1c" }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nombre de la editorial"
                    style={{ border: "1px solid #b6d4f5", borderRadius: 8, padding: "8px 12px", width: "100%" }}
                    required
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="description" style={{ color: "#2366a8", fontWeight: 600, display: "block", marginBottom: 4 }}>
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descripción de la editorial"
                    style={{ border: "1px solid #b6d4f5", borderRadius: 8, padding: "8px 12px", width: "100%", minHeight: 80, resize: "none" }}
                  />
                </div>
                {formError && (
                  <div style={{ background: "#ffeaea", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 8, padding: 10, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle style={{ width: 18, height: 18 }} /> {formError}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{ border: "1px solid #b6d4f5", background: "#fff", color: "#2366a8", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ background: "#2366a8", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}
                  >
                    <Save style={{ marginRight: 6, width: 16, height: 16, verticalAlign: "middle" }} />
                    {editEditorial ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {deleteConfirmOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #b6d4f5", padding: 32, minWidth: 320, maxWidth: 380 }}>
              <h3 style={{ color: "#b91c1c", fontWeight: 700, fontSize: 20, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Trash2 style={{ width: 20, height: 20 }} /> ¿Eliminar editorial?
              </h3>
              <p style={{ color: "#5a7ca8", marginBottom: 20 }}>Esta acción no se puede deshacer. La editorial será eliminada permanentemente de la base de datos.</p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  style={{ border: "1px solid #b6d4f5", background: "#fff", color: "#2366a8", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  style={{ background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  <Trash2 style={{ marginRight: 6, width: 16, height: 16, verticalAlign: "middle" }} /> Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
