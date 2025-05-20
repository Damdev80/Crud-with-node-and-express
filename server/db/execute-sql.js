// Script para ejecutar el archivo SQL add_role_to_users.sql
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library',
    port: 3030,
};

async function executeSQL() {
    try {
        // Obtener la ruta actual del archivo
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        
        // Leer el archivo SQL
        const sqlFile = path.join(__dirname, 'add_role_to_users.sql');
        const sqlScript = fs.readFileSync(sqlFile, 'utf8');
        
        // Dividir el script en consultas individuales
        const queries = sqlScript
            .split(';')
            .map(query => query.trim())
            .filter(query => query.length > 0);
        
        // Crear conexión a la base de datos
        const connection = await mysql.createConnection(config);
        console.log('Conectado a la base de datos');
        
        // Ejecutar cada consulta
        for (const query of queries) {
            console.log(`Ejecutando: ${query}`);
            await connection.execute(query);
        }
        
        console.log('Script SQL ejecutado correctamente');
        await connection.end();
    } catch (error) {
        console.error('Error al ejecutar el script SQL:', error);
    }
}

executeSQL();
