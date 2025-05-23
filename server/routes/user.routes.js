import express from 'express';
import User from '../models/user.model.js';
import { registerUser, loginUser } from '../controllers/user.controller.js';
import { isAuthenticated, isAdmin, isLibrarianOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas para registro y login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Listar todos los usuarios - admin y bibliotecarios
router.get('/', isLibrarianOrAdmin, async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Obtener un usuario específico - el propio usuario o admin
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    // Verificar si el usuario está intentando acceder a su propia información o es admin
    if (req.user.user_id != req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver la información de este usuario'
      });
    }
    
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Crear usuario - solo admin
router.post('/', isAdmin, async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Actualizar usuario - el propio usuario o admin
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    // Verificar si el usuario está intentando modificar su propia información o es admin
    if (req.user.user_id != req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar este usuario'
      });
    }
    
    // Si no es admin, no permitir cambio de rol
    if (req.user.role !== 'admin' && req.body.role && req.body.role !== req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para cambiar tu rol'
      });
    }
    
    const updated = await User.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'No existe usuario para actualizar' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Eliminar usuario - solo admin
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Préstamos de un usuario - el propio usuario, bibliotecario o admin
router.get('/:id/loans', isAuthenticated, async (req, res) => {
  try {
    // Verificar si el usuario está intentando acceder a sus propios préstamos o es bibliotecario/admin
    if (req.user.user_id != req.params.id && !['librarian', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver los préstamos de este usuario'
      });
    }
    
    const loans = await User.getLoans(req.params.id);
    res.json({ success: true, data: loans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Registro seguro
router.post('/register', registerUser);
// Login seguro
router.post('/login', loginUser);

export default router;
