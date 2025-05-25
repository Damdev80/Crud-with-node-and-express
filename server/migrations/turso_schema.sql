-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  author_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Create editorials table
CREATE TABLE IF NOT EXISTS editorials (
  editorial_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  book_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  editorial_id INTEGER,
  publication_year INTEGER,
  isbn TEXT,
  available_copies INTEGER DEFAULT 0,
  description TEXT,
  cover_image TEXT,
  FOREIGN KEY (author_id) REFERENCES authors(author_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (editorial_id) REFERENCES editorials(editorial_id)
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  loan_id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  loan_date TEXT NOT NULL,
  return_date TEXT,
  actual_return_date TEXT,
  status TEXT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);