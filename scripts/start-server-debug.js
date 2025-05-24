// scripts/start-server-debug.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Configurar dirname para módulos ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(__dirname, '..', 'server');
const envPath = path.join(serverDir, '.env');

// Cargar variables de entorno
dotenv.config({ path: envPath });

// Leer puerto configurado
const PORT = process.env.PORT || 8000;

console.log('🔍 Iniciando servidor en modo debug...');
console.log(`📁 Directorio del servidor: ${serverDir}`);
console.log(`🔧 Archivo .env: ${envPath}`);
console.log(`🚪 Puerto configurado: ${PORT}`);

// Verificar que server.js existe
const serverJsPath = path.join(serverDir, 'server.js');
if (!fs.existsSync(serverJsPath)) {
  console.error(`❌ Error: No se encontró el archivo ${serverJsPath}`);
  process.exit(1);
}

// Iniciar el servidor
console.log('🚀 Iniciando el servidor...');
const serverProcess = spawn('node', ['server.js'], { 
  cwd: serverDir,
  stdio: 'inherit',
  env: { ...process.env, DEBUG: '*' }
});

serverProcess.on('error', (error) => {
  console.error(`❌ Error al iniciar el servidor: ${error.message}`);
});

// Manejar salida del proceso
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo el servidor...');
  serverProcess.kill('SIGINT');
});

process.on('exit', () => {
  serverProcess.kill('SIGINT');
});
