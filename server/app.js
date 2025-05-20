import express from 'express';
import cors from 'cors';
import authorRoutes from './routes/author.routes.js';
import bookRoutes from './routes/book.routes.js';
import categoryRoutes from './routes/category.routes.js';
import loanRoutes from './routes/loan.routes.js';
import userRoutes from './routes/user.routes.js';
import editorialRoutes from './routes/editorial.routes.js';
import { processUser } from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// Aplicar middleware para extraer el usuario de la petición
app.use(processUser);

const PORT = process.env.PORT ?? 3000;

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Rutas de autores
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/editorials', editorialRoutes);


app.listen(PORT,()=> {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
