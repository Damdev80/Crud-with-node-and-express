import express from 'express';
import CategoryController from '../controllers/category.controller.js';
import { isAuthenticated, isLibrarianOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', CategoryController.getAll);

router.get('/:id', CategoryController.getById);

router.post('/', isAuthenticated, isLibrarianOrAdmin, CategoryController.create);

router.put('/:id', isAuthenticated, isLibrarianOrAdmin, CategoryController.update);

router.delete('/:id', isAuthenticated, isLibrarianOrAdmin, CategoryController.delete);

router.get('/:id/books', CategoryController.getBooks);

export default router;
