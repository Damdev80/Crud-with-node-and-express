-- server/migrations/turso_schema.sql
-- Migration: create_tables
-- Created at: 2025-05-24
-- Turso Migration Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role TEXT CHECK(role IN ('user', 'librarian', 'admin')) DEFAULT 'user'
);

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  author_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  birth_date DATE DEFAULT NULL,
  nationality VARCHAR(50) DEFAULT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) DEFAULT NULL
);

-- Editorials table
CREATE TABLE IF NOT EXISTS editorials (
  editorial_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  book_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(100) NOT NULL,
  author_id INTEGER DEFAULT NULL,
  category_id INTEGER DEFAULT NULL,
  publication_year INTEGER DEFAULT NULL,
  isbn VARCHAR(20) DEFAULT NULL,
  available_copies INTEGER DEFAULT 1,
  description TEXT,
  cover_image TEXT,
  editorial_id INTEGER DEFAULT NULL,
  FOREIGN KEY (author_id) REFERENCES authors (author_id),
  FOREIGN KEY (category_id) REFERENCES categories (category_id),
  FOREIGN KEY (editorial_id) REFERENCES editorials (editorial_id)
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
  loan_id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER DEFAULT NULL,
  user_id INTEGER DEFAULT NULL,
  loan_date DATE NOT NULL,
  return_date DATE DEFAULT NULL,
  actual_return_date DATE DEFAULT NULL,
  status TEXT CHECK(status IN ('active', 'returned', 'overdue')) DEFAULT 'active',
  FOREIGN KEY (book_id) REFERENCES books (book_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Insert some sample data for testing
-- Admin user (password: admin123)
INSERT OR IGNORE INTO users (name, email, password, role)
VALUES ('Admin', 'admin@biblioteca.com', '$2a$10$X7ZkdQ0YPg9Qv.QR.3XBP.VtVQZgMI1MirXsABG.0hoJKA.Fa6syS', 'admin');

-- Insert a few categories
INSERT OR IGNORE INTO categories (name, description) 
VALUES 
  ('Novela', 'Obras de ficción en prosa'),
  ('Ciencia', 'Libros sobre conocimiento científico'),
  ('Historia', 'Libros sobre eventos pasados');

-- Insert a few authors
INSERT OR IGNORE INTO authors (first_name, last_name, nationality) 
VALUES 
  ('Gabriel', 'García Márquez', 'Colombiano'),
  ('Isabel', 'Allende', 'Chilena'),
  ('Jorge Luis', 'Borges', 'Argentino');

-- Insert a few editorials
INSERT OR IGNORE INTO editorials (name, description)
VALUES 
  ('Planeta', 'Editorial internacional con sede en Barcelona'),
  ('Penguin Random House', 'Grupo editorial internacional');
