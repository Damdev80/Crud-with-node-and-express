// server/migrations/migrate-controller.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/turso.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Controlador para manejar migraciones de base de datos
 */
export async function runMigration(req, res) {
  try {
    console.log('Ejecutando migración en Turso...');
    
    // Verificar si estamos en producción y si la solicitud tiene autorización
    if (process.env.NODE_ENV === 'production') {
      // En un escenario real, deberías verificar algún token o clave secreta
      // Este es un enfoque simplificado para el ejemplo
      const authHeader = req.headers['x-migration-key'];
      if (authHeader !== process.env.MIGRATION_SECRET_KEY) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado para ejecutar migraciones'
        });
      }
    }
    
    // Leer el archivo de schema
    const schemaPath = path.join(__dirname, 'turso_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo de migración no encontrado'
      });
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Dividir el schema en sentencias individuales
    const statements = schema
      .split(';')
      .filter(statement => statement.trim().length > 0)
      .map(statement => statement.trim() + ';');
    
    const results = [];
    
    // Ejecutar cada sentencia
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`Ejecutando sentencia ${i+1}/${statements.length}`);
        await query(statement);
        results.push({
          index: i,
          success: true,
          statement: statement.substring(0, 50) + '...'
        });
      } catch (error) {
        console.error(`Error en sentencia ${i+1}:`, error);
        results.push({
          index: i,
          success: false,
          statement: statement.substring(0, 50) + '...',
          error: error.message
        });
        
        // No detener la ejecución si una sentencia falla
        // (común para sentencias como CREATE TABLE IF NOT EXISTS)
      }
    }
    
    const failedStatements = results.filter(r => !r.success).length;
    
    return res.status(200).json({
      success: true,
      message: `Migración completada con ${failedStatements} errores de ${statements.length} sentencias`,
      results
    });
    
  } catch (error) {
    console.error('Error en la migración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error ejecutando migración',
      error: error.message
    });
  }
}
