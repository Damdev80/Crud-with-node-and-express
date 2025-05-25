import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
}

const pool = mysql.createPool(config);

export async function  db()  {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

export default pool;