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
      return { id: result.insertId, ...author };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un autor existente
  static async update(id, author) {
    try {
      await pool.query(
        'UPDATE authors SET first_name = ?, last_name = ?, birth_date = ?, nationality = ? WHERE author_id = ?',
        [author.first_name, author.last_name, author.birth_date, author.nationality, id]
      );
      return { id, ...author };
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
}

export default Author;