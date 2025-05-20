-- Alteración de la tabla users para añadir el campo de rol
ALTER TABLE users ADD COLUMN role ENUM('user', 'librarian', 'admin') NOT NULL DEFAULT 'user';

-- Actualizar algunos usuarios existentes para pruebas
-- Convertir al primer usuario a admin (ajustar user_id si es necesario)
UPDATE users SET role = 'admin' WHERE user_id = 1;

-- Convertir al segundo usuario a bibliotecario (ajustar user_id si es necesario)
UPDATE users SET role = 'librarian' WHERE user_id = 2;
