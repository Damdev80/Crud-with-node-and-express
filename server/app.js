import express from 'express';
import cors from 'cors';
import authorRoutes from './routes/author.routes.js';
import bookRoutes from './routes/book.routes.js';
import categoryRoutes from './routes/category.routes.js';
import loanRoutes from './routes/loan.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;



// Rutas de autores
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes);


app.listen(PORT,()=> {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
