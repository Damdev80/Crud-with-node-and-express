// models/author.model.js
import pool from '../config/db.js';

class Author {
  // Obtener todos los autores
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM authors');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un autor por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM authors WHERE author_id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  // Crear un nuevo autor
  static async create(author) {
    try {
      const [result] = await pool.query(
        'INSERT INTO authors (first_name, last_name, birth_date, nationality) VALUES (?, ?, ?, ?)',
        [author.first_name, author.last_name, author.birth_date, author.nationality]
      );
      return { author_id: result.insertId, ...author };
    } catch (error) {
      throw error;
    }
  }
  // Actualizar un autor existente
  static async update(id, author) {
    try {
      const [result] = await pool.query(
        'UPDATE authors SET first_name = ?, last_name = ?, birth_date = ?, nationality = ? WHERE author_id = ?',
        [author.first_name, author.last_name, author.birth_date, author.nationality, id]
      );
      if (result.affectedRows === 0) return null;
      return { author_id: id, ...author };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un autor
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM authors WHERE author_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Obtener los libros de un autor
  static async getBooks(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM books WHERE author_id = ?',
        [id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar autor por nombre (nombre completo)
  static async findOrCreateByName(fullName) {
    // Separar en nombre y apellido (simple, asume 2 palabras)
    const [first_name, ...rest] = fullName.trim().split(' ');
    const last_name = rest.join(' ');
    try {
      const [rows] = await pool.query(
        'SELECT * FROM authors WHERE first_name = ? AND last_name = ?',
        [first_name, last_name]
      );
      if (rows.length > 0) return rows[0];
      // Si no existe, crearlo con datos mínimos
      const author = { first_name, last_name, birth_date: null, nationality: null };
      const created = await Author.create(author);
      return { author_id: created.id, ...author };
    } catch (error) {
      throw error;
    }
  }
}

export default Author;