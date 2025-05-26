import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaBook } from "react-icons/fa";
import { getCategories } from "../services/filterService";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from '../config/api.js';
import { getAuthHeaders } from '../utils/authHeaders.js';

export default function CategoryDashboard() {
  const { isLibrarianOrAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editCategory, setEditCategory] = useState(null);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(6); // 6 categorías por página para mejor vista en grid
  
  // Calcular paginación
  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  );

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      const arr = Array.isArray(res) ? res : res.data;
      setCategories(arr || []);
      // Resetear a la primera página si el número de páginas cambió
      setCurrentPage(1);    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("No se pudieron cargar las categorías");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }    try {      const method = editCategory ? "PUT" : "POST";
      const url = editCategory
        ? `${API_BASE_URL}/api/categories/${editCategory.category_id || editCategory.id}`
        : `${API_BASE_URL}/api/categories`;
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar la categoría");
      setSuccessMsg(editCategory ? "¡Categoría actualizada!" : "¡Categoría agregada!");
      setForm({ name: "", description: "" });
      setEditCategory(null);
      setShowForm(false);
      fetchCategories();
      setTimeout(() => setSuccessMsg(""), 2000);    } catch (error) {
      setFormError("Error al guardar la categoría");
    }
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setShowForm(true);
  };  const handleDelete = async (cat) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      const url = `${API_BASE_URL}/api/categories/${cat.category_id || cat.id}`;
      const res = await fetch(url, { 
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error();
      fetchCategories();
    } catch {
      setError("No se pudo eliminar la categoría");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f0fb] via-[#f7fafc] to-[#79b2e9] py-8 px-4">
      <button
          onClick={() => window.history.back()}
          style={{ background: "#2366a8", color: "#e3f0fb", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, marginRight: 4 }}
          className="flex justify-center items-center">←</span> Volver
        </button>
      <div className="max-w-4/5 mx-auto bg-white/90 p-10 rounded-lg ">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#2366a8] flex items-center">
            <FaBook className="mr-2" /> Categorías
          </h1>          {isLibrarianOrAdmin() && (
            <button
              className="flex items-center bg-gradient-to-r from-[#2366a8] to-[#79b2e9] text-white px-4 py-2 rounded-lg shadow hover:from-[#17406a] hover:to-[#2366a8] transition-colors"
              onClick={() => {
                setShowForm(true);
                setEditCategory(null);
                setForm({ name: "", description: "" });
              }}
            >
              <FaPlus className="mr-2" /> Nueva Categoría
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#2366a8] mb-1">Nombre</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInput}
                className="w-full px-4 py-2 rounded-lg border border-[#79b2e9] focus:outline-none focus:ring-2 focus:ring-[#79b2e9]"
                placeholder="Ej: Novela, Ensayo..."
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#2366a8] mb-1">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInput}
                className="w-full px-4 py-2 rounded-lg border border-[#79b2e9] focus:outline-none focus:ring-2 focus:ring-[#79b2e9] resize-none"
                placeholder="Descripción breve de la categoría"
                rows={2}
              />
            </div>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-[#79b2e9] rounded-lg text-[#2366a8] hover:bg-[#e3f0fb] transition-colors"
                onClick={() => {
                  setShowForm(false);
                  setEditCategory(null);
                  setForm({ name: "", description: "" });
                }}
              >
                <FaTimes className="mr-1" /> Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg text-white bg-[#2366a8] hover:bg-[#79b2e9] flex items-center gap-2 transition-colors"
              >
                <FaSave /> {editCategory ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        )}

        {successMsg && (
          <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded-lg px-4 py-2 animate-fade-in">
            {successMsg}
          </div>
        )}        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#79b2e9]"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <FaBook className="mx-auto text-4xl text-gray-300 mb-4 animate-bounce" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No hay categorías disponibles</h3>
            <p className="text-gray-500 mb-4">Agrega categorías para organizar mejor tu biblioteca</p>
            {isLibrarianOrAdmin() && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditCategory(null);
                  setForm({ name: "", description: "" });
                }}
                className="bg-gradient-to-r from-[#2366a8] to-[#79b2e9] text-white px-6 py-3 rounded-lg shadow hover:from-[#17406a] hover:to-[#2366a8] transition-colors flex items-center mx-auto"
              >
                <FaPlus className="mr-2" /> Crear Primera Categoría
              </button>
            )}
          </div>        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {paginatedCategories.map((cat) => (
                <div
                  key={cat.category_id || cat.id}
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 border border-[#79b2e9] animate-fade-in hover:scale-[1.02] hover:shadow-xl transition-transform"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-bold text-[#2366a8]">{cat.name}</div>                    {isLibrarianOrAdmin() && (
                      <div className="flex gap-2">
                        <button
                          className="p-2 rounded-full bg-[#e3f0fb] hover:bg-[#79b2e9] text-[#2366a8] transition-colors"
                          onClick={() => handleEdit(cat)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-2 rounded-full bg-red-100 hover:bg-red-300 text-red-600 transition-colors"
                          onClick={() => handleDelete(cat)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-600 text-sm min-h-[32px]">{cat.description || <span className="italic text-gray-400">Sin descripción</span>}</div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Información de paginación */}
                <div className="text-sm text-gray-600">
                  Mostrando {((currentPage - 1) * categoriesPerPage) + 1} a {Math.min(currentPage * categoriesPerPage, categories.length)} de {categories.length} categorías
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
                      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
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
                                ? 'bg-[#2366a8] border-[#2366a8] text-white'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
          </>
        )}
      </div>
    </div>
  );
}
