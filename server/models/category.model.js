import pool from '../config/db.js';

class Category {
  constructor(category) {
    this.category_id = category.category_id;
    this.name = category.name;
    this.description = category.description;
  }

  // Obtener todas las categorías
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM categories');
      return rows.map(row => new Category(row));
    } catch (error) {
      throw error;
    }
  }

  // Obtener una categoría por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM categories WHERE category_id = ?', [id]);
      if (rows.length === 0) return null;
      return new Category(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva categoría
  static async create(newCategory) {
    try {
      const [result] = await pool.query(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [newCategory.name, newCategory.description]
      );
      return new Category({
        category_id: result.insertId,
        ...newCategory
      });
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una categoría existente
  static async update(id, categoryData) {
    try {
      const [result] = await pool.query(
        'UPDATE categories SET name = ?, description = ? WHERE category_id = ?',
        [categoryData.name, categoryData.description, id]
      );
      
      if (result.affectedRows === 0) return null;
      
      return new Category({
        category_id: id,
        ...categoryData
      });
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una categoría
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM categories WHERE category_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Buscar categoría por nombre
  static async findOrCreateByName(name) {
    try {
      const [rows] = await pool.query('SELECT * FROM categories WHERE name = ?', [name]);
      if (rows.length > 0) return rows[0];
      // Si no existe, crearla con descripción vacía
      const created = await Category.create({ name, description: '' });
      return { category_id: created.category_id, name, description: '' };
    } catch (error) {
      throw error;
    }
  }
}

export default Category;