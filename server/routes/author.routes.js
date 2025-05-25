import express from 'express';
import { 
  getAllAuthors, 
  getAuthorById, 
  createAuthor, 
  updateAuthor, 
  deleteAuthor, 
  getAuthorBooks 
} from '../controllers/author.controller.js';
import { isAuthenticated, isLibrarianOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Obtener todos los autores
router.get('/', getAllAuthors);

// Obtener autor por ID
router.get('/:id', getAuthorById);

// Crear nuevo autor - solo bibliotecarios y admins
router.post('/', isAuthenticated, isLibrarianOrAdmin, createAuthor);

// Actualizar autor - solo bibliotecarios y admins
router.put('/:id', isAuthenticated, isLibrarianOrAdmin, updateAuthor);

// Eliminar autor - solo bibliotecarios y admins
router.delete('/:id', isAuthenticated, isLibrarianOrAdmin, deleteAuthor);

// Obtener libros de un autor
router.get('/:id/books', getAuthorBooks);

export default router;
