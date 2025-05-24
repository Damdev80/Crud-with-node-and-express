// scripts/test-http-endpoint.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverEnvPath = path.join(__dirname, '..', 'server', '.env');

// Cargar variables de entorno del servidor
dotenv.config({ path: serverEnvPath });

const PORT = process.env.PORT || 8000;
const url = `http://localhost:${PORT}/health`;

console.log(`🔍 Verificando endpoint HTTP: ${url}`);

// Método 1: Usando fetch
async function testWithFetch() {
  try {
    console.log('\n🔄 Probando con fetch...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    
    console.log(`✅ Respuesta recibida (fetch): Status ${response.status}`);
    console.log('Headers:', response.headers.raw());
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Datos JSON:', data);
    } else {
      const text = await response.text();
      console.log(`Respuesta (texto): ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
    }
  } catch (error) {
    console.error(`❌ Error con fetch: ${error.message}`);
  }
}

// Método 2: Usando http.get nativo
function testWithHttp() {
  return new Promise((resolve) => {
    console.log('\n🔄 Probando con http.get nativo...');
    
    const req = http.get(url, (res) => {
      console.log(`✅ Respuesta recibida (http): Status ${res.statusCode}`);
      console.log('Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Respuesta completa:');
        try {
          const json = JSON.parse(data);
          console.log('Datos JSON:', json);
        } catch (e) {
          console.log(`Datos (texto): ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Error con http.get: ${error.message}`);
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.error('❌ Timeout después de 5 segundos');
      req.destroy();
      resolve();
    });
  });
}

// Ejecutar ambas pruebas
async function runTests() {
  await testWithFetch();
  await testWithHttp();
  
  console.log('\n📋 Diagnóstico:');
  console.log('- Si ambos métodos fallaron, el servidor probablemente no está en ejecución o está en un puerto diferente');
  console.log('- Si un método funcionó y otro no, podría haber problemas de configuración o incompatibilidades');
  console.log('- Si recibiste datos pero no en formato JSON, revisa la implementación del endpoint /health');
}

runTests().catch(console.error);
