import express from 'express';
import { getAllLoans, getLoanById, createLoan, returnLoan, deleteLoan } from '../controllers/loan.controller.js';

const router = express.Router();

router.get('/', getAllLoans);
router.get('/:id', getLoanById);
router.post('/', createLoan);
router.put('/:id/return', returnLoan);
router.delete('/:id', deleteLoan);

export default router;
