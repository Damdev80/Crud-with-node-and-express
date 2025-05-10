import { useState, useEffect } from "react";
import { FaBook, FaUser, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

export default function LoanDashboard() {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ book_id: "", user_id: "", loan_date: "", return_date: "" });
  const [editLoan, setEditLoan] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setIsLoading(true);
    const res = await fetch("http://localhost:3000/api/loans");
    const data = await res.json();
    setLoans(data);
    setIsLoading(false);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editLoan) {
      await fetch(`http://localhost:3000/api/loans/${editLoan.loan_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:3000/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditLoan(null);
    setForm({ book_id: "", user_id: "", loan_date: "", return_date: "" });
    fetchLoans();
  };

  const handleEdit = (loan) => {
    setEditLoan(loan);
    setForm({
      book_id: loan.book_id,
      user_id: loan.user_id,
      loan_date: loan.loan_date || "",
      return_date: loan.return_date || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (loan_id) => {
    if (window.confirm("¿Eliminar este préstamo?")) {
      await fetch(`http://localhost:3000/api/loans/${loan_id}`, { method: "DELETE" });
      fetchLoans();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#2366a8]">Préstamos</h2>
        <button
          className="flex items-center bg-[#79b2e9] hover:bg-[#2366a8] text-white px-4 py-2 rounded-lg"
          onClick={() => { setShowForm(true); setEditLoan(null); setForm({ book_id: "", user_id: "", loan_date: "", return_date: "" }); }}
        >
          <FaPlus className="mr-2" /> Nuevo Préstamo
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#2366a8] font-medium mb-1">ID Libro</label>
            <input name="book_id" value={form.book_id} onChange={handleInput} className="w-full border border-[#79b2e9] rounded px-3 py-2 mb-2" required />
          </div>
          <div>
            <label className="block text-[#2366a8] font-medium mb-1">ID Usuario</label>
            <input name="user_id" value={form.user_id} onChange={handleInput} className="w-full border border-[#79b2e9] rounded px-3 py-2 mb-2" required />
          </div>
          <div>
            <label className="block text-[#2366a8] font-medium mb-1">Fecha de préstamo</label>
            <input name="loan_date" type="date" value={form.loan_date} onChange={handleInput} className="w-full border border-[#79b2e9] rounded px-3 py-2 mb-2" />
          </div>
          <div>
            <label className="block text-[#2366a8] font-medium mb-1">Fecha de devolución</label>
            <input name="return_date" type="date" value={form.return_date} onChange={handleInput} className="w-full border border-[#79b2e9] rounded px-3 py-2 mb-2" />
          </div>
          <div className="col-span-2 flex justify-end space-x-2 mt-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={() => setShowForm(false)}>Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#2366a8] text-white hover:bg-[#79b2e9]">{editLoan ? "Actualizar" : "Agregar"}</button>
          </div>
        </form>
      )}
      {isLoading ? (
        <div className="text-[#2366a8]">Cargando préstamos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <div key={loan.loan_id} className="bg-white rounded-lg shadow p-6 flex flex-col items-start border border-[#e3f0fb]">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#2366a8] flex items-center"><FaBook className="mr-2" />Libro ID: {loan.book_id}</h3>
                <p className="text-sm text-gray-500 mb-1 flex items-center"><FaUser className="mr-1" />Usuario ID: {loan.user_id}</p>
                <p className="text-sm text-gray-500 mb-1">Préstamo: {loan.loan_date || "-"}</p>
                <p className="text-sm text-gray-500 mb-2">Devolución: {loan.return_date || "-"}</p>
              </div>
              <div className="flex space-x-2 mt-2">
                <button className="p-2 bg-[#79b2e9] text-white rounded hover:bg-[#2366a8]" onClick={() => handleEdit(loan)}><FaEdit /></button>
                <button className="p-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => handleDelete(loan.loan_id)}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
