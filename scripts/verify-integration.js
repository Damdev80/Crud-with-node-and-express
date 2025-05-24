// scripts/verify-integration.js
import fetch from 'node-fetch';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverEnvPath = path.join(__dirname, '..', 'server', '.env');

// Cargar variables de entorno del servidor
dotenv.config({ path: serverEnvPath });

async function verifyIntegration() {
  console.log('🔍 Verificando integración entre componentes...');
  
  // 1. Verificar conexión con Turso
  try {
    console.log('\n📊 Verificando conexión con Turso...');
    
    const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;
    
    if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
      console.error('❌ No se encontraron las credenciales de Turso en el archivo .env');
      return false;
    }
    
    const client = createClient({
      url: TURSO_DATABASE_URL,
      authToken: TURSO_AUTH_TOKEN
    });
    
    const result = await client.execute('SELECT 1 as test');
    console.log('✅ Conexión exitosa con Turso:', result.rows);
    
    // Verificar tablas existentes
    const tables = await client.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table'
      ORDER BY name
    `);
    
    if (tables.rows.length > 0) {
      console.log('📋 Tablas encontradas en la base de datos:');
      tables.rows.forEach(row => console.log(`   - ${row.name}`));
    } else {
      console.warn('⚠️ No se encontraron tablas en la base de datos. Es posible que necesites ejecutar las migraciones.');
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con Turso:', error.message);
    return false;
  }
  // 2. Verificar API del backend
  try {
    console.log('\n🔌 Verificando API del backend...');
    
    // Determinar la URL del backend usando el puerto del archivo .env del servidor
    const serverPort = process.env.PORT || 3000;
    console.log(`📌 Usando puerto del servidor: ${serverPort}`);
    
    // Usamos un timeout más largo para la solicitud
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos
    
    console.log(`🔄 Intentando conectar a: http://localhost:${serverPort}/health`);
    const backendUrl = process.env.API_URL || `http://localhost:${serverPort}`;
      // Probar endpoint de health con manejo mejorado de errores
    try {
      const healthResponse = await fetch(`${backendUrl}/health`, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);
      
      const contentType = healthResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const healthData = await healthResponse.json();
        
        if (healthResponse.ok) {
          console.log('✅ Endpoint de health responde correctamente:', healthData);
        } else {
          console.error(`❌ Error al acceder al endpoint de health: ${healthResponse.status} ${healthResponse.statusText}`);
          console.error('Respuesta:', healthData);
          return false;
        }
      } else {
        const text = await healthResponse.text();
        console.error(`❌ La respuesta no es JSON. Código: ${healthResponse.status}, Contenido: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        return false;
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(`❌ Error al conectar con el endpoint de health: ${fetchError.message}`);
      console.log('\n🛠️ Sugerencias:');
      console.log(`1. Asegúrate de que el servidor esté en ejecución (npm run debug:server)`);
      console.log(`2. Verifica que el puerto ${serverPort} esté configurado correctamente`);
      console.log('3. Comprueba si hay errores en los logs del servidor');
      return false;
    }
    
    // Probar un endpoint de datos
    try {
      const booksResponse = await fetch(`${backendUrl}/api/books`);
      const booksData = await booksResponse.json();
      
      if (booksResponse.ok) {
        console.log(`✅ API de libros funciona. Total de libros: ${booksData.data?.length || 0}`);
      } else {
        console.warn('⚠️ El endpoint de libros respondió con un error:', booksData);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo acceder al endpoint de libros:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error al verificar el backend:', error.message);
    return false;
  }
  
  // 3. Verificar variables de entorno del frontend
  try {
    console.log('\n🔧 Verificando configuración del frontend...');
    
    const clientEnvPath = path.join(__dirname, '..', 'client', '.env');
    
    if (fs.existsSync(clientEnvPath)) {
      const envContent = fs.readFileSync(clientEnvPath, 'utf8');
      const apiUrl = envContent.match(/VITE_API_URL=(.+)/)?.[1];
      
      if (apiUrl) {
        console.log('✅ Variable VITE_API_URL configurada:', apiUrl);
        
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            console.log('✅ La URL de la API es accesible');
          } else {
            console.warn(`⚠️ La URL de la API (${apiUrl}) no es accesible actualmente`);
          }
        } catch (error) {
          console.warn(`⚠️ No se pudo acceder a la URL de la API (${apiUrl}):`, error.message);
        }
      } else {
        console.warn('⚠️ No se encontró la variable VITE_API_URL en el archivo .env del cliente');
      }
    } else {
      console.warn('⚠️ No se encontró el archivo .env del cliente');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar la configuración del frontend:', error.message);
  }
  
  console.log('\n🏁 Verificación completada!');
  return true;
}

verifyIntegration().catch(error => {
  console.error('Error durante la verificación:', error);
  process.exit(1);
});
