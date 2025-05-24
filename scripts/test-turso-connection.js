// scripts/test-turso-connection.js
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverEnvPath = path.join(__dirname, '..', 'server', '.env');

// Cargar variables de entorno del servidor
dotenv.config({ path: serverEnvPath });

async function testConnection() {
  try {
    console.log('🔍 Probando conexión con Turso...');
    
    const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;
    
    console.log('URL:', TURSO_DATABASE_URL);
    console.log('Token existente:', TURSO_AUTH_TOKEN ? 'Sí' : 'No');
    
    if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
      console.error('❌ No se encontraron las credenciales de Turso en el archivo .env');
      return false;
    }
    
    const client = createClient({
      url: TURSO_DATABASE_URL,
      authToken: TURSO_AUTH_TOKEN
    });
    
    console.log('🔄 Conectando a Turso...');
    const result = await client.execute('SELECT 1 as test');
    console.log('✅ Conexión exitosa con Turso:', result.rows);
    
    // Verificar tablas existentes
    console.log('📋 Buscando tablas en la base de datos...');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table'
      ORDER BY name
    `);
    
    if (tables.rows.length > 0) {
      console.log('📊 Tablas encontradas en la base de datos:');
      tables.rows.forEach(row => console.log(`   - ${row.name}`));
      
      // Verificar datos en la tabla users
      if (tables.rows.some(row => row.name === 'users')) {
        const users = await client.execute('SELECT * FROM users LIMIT 5');
        console.log(`👥 Usuarios encontrados: ${users.rows.length}`);
        if (users.rows.length > 0) {
          console.log('Ejemplo de usuario:', {
            id: users.rows[0].user_id,
            name: users.rows[0].name,
            email: users.rows[0].email,
            role: users.rows[0].role
          });
        }
      }
    } else {
      console.warn('⚠️ No se encontraron tablas en la base de datos');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con Turso:', error);
    return false;
  }
}

testConnection().catch(console.error);
