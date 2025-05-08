import User from '../models/user.model.js';

// Listar usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al listar usuarios', error: error.message });
  }
};

// Usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuario', error: error.message });
  }
};

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear usuario', error: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const updated = await User.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'No existe usuario para actualizar' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const ok = await User.delete(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: error.message });
  }
};

// Préstamos de un usuario
export const getUserLoans = async (req, res) => {
  try {
    const loans = await User.getLoans(req.params.id);
    res.json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener préstamos', error: error.message });
  }
};
