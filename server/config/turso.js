// server/config/turso.js
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

// Verificar variables de entorno requeridas
const requiredEnvVars = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Advertencia: La variable de entorno ${envVar} no está definida.`);
  }
}

// Cliente de Turso - Usará la URL y token de las variables de entorno
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/**
 * Ejecuta una consulta SQL en Turso
 * @param {string} sql - Consulta SQL a ejecutar
 * @param {Array} params - Parámetros para la consulta
 * @returns {Promise} - Resultado de la consulta
 */
export async function query(sql, params = []) {
  try {
    const result = await tursoClient.execute({ sql, args: params });
    return result;
  } catch (error) {
    console.error('Error ejecutando consulta en Turso:', error);
    throw error;
  }
}

export default tursoClient;
