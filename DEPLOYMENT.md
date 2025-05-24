# Biblioteca - Sistema de Gestión de Biblioteca

Este proyecto es un sistema completo de gestión de biblioteca con un backend en Node.js/Express y un frontend en React.

## Características

- Gestión completa de libros, autores, editoriales y categorías
- Sistema de préstamo de libros
- Autenticación de usuarios con diferentes roles
- Carga de imágenes de portadas
- Base de datos SQLite/Turso en la nube
- Despliegue en Render (backend) y Vercel (frontend)

## Estructura del proyecto

El proyecto está dividido en dos partes principales:

- `server/`: Backend en Express
- `client/`: Frontend en React/Vite

## Requisitos

- Node.js 18 o superior
- npm 7 o superior
- Cuenta en [Turso](https://turso.tech) (para base de datos)
- Cuenta en [Render](https://render.com) (para desplegar el backend)
- Cuenta en [Vercel](https://vercel.com) (para desplegar el frontend)

## Configuración local

1. Clona el repositorio:
```
git clone https://github.com/usuario/biblioteca.git
cd biblioteca
```

2. Instala las dependencias:
```
npm run install:all
```

3. Configura las variables de entorno:
   - Copia `server/.env.example` a `server/.env`
   - Copia `client/.env.example` a `client/.env`
   - Edita los archivos según tu configuración

4. Configura la base de datos:
   - Para MySQL: Configura tu base de datos local y actualiza `server/.env`
   - Para Turso: Sigue las instrucciones en la sección "Migración a Turso"

5. Inicia el servidor y cliente:
```
npm run start:server
npm run start:client
```

## Migración a Turso

Este proyecto está preparado para ser migrado de MySQL a Turso (SQLite en la nube).

1. Instala la CLI de Turso:
```
npm install -g turso
```

2. Autentícate en Turso:
```
turso auth login
```

3. Crea una base de datos:
```
turso db create biblioteca
```

4. Obtén la URL de la base de datos:
```
turso db show biblioteca --url
```

5. Crea un token de autenticación:
```
turso db tokens create biblioteca
```

6. Actualiza tu archivo `server/.env`:
```
DB_PROVIDER=turso
TURSO_DATABASE_URL=<url-obtenida>
TURSO_AUTH_TOKEN=<token-obtenido>
```

7. Ejecuta la migración:
```
npm run migrate:turso
```

## Despliegue en producción

Para desplegar la aplicación completa en producción (Render y Vercel), puedes utilizar el script de despliegue:

```
npm run deploy
```

Este script te guiará por el proceso de despliegue paso a paso.

### Despliegue manual

#### Backend (Render)

1. Crea un nuevo servicio Web en Render
2. Conecta tu repositorio de GitHub
3. Configura el servicio:
   - Nombre: biblioteca-api
   - Runtime: Node
   - Build Command: npm install
   - Start Command: bash ./run.sh
   - Variables de entorno: Configura según `server/.env.example`
   - Disco persistente: Configura para la carpeta "uploads"

#### Frontend (Vercel)

1. Crea un nuevo proyecto en Vercel
2. Conecta tu repositorio de GitHub
3. Configura el proyecto:
   - Framework: Vite
   - Root Directory: client
   - Variables de entorno: Configura según `client/.env.example`

## Licencia

Este proyecto está bajo la licencia ISC.
