// models/user.model.js
import pool from '../config/db.js';

class User {
  constructor(user) {
    this.user_id = user.user_id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }

  // Obtener todos los usuarios
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      return rows.map(row => new User(row));
    } catch (error) {
      throw error;
    }
  }

  // Obtener un usuario por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
      if (rows.length === 0) return null;
      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo usuario
  static async create(newUser) {
    try {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [newUser.name, newUser.email, newUser.password]
      );
      return new User({
        user_id: result.insertId,
        ...newUser
      });
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un usuario existente
  static async update(id, userData) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE user_id = ?',
        [userData.name, userData.email, userData.password, id]
      );
      if (result.affectedRows === 0) return null;
      return new User({
        user_id: id,
        ...userData
      });
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un usuario
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Obtener los préstamos de un usuario
  static async getLoans(id) {
    try {
      const [rows] = await pool.query(`
        SELECT l.*, b.title AS book_title
        FROM loans l
        JOIN books b ON l.book_id = b.book_id
        WHERE l.user_id = ?
      `, [id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuarios por email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) return null;
      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }
}

export default User;