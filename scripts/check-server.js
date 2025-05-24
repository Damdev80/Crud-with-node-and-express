// scripts/check-server.js
// Un pequeño script para verificar si el servidor está funcionando en el puerto correcto
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverEnvPath = path.join(__dirname, '..', 'server', '.env');

// Cargar variables de entorno del servidor
dotenv.config({ path: serverEnvPath });

async function checkServer() {
  console.log('🔍 Verificando si el servidor está en funcionamiento...');
  
  const PORT = process.env.PORT || 8000;
  console.log(`📌 Puerto configurado: ${PORT}`);
  
  const url = `http://localhost:${PORT}/health`;
  console.log(`🌐 Intentando conectar a: ${url}`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`✅ Servidor funcionando correctamente en el puerto ${PORT}`);
    console.log(`📊 Respuesta: ${JSON.stringify(data)}`);
    return true;
  } catch (error) {
    console.error(`❌ No se pudo conectar al servidor en el puerto ${PORT}`);
    console.error(`Error: ${error.message}`);
    console.log('\n🔄 Recomendaciones:');
    console.log(`1. Asegúrate de que el servidor esté en ejecución (npm run start:server)`);
    console.log(`2. Verifica que el puerto ${PORT} no esté siendo usado por otra aplicación`);
    console.log('3. Revisa los logs del servidor para ver si hay errores');
    return false;
  }
}

checkServer().catch(console.error);
