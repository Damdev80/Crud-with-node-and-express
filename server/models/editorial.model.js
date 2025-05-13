import pool from '../config/db.js';

class Editorial {
  constructor(editorial) {
    this.editorial_id = editorial.editorial_id;
    this.name = editorial.name;
    this.description = editorial.description;
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM editorials');
    return rows.map(row => new Editorial(row));
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM editorials WHERE editorial_id = ?', [id]);
    if (rows.length === 0) return null;
    return new Editorial(rows[0]);
  }

  static async create(data) {
    const [result] = await pool.query('INSERT INTO editorials (name, description) VALUES (?, ?)', [data.name, data.description]);
    return { editorial_id: result.insertId, ...data };
  }

  static async update(id, data) {
    await pool.query('UPDATE editorials SET name = ?, description = ? WHERE editorial_id = ?', [data.name, data.description, id]);
    return { editorial_id: id, ...data };
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM editorials WHERE editorial_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findOrCreateByName(name) {
    if (!name) return null;
    // Buscar por nombre
    const [rows] = await pool.query('SELECT * FROM editorials WHERE name = ?', [name]);
    if (rows.length > 0) return rows[0];
    // Crear si no existe
    const [result] = await pool.query('INSERT INTO editorials (name) VALUES (?)', [name]);
    return { editorial_id: result.insertId, name };
  }
}

export default Editorial;
