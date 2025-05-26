import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine __dirname for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.join(__dirname, process.env.NODE_ENV === 'development' ? '.env.development' : '.env') });

// Apply temporary environment fix for production
import './temp-env-fix.js';

// Force deployment refresh

import authorRoutes from './routes/author.routes.js';
import bookRoutes from './routes/book.routes.js';
import categoryRoutes from './routes/category.routes.js';
import loanRoutes from './routes/loan.routes.js';
import userRoutes from './routes/user.routes.js';
import editorialRoutes from './routes/editorial.routes.js';
import { processUser } from './middlewares/auth.js';
import { runMigration } from './migrations/migrate-controller.js';

const app = express();

// Configurar CORS para permitir múltiples orígenes
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', 
  'https://localhost:3000',
  'https://localhost:5173',
  process.env.FRONTEND_URL, // Para configurar en Render
  'https://crud-with-node-and-express-qn0gsbdbu-damdev80s-projects.vercel.app', // Tu dominio actual de Vercel
];

// Añadir dominios de Vercel si están definidos
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, postman, etc)
    if (!origin) return callback(null, true);
    
    // Permitir todos los dominios de Vercel (*.vercel.app)
    if (origin && origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Permitir orígenes específicos
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    console.log(`❌ CORS blocked origin: ${origin}`);
    return callback(new Error('No permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Aplicar middleware para extraer el usuario de la petición
app.use(processUser);

const PORT = process.env.PORT || 8000;

// Servir archivos estáticos de la carpeta uploads con manejo mejorado
import imageStorage from './utils/imageStorage.js';

app.use('/uploads', express.static(imageStorage.getUploadPath()));

// Endpoint para limpiar imágenes antiguas (solo para admins)
app.post('/api/admin/cleanup-images', (req, res) => {
  try {
    const { days = 30 } = req.body;
    const deletedCount = imageStorage.cleanupOldImages(days);
    res.json({
      success: true,
      message: `Image cleanup completed`,
      deletedFiles: deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during cleanup',
      error: error.message
    });
  }
});

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
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    version: '2.1-turso-fix'
  });
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
  console.log(`🔧 DB_PROVIDER: ${process.env.DB_PROVIDER}`); // Force deploy v2
});

export { app, server };
