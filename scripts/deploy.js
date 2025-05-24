// scripts/deploy.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Crear interfaz para leer entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function deploy() {
  try {
    console.log('🚀 Iniciando proceso de despliegue...');
    
    // 1. Configurar Turso
    console.log('\n📦 Preparando Turso...');
    
    // Verificar si ya existe una base de datos en Turso
    const hasTurso = await prompt('¿Ya tienes una base de datos en Turso? (s/n): ');
    
    if (hasTurso.toLowerCase() === 'n') {
      console.log('\nPaso 1: Instala la CLI de Turso');
      console.log('npm install -g turso');
      console.log('\nPaso 2: Inicia sesión en Turso');
      console.log('turso auth login');
      console.log('\nPaso 3: Crea una base de datos');
      console.log('turso db create biblioteca');
      
      const proceed = await prompt('\n¿Has completado estos pasos? (s/n): ');
      if (proceed.toLowerCase() !== 's') {
        console.log('Por favor completa los pasos antes de continuar.');
        rl.close();
        return;
      }
    }
    
    // Obtener detalles de la base de datos
    const dbUrl = await prompt('URL de la base de datos Turso (obtenida con "turso db show biblioteca --url"): ');
    const authToken = await prompt('Token de autenticación (obtenido con "turso db tokens create biblioteca"): ');
    
    // Crear archivo .env para el servidor
    console.log('\n📝 Creando archivos de entorno...');
    
    const serverEnv = `# Server Configuration
PORT=3000
NODE_ENV=production
DB_PROVIDER=turso

# Turso Database Configuration
TURSO_DATABASE_URL=${dbUrl}
TURSO_AUTH_TOKEN=${authToken}

# JWT Secret
JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}

# Migration key
MIGRATION_SECRET_KEY=${Math.random().toString(36).substring(2, 15)}

# Upload Directory
UPLOAD_DIR=uploads

# CORS Configuration
ALLOWED_ORIGINS=https://biblioteca-client.vercel.app,https://biblioteca.yourdomain.com
`;
    
    fs.writeFileSync(path.join(rootDir, 'server', '.env'), serverEnv);
    console.log('✅ Archivo .env del servidor creado');
    
    // Crear .env para el cliente
    const clientEnv = `# API URL for production
VITE_API_URL=https://biblioteca-api.onrender.com
VITE_NODE_ENV=production
`;
    
    fs.writeFileSync(path.join(rootDir, 'client', '.env'), clientEnv);
    console.log('✅ Archivo .env del cliente creado');
    
    // 2. Instalar dependencias
    console.log('\n📦 Instalando dependencias...');
    
    console.log('Instalando dependencias del servidor...');
    execSync('npm install', { cwd: path.join(rootDir, 'server'), stdio: 'inherit' });
    
    console.log('Instalando dependencias del cliente...');
    execSync('npm install', { cwd: path.join(rootDir, 'client'), stdio: 'inherit' });
    
    // 3. Probar la migración
    console.log('\n🔄 Probando migración de base de datos...');
    try {
      execSync('npm run migrate:turso', { cwd: path.join(rootDir, 'server'), stdio: 'inherit' });
      console.log('✅ Migración completada con éxito');
    } catch (error) {
      console.error('❌ Error en la migración:', error.message);
      const skipMigration = await prompt('¿Deseas continuar de todos modos? (s/n): ');
      if (skipMigration.toLowerCase() !== 's') {
        console.log('Proceso de despliegue abortado.');
        rl.close();
        return;
      }
    }
    
    // 4. Instrucciones para despliegue
    console.log('\n🚀 Instrucciones para despliegue:');
    
    console.log('\nPaso 1: Sube el servidor a Render');
    console.log('- Ve a https://render.com y crea una cuenta o inicia sesión');
    console.log('- Crea un nuevo servicio Web');
    console.log('- Conecta tu repositorio de GitHub');
    console.log('- Configura el servicio:');
    console.log('  * Nombre: biblioteca-api');
    console.log('  * Runtime: Node');
    console.log('  * Build Command: npm install');
    console.log('  * Start Command: bash ./run.sh');
    console.log('  * Selecciona el plan que prefieras');
    console.log('- Añade las variables de entorno del archivo .env');
    console.log('- Crea un disco persistente para "uploads" de al menos 1GB');
    
    console.log('\nPaso 2: Sube el cliente a Vercel');
    console.log('- Ve a https://vercel.com y crea una cuenta o inicia sesión');
    console.log('- Crea un nuevo proyecto');
    console.log('- Conecta tu repositorio de GitHub');
    console.log('- Configura el proyecto:');
    console.log('  * Framework: Vite');
    console.log('  * Root Directory: client');
    console.log('  * Build Command: npm run build');
    console.log('  * Output Directory: dist');
    console.log('- Añade las variables de entorno del archivo client/.env');
    
    console.log('\nUna vez desplegado, tu aplicación estará disponible en:');
    console.log('- API: https://biblioteca-api.onrender.com');
    console.log('- Cliente: https://biblioteca-client.vercel.app');
    
    console.log('\n🎉 ¡Preparación para despliegue completada!');
    
    rl.close();
  } catch (error) {
    console.error('Error en el proceso de despliegue:', error);
    rl.close();
    process.exit(1);
  }
}

deploy();
