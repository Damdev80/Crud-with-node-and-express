// controllers/category.controller.js
import ModelFactory from '../models/model-factory.js';

const Category = ModelFactory.Category;

// Controlador para categorías
class CategoryController {
  // Obtener todas las categorías
  static async getAll(req, res) {
    try {
      const categories = await Category.getAll();
      res.status(200).json({
        success: true,
        message: 'Categorías recuperadas con éxito',
        data: categories
      });
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las categorías',
        error: error.message
      });
    }
  }

  // Obtener una categoría por ID
  static async getById(req, res) {
    try {
      const id = req.params.id;
      const category = await Category.getById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: `No se encontró una categoría con ID ${id}`
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Categoría recuperada con éxito',
        data: category
      });
    } catch (error) {
      console.error(`Error al obtener la categoría con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la categoría',
        error: error.message
      });
    }
  }

  // Crear una nueva categoría
  static async create(req, res) {
    try {
      const { name, description } = req.body;
      
      // Validación básica
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la categoría es obligatorio'
        });
      }
      
      const newCategory = await Category.create({ name, description });
      
      res.status(201).json({
        success: true,
        message: 'Categoría creada con éxito',
        data: newCategory
      });
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear la categoría',
        error: error.message
      });
    }
  }

  // Actualizar una categoría existente
  static async update(req, res) {
    try {
      const id = req.params.id;
      const { name, description } = req.body;
      
      // Validación básica
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la categoría es obligatorio'
        });
      }
      
      const updatedCategory = await Category.update(id, { name, description });
      
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: `No se encontró una categoría con ID ${id}`
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Categoría actualizada con éxito',
        data: updatedCategory
      });
    } catch (error) {
      console.error(`Error al actualizar la categoría con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la categoría',
        error: error.message
      });
    }
  }

  // Eliminar una categoría
  static async delete(req, res) {
    try {
      const id = req.params.id;
      const deleted = await Category.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `No se encontró una categoría con ID ${id}`
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Categoría eliminada con éxito'
      });
    } catch (error) {
      console.error(`Error al eliminar la categoría con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la categoría',
        error: error.message
      });
    }
  }

  // Obtener libros de una categoría
  static async getBooks(req, res) {
    try {
      const id = req.params.id;
      
      // Verificar si la categoría existe
      const category = await Category.getById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: `No se encontró una categoría con ID ${id}`
        });
      }
      
      const books = await Category.getBooks(id);
      
      res.status(200).json({
        success: true,
        message: 'Libros de la categoría obtenidos con éxito',
        data: books
      });
    } catch (error) {
      console.error(`Error al obtener libros de la categoría con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los libros de la categoría',
        error: error.message
      });
    }
  }
}

export default CategoryController;