import Loan from '../models/loan.model.js';

// Listar préstamos
export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.getAllWithDetails();
    res.json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al listar préstamos', error: error.message });
  }
};

// Préstamo por ID
export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.getById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    res.json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener préstamo', error: error.message });
  }
};

// Crear préstamo
export const createLoan = async (req, res) => {
  try {
    const newLoan = await Loan.create(req.body);
    res.status(201).json({ success: true, data: newLoan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Devolver libro
export const returnLoan = async (req, res) => {
  try {
    const ok = await Loan.returnBook(req.params.id);
    res.json({ success: ok, message: ok ? 'Libro devuelto' : 'No se pudo devolver' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar préstamo
export const deleteLoan = async (req, res) => {
  try {
    const ok = await Loan.delete(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    res.json({ success: true, message: 'Préstamo eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar préstamo', error: error.message });
  }
};

// Préstamos vencidos
export const getOverdueLoans = async (req, res) => {
  try {
    const overdue = await Loan.getOverdue();
    res.json({ success: true, data: overdue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al listar vencidos', error: error.message });
  }
};
