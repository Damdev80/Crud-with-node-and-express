import ModelFactory from '../models/model-factory.js';

const Editorial = ModelFactory.Editorial;

export const getAllEditorials = async (req, res) => {
  try {
    const editorials = await Editorial.getAll();
    res.json({ success: true, data: editorials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEditorialById = async (req, res) => {
  try {
    const editorial = await Editorial.getById(req.params.id);
    if (!editorial) return res.status(404).json({ success: false, message: 'Editorial no encontrada' });
    res.json({ success: true, data: editorial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createEditorial = async (req, res) => {
  try {
    const newEditorial = await Editorial.create(req.body);
    res.status(201).json({ success: true, data: newEditorial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEditorial = async (req, res) => {
  try {
    const updated = await Editorial.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteEditorial = async (req, res) => {
  try {
    const deleted = await Editorial.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Editorial no encontrada' });
    res.json({ success: true, message: 'Editorial eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
