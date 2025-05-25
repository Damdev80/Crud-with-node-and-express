import ModelFactory from '../models/model-factory.js';

// Listar préstamos
export const getAllLoans = async (req, res) => {
  try {
    console.log('🔍 [LOANS] DB_PROVIDER:', process.env.DB_PROVIDER);
    console.log('🔍 [LOANS] Loan model type:', ModelFactory.Loan.constructor.name);
    const loans = await ModelFactory.Loan.getAllWithDetails();
    console.log('🔍 [LOANS] Loans returned:', loans.length);
    res.json({ success: true, data: loans });
  } catch (error) {
    console.error('❌ [LOANS] Error listing loans:', error);
    res.status(500).json({ success: false, message: 'Error al listar préstamos', error: error.message });
  }
};

// Préstamo por ID
export const getLoanById = async (req, res) => {
  try {
    const loan = await ModelFactory.Loan.getById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    res.json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener préstamo', error: error.message });
  }
};

// Crear préstamo
export const createLoan = async (req, res) => {
  try {
    const newLoan = await ModelFactory.Loan.create(req.body);
    res.status(201).json({ success: true, data: newLoan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Devolver libro
export const returnLoan = async (req, res) => {
  try {
    // Usar la fecha proporcionada por el cliente o la fecha actual
    const { actual_return_date } = req.body;
    const ok = await ModelFactory.Loan.returnBook(req.params.id, actual_return_date);
    res.json({ success: ok, message: ok ? 'Libro devuelto' : 'No se pudo devolver' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar préstamo
export const deleteLoan = async (req, res) => {
  try {
    const ok = await ModelFactory.Loan.delete(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    res.json({ success: true, message: 'Préstamo eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar préstamo', error: error.message });
  }
};

// Préstamos vencidos
export const getOverdueLoans = async (req, res) => {
  try {
    const overdue = await ModelFactory.Loan.getOverdue();
    res.json({ success: true, data: overdue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al listar vencidos', error: error.message });
  }
};
