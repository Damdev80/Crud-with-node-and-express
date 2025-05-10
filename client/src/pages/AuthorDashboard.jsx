import { useState, useEffect } from "react";
import { FaUserEdit, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function AuthorDashboard() {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAuthor, setEditAuthor] = useState(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", birth_date: "", nationality: "" });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setIsLoading(true);
    const res = await fetch("http://localhost:3000/api/authors");
    const data = await res.json();
    setAuthors(data);
    setIsLoading(false);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editAuthor) {
      await fetch(`http://localhost:3000/api/authors/${editAuthor.author_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:3000/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditAuthor(null);
    setForm({ first_name: "", last_name: "", birth_date: "", nationality: "" });
    fetchAuthors();
  };

  const handleEdit = (author) => {
    setEditAuthor(author);
    setForm({
      first_name: author.first_name,
      last_name: author.last_name,
      birth_date: author.birth_date || "",
      nationality: author.nationality || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (author_id) => {
    if (window.confirm("¿Eliminar este autor?")) {
      await fetch(`http://localhost:3000/api/authors/${author_id}`, { method: "DELETE" });
      fetchAuthors();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#2366a8]">Autores</h2>
        <button
          className="flex items-center bg-[#79b2e9] hover:bg-[#2366a8] text-white px-4 py-2 rounded-lg"
          onClick={() => { setShowForm(true); setEditAuthor(null); setForm({ first_name: "", last_name: "", birth_date: "", nationality: "" }); }}
        >
          <FaPlus className="mr-2" /> Nuevo Autor
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#2366a8] font-medium mb-1">Nombre</label>
            <input name="first_name" value={form.first_name} onChange={handleInput} className="w-full border border-[#79b2e9] rounded px-3 py-2 mb-2" required />
          </div>
          <div>
            <label className="block text-[#2366a8] font-medium mb-1">Apellido</label>
            <input name="last_name" value={form.last_name} onChange={handleInput} className="w-full border border-[#79b2e9] rounded px-3 py-2 mb-2" required />
          </div>
          <div>
            <label className="block text-[#2366a8] font-medium mb-1">Fecha de nacimiento</label>
            <input name="birth_date" type="date" value={form.birth_date} onChange={handleInput} className="w-full border border-[#79b2e9] rounded px-3 py-2 mb-2" />
          </div>
          <div>
            <label className="block text-[#2366a8] font-medium mb-1">Nacionalidad</label>
            <input name="nationality" value={form.nationality} onChange={handleInput} className="w-full border border-[#79b2e9] rounded px-3 py-2 mb-2" />
          </div>
          <div className="col-span-2 flex justify-end space-x-2 mt-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={() => setShowForm(false)}>Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#2366a8] text-white hover:bg-[#79b2e9]">{editAuthor ? "Actualizar" : "Agregar"}</button>
          </div>
        </form>
      )}
      {isLoading ? (
        <div className="text-[#2366a8]">Cargando autores...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div key={author.author_id} className="bg-white rounded-lg shadow p-6 flex flex-col items-start border border-[#e3f0fb]">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#2366a8]">{author.first_name} {author.last_name}</h3>
                <p className="text-sm text-gray-500 mb-1">Nacimiento: {author.birth_date || "-"}</p>
                <p className="text-sm text-gray-500 mb-2">Nacionalidad: {author.nationality || "-"}</p>
              </div>
              <div className="flex space-x-2 mt-2">
                <button className="p-2 bg-[#79b2e9] text-white rounded hover:bg-[#2366a8]" onClick={() => handleEdit(author)}><FaEdit /></button>
                <button className="p-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => handleDelete(author.author_id)}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
