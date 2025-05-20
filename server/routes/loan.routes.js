import express from 'express';
import { getAllLoans, getLoanById, createLoan, returnLoan, deleteLoan } from '../controllers/loan.controller.js';
import { isAuthenticated, isLibrarianOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas (accesibles para todos los usuarios autenticados)
router.get('/', isAuthenticated, getAllLoans);
router.get('/:id', isAuthenticated, getLoanById);
router.post('/', isAuthenticated, createLoan); // Cualquier usuario autenticado puede solicitar un préstamo

// Rutas protegidas (solo accesibles para bibliotecarios y administradores)
router.put('/:id/return', isLibrarianOrAdmin, returnLoan); // Procesar devoluciones
router.delete('/:id', isLibrarianOrAdmin, deleteLoan); // Eliminar préstamos

export default router;
