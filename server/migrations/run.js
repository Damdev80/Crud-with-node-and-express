// server/migrations/run.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/turso.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  try {
    console.log('Ejecutando migración en Turso...');
    
    // Leer el archivo de schema
    const schemaPath = path.join(__dirname, 'turso_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('Archivo de schema no encontrado');
      process.exit(1);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Dividir el schema en sentencias individuales
    const statements = schema
      .split(';')
      .filter(statement => statement.trim().length > 0)
      .map(statement => statement.trim() + ';');
    
    // Ejecutar cada sentencia
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`Ejecutando sentencia ${i+1}/${statements.length}...`);
        await query(statement);
        successCount++;
      } catch (error) {
        console.error(`Error en sentencia ${i+1}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`✅ Migración completada: ${successCount} sentencias exitosas, ${errorCount} errores`);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

runMigration();
