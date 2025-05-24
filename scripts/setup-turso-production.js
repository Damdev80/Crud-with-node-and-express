// scripts/setup-turso-production.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const serverDir = path.join(rootDir, 'server');

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

async function setupTursoProduction() {
  console.log('🚀 Configurando Turso para producción...');
  
  try {
    // Verificar si Turso está instalado
    try {
      execSync('turso --version', { stdio: 'pipe' });
      console.log('✅ Turso CLI está instalado');
    } catch (error) {
      console.log('⚠️ Turso CLI no está instalado. Instalando...');
      execSync('npm install -g turso', { stdio: 'inherit' });
      console.log('✅ Turso CLI instalado correctamente');
    }
    
    // Verificar si el usuario está autenticado
    try {
      execSync('turso auth status', { stdio: 'pipe' });
      console.log('✅ Usuario autenticado en Turso');
    } catch (error) {
      console.log('⚠️ Necesitas autenticarte en Turso');
      console.log('Ejecuta el siguiente comando en una nueva terminal:');
      console.log('turso auth login');
      
      const authenticated = await prompt('¿Te has autenticado? (s/n): ');
      if (authenticated.toLowerCase() !== 's') {
        console.log('Por favor, autentícate antes de continuar.');
        rl.close();
        return;
      }
    }
    
    // Crear base de datos de producción
    console.log('\n📦 Creando base de datos de producción...');
    
    const dbName = await prompt('Nombre de la base de datos (default: biblioteca-production): ') || 'biblioteca-production';
    
    // Verificar si la base de datos ya existe
    let dbExists = false;
    try {
      const output = execSync('turso db list', { encoding: 'utf8' });
      dbExists = output.includes(dbName);
    } catch (error) {
      // Ignorar errores y asumir que la base de datos no existe
    }
    
    if (dbExists) {
      console.log(`⚠️ La base de datos "${dbName}" ya existe`);
      const useExisting = await prompt('¿Quieres usar esta base de datos existente? (s/n): ');
      
      if (useExisting.toLowerCase() !== 's') {
        console.log('Operación cancelada.');
        rl.close();
        return;
      }
    } else {
      try {
        console.log(`Creando base de datos "${dbName}"...`);
        execSync(`turso db create ${dbName}`, { stdio: 'inherit' });
        console.log(`✅ Base de datos "${dbName}" creada correctamente`);
      } catch (error) {
        console.error('❌ Error al crear la base de datos:', error.message);
        rl.close();
        return;
      }
    }
    
    // Obtener la URL de la base de datos
    console.log('\n🔗 Obteniendo URL de la base de datos...');
    const dbUrl = execSync(`turso db show ${dbName} --url`, { encoding: 'utf8' }).trim();
    console.log(`✅ URL obtenida: ${dbUrl}`);
    
    // Crear token de autenticación
    console.log('\n🔑 Generando token de autenticación...');
    const authToken = execSync(`turso db tokens create ${dbName}`, { encoding: 'utf8' }).trim();
    console.log('✅ Token generado correctamente');
    
    // Crear o actualizar el archivo .env para producción
    const envPath = path.join(serverDir, '.env.production');
    const envContent = `# Production Environment Configuration
PORT=10000
NODE_ENV=production
DB_PROVIDER=turso

# Turso Database Configuration
TURSO_DATABASE_URL=${dbUrl}
TURSO_AUTH_TOKEN=${authToken}

# JWT Secret
JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}

# Migration key - used to protect the migration endpoint
MIGRATION_SECRET_KEY=${Math.random().toString(36).substring(2, 15)}

# Upload Directory
UPLOAD_DIR=uploads

# CORS Configuration
ALLOWED_ORIGINS=https://biblioteca-client.vercel.app,https://your-custom-domain.com
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅ Archivo de configuración creado en: ${envPath}`);
    
    // Preguntar si ejecutar migraciones
    const runMigrations = await prompt('¿Quieres ejecutar las migraciones ahora? (s/n): ');
    
    if (runMigrations.toLowerCase() === 's') {
      console.log('\n🔄 Ejecutando migraciones...');
      
      // Copiar temporalmente el archivo .env.production a .env para las migraciones
      const originalEnv = fs.existsSync(path.join(serverDir, '.env')) 
        ? fs.readFileSync(path.join(serverDir, '.env'), 'utf8') 
        : null;
      
      fs.copyFileSync(envPath, path.join(serverDir, '.env'));
      
      try {
        execSync('npm run migrate:turso', { cwd: rootDir, stdio: 'inherit' });
        console.log('✅ Migraciones ejecutadas correctamente');
      } catch (error) {
        console.error('❌ Error al ejecutar las migraciones:', error.message);
      }
      
      // Restaurar el archivo .env original si existía
      if (originalEnv !== null) {
        fs.writeFileSync(path.join(serverDir, '.env'), originalEnv);
      } else {
        fs.unlinkSync(path.join(serverDir, '.env'));
      }
    }
    
    console.log('\n🎉 Configuración de Turso para producción completada!');
    console.log('\nImportante:');
    console.log('1. Guarda estas credenciales de forma segura');
    console.log('2. Configura estas variables en tu servicio de Render');
    console.log('3. No compartas el token de autenticación');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
  } finally {
    rl.close();
  }
}

setupTursoProduction().catch(console.error);
