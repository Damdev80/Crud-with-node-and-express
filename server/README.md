# Despliegue del Servidor en Render

Este documento contiene instrucciones para desplegar el servidor de la biblioteca en Render.

## Configuración en Render

1. Crea una cuenta en [Render](https://render.com) si aún no la tienes.
2. Crea un nuevo servicio web.
3. Conecta tu repositorio de GitHub.
4. Configura el servicio con los siguientes parámetros:

- **Nombre**: biblioteca-api
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Starter (o el que prefieras)

## Variables de Entorno

Configura las siguientes variables de entorno en Render:

```
NODE_ENV=production
PORT=10000
DB_PROVIDER=turso
TURSO_DATABASE_URL=libsql://tu-database.turso.io
TURSO_AUTH_TOKEN=tu-auth-token
JWT_SECRET=tu-secret-jwt
MIGRATION_SECRET_KEY=tu-migration-key
UPLOAD_DIR=uploads
ALLOWED_ORIGINS=https://biblioteca-client.vercel.app,https://tudominio.com
```

## Almacenamiento Persistente

Para permitir la carga de imágenes, configura un disco persistente:

1. En la configuración del servicio, ve a la sección "Disks"
2. Crea un nuevo disco:
   - **Nombre**: uploads
   - **Ruta de montaje**: /opt/render/project/src/uploads
   - **Tamaño**: 1 GB (o lo que necesites)

## Migración de la Base de Datos

### Opción 1: Desde el Panel de Render

Una vez desplegado el servidor, ejecuta la migración:

1. Ve a la pestaña "Shell" de tu servicio en Render.
2. Ejecuta: `npm run migrate:turso`

### Opción 2: Usando el Endpoint de Migración

También puedes usar el endpoint de migración:

```
curl -X POST https://tu-api.onrender.com/api/migrations/run \
  -H "Content-Type: application/json" \
  -H "x-migration-key: tu-migration-key"
```

## Verificación

Una vez desplegado, verifica que el servicio esté funcionando:

1. Visita el endpoint de salud: `https://tu-api.onrender.com/health`
2. Deberías recibir un JSON: `{"status":"UP","timestamp":"..."}`

## Despliegue Automático

Render configurará automáticamente los despliegues continuos cuando hagas push a la rama principal de tu repositorio.
