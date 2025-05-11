import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await User.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/loans', async (req, res) => {
  try {
    const loans = await User.getLoans(req.params.id);
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registrar usuario (endpoint RESTful y compatible con frontend)
router.post('/register', async (req, res) => {
  try {
    // Permitir tanto name como first_name/last_name
    let { name, first_name, last_name, email, password, phone } = req.body;
    if (name && !first_name && !last_name) {
      const parts = name.trim().split(' ');
      first_name = parts[0];
      last_name = parts.slice(1).join(' ');
    }
    if (!first_name) first_name = '';
    if (!last_name) last_name = '';
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }
    // Aquí podrías hashear la contraseña antes de guardar
    const newUser = await User.create({ first_name, last_name, email, phone: phone || '', password });
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
