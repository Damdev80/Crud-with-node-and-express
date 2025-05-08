import express from 'express';
import Loan from '../models/loan.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const loans = await Loan.getAll();
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const loan = await Loan.getById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Préstamo no encontrado' });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newLoan = await Loan.create(req.body);
    res.status(201).json(newLoan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Loan.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Loan.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Préstamo no encontrado' });
    res.json({ message: 'Préstamo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/book', async (req, res) => {
  try {
    const book = await Loan.getBook(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/user', async (req, res) => {
  try {
    const user = await Loan.getUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
