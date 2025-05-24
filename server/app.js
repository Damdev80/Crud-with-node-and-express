import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authorRoutes from './routes/author.routes.js';
import bookRoutes from './routes/book.routes.js';
import categoryRoutes from './routes/category.routes.js';
import loanRoutes from './routes/loan.routes.js';
import userRoutes from './routes/user.routes.js';
import editorialRoutes from './routes/editorial.routes.js';
import { processUser } from './middlewares/auth.js';
import { runMigration } from './migrations/migrate-controller.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Aplicar middleware para extraer el usuario de la petición
app.use(processUser);

const PORT = process.env.PORT || 8000;

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Rutas de autores
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/editorials', editorialRoutes);

// Endpoint para migraciones de Turso
app.post('/api/migrations/run', runMigration);

// Health check para monitoreo
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:'}${PORT}`);
});

export { app, server };
