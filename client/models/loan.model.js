// models/loan.model.js
import pool from '../config/db.js';

class Loan {
  constructor(loan) {
    this.loan_id = loan.loan_id;
    this.book_id = loan.book_id;
    this.user_id = loan.user_id;
    this.loan_date = loan.loan_date;
    this.return_date = loan.return_date;
    this.actual_return_date = loan.actual_return_date;
    this.status = loan.status;
  }

  // Obtener todos los préstamos
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM loans');
      return rows.map(row => new Loan(row));
    } catch (error) {
      throw error;
    }
  }

  // Obtener un préstamo por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM loans WHERE loan_id = ?', [id]);
      if (rows.length === 0) return null;
      return new Loan(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo préstamo
  static async create(newLoan) {
    try {
      // Iniciar transacción
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Verificar disponibilidad del libro
        const [bookRows] = await connection.query(
          'SELECT available_copies FROM books WHERE book_id = ? FOR UPDATE',
          [newLoan.book_id]
        );

        if (bookRows.length === 0 || bookRows[0].available_copies <= 0) {
          await connection.rollback();
          connection.release();
          throw new Error('El libro no está disponible para préstamo');
        }

        // Actualizar disponibilidad del libro
        await connection.query(
          'UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?',
          [newLoan.book_id]
        );

        // Crear el préstamo
        const [result] = await connection.query(
          'INSERT INTO loans (book_id, user_id, loan_date, return_date, status) VALUES (?, ?, ?, ?, ?)',
          [
            newLoan.book_id,
            newLoan.user_id,
            newLoan.loan_date || new Date(),
            newLoan.return_date,
            newLoan.status || 'active'
          ]
        );

        await connection.commit();
        connection.release();

        return new Loan({
          loan_id: result.insertId,
          ...newLoan,
          loan_date: newLoan.loan_date || new Date(),
          status: newLoan.status || 'active'
        });
      } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
      }
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un préstamo existente
  static async update(id, loanData) {
    try {
      const [result] = await pool.query(
        'UPDATE loans SET book_id = ?, user_id = ?, loan_date = ?, return_date = ?, actual_return_date = ?, status = ? WHERE loan_id = ?',
        [
          loanData.book_id,
          loanData.user_id,
          loanData.loan_date,
          loanData.return_date,
          loanData.actual_return_date,
          loanData.status,
          id
        ]
      );
      
      if (result.affectedRows === 0) return null;
      
      return new Loan({
        loan_id: id,
        ...loanData
      });
    } catch (error) {
      throw error;
    }
  }

  // Devolver un libro
  static async returnBook(id) {
    try {
      // Iniciar transacción
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Obtener información del préstamo
        const [loanRows] = await connection.query(
          'SELECT * FROM loans WHERE loan_id = ? FOR UPDATE',
          [id]
        );

        if (loanRows.length === 0) {
          await connection.rollback();
          connection.release();
          throw new Error('Préstamo no encontrado');
        }

        const loan = loanRows[0];

        if (loan.status === 'returned') {
          await connection.rollback();
          connection.release();
          throw new Error('Este libro ya ha sido devuelto');
        }

        // Actualizar el préstamo a devuelto
        await connection.query(
          'UPDATE loans SET actual_return_date = ?, status = ? WHERE loan_id = ?',
          [new Date(), 'returned', id]
        );

        // Incrementar la disponibilidad del libro
        await connection.query(
          'UPDATE books SET available_copies = available_copies + 1 WHERE book_id = ?',
          [loan.book_id]
        );

        await connection.commit();
        connection.release();

        return true;
      } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
      }
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un préstamo
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM loans WHERE loan_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Obtener préstamos con detalles de libros y usuarios
  static async getAllWithDetails() {
    try {
      const [rows] = await pool.query(`
        SELECT l.*, b.title AS book_title, u.first_name, u.last_name, u.email
        FROM loans l
        JOIN books b ON l.book_id = b.book_id
        JOIN users u ON l.user_id = u.user_id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener préstamos vencidos
  static async getOverdue() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [rows] = await pool.query(`
        SELECT l.*, b.title AS book_title, u.first_name, u.last_name, u.email
        FROM loans l
        JOIN books b ON l.book_id = b.book_id
        JOIN users u ON l.user_id = u.user_id
        WHERE l.return_date < ? AND l.status != 'returned'
      `, [today]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Loan;