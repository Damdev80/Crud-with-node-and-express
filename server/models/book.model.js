import pool from '../config/db.js';

class Book {
  constructor(book) {
    this.book_id = book.book_id;
    this.title = book.title;
    this.author_id = book.author_id;
    this.category_id = book.category_id;
    this.editorial_id = book.editorial_id; // NUEVO
    this.publication_year = book.publication_year;
    this.isbn = book.isbn;
    this.available_copies = book.available_copies;
    this.description = book.description;
    this.cover_image = book.cover_image;  // Añadido para almacenar la ruta de la imagen
  }

  // Obtener todos los libros
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM books');
      return rows.map(row => new Book(row));
    } catch (error) {
      throw error;
    }
  }

  // Obtener un libro por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM books WHERE book_id = ?', [id]);
      if (rows.length === 0) return null;
      return new Book(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo libro
  static async create(newBook) {
    try {
      const [result] = await pool.query(
        'INSERT INTO books (title, author_id, category_id, editorial_id, publication_year, isbn, available_copies, description, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newBook.title,
          newBook.author_id,
          newBook.category_id,
          newBook.editorial_id, // NUEVO
          newBook.publication_year,
          newBook.isbn,
          newBook.available_copies,
          newBook.description,
          newBook.cover_image
        ]
      );
      return new Book({
        book_id: result.insertId,
        ...newBook
      });
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un libro existente
  static async update(id, bookData) {
    try {
      const [result] = await pool.query(
        'UPDATE books SET title = ?, author_id = ?, category_id = ?, editorial_id = ?, publication_year = ?, isbn = ?, available_copies = ?, description = ?, cover_image = ? WHERE book_id = ?',
        [
          bookData.title,
          bookData.author_id,
          bookData.category_id,
          bookData.editorial_id, // NUEVO
          bookData.publication_year,
          bookData.isbn,
          bookData.available_copies,
          bookData.description,
          bookData.cover_image,
          id
        ]
      );
      if (result.affectedRows === 0) return null;
      return new Book({
        book_id: id,
        ...bookData
      });
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un libro
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM books WHERE book_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Obtener libros con detalles de autor y categoría
  static async getAllWithDetails() {
    try {
      const [rows] = await pool.query(`
        SELECT b.*, a.first_name, a.last_name, c.name as category_name, e.name as editorial_name
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.author_id
        LEFT JOIN categories c ON b.category_id = c.category_id
        LEFT JOIN editorials e ON b.editorial_id = e.editorial_id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar libros por título
  static async searchByTitle(title) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM books WHERE title LIKE ?',
        [`%${title}%`]
      );
      return rows.map(row => new Book(row));
    } catch (error) {
      throw error;
    }
  }

  // Verificar disponibilidad de un libro
  static async checkAvailability(id) {
    try {
      const [rows] = await pool.query(
        'SELECT available_copies FROM books WHERE book_id = ?',
        [id]
      );
      if (rows.length === 0) return null;
      return rows[0].available_copies > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default Book;
