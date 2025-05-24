# Guía de Despliegue: Biblioteca

Esta guía detalla cómo desplegar la aplicación de gestión de biblioteca en producción utilizando Turso, Render y Vercel.

## Verificación pre-despliegue

Antes de proceder con el despliegue, verifica que todos los componentes pueden comunicarse correctamente:

```bash
npm run verify
```

Esta herramienta comprobará:
- La conexión con la base de datos Turso
- La comunicación con el backend
- La configuración del frontend

## Proceso de despliegue

### 1. Configuración de la Base de Datos Turso

1. **Crear una base de datos de producción**:
   ```bash
   turso db create biblioteca-production
   ```

2. **Obtener la URL y el token**:
   ```bash
   turso db show biblioteca-production --url
   turso db tokens create biblioteca-production
   ```

3. **Guardar las credenciales** para usar en la configuración del backend.

### 2. Despliegue del Backend en Render

1. **Desde el dashboard de Render**, selecciona "New" → "Blueprint".

2. **Conecta tu repositorio de GitHub** que contiene el código.

3. **Render detectará el archivo `render.yaml`** con la configuración predefinida.

4. **Configura las variables de entorno**:
   - `TURSO_DATABASE_URL`: URL de tu base de datos Turso
   - `TURSO_AUTH_TOKEN`: Token de autenticación de Turso
   - `JWT_SECRET`: Clave secreta para tokens JWT
   - `ALLOWED_ORIGINS`: Dominios permitidos para CORS

5. **Despliegue**:
   - Render ejecutará automáticamente el comando de inicio en `run.sh`
   - Este script ejecuta las migraciones e inicia el servidor

6. **Verificación**:
   - Una vez desplegado, visita `https://tu-api.onrender.com/health`
   - Deberías ver un mensaje de estado indicando que el servidor está funcionando

### 3. Despliegue del Frontend en Vercel

1. **Desde el dashboard de Vercel**, selecciona "Import Project".

2. **Conecta tu repositorio de GitHub** que contiene el código.

3. **Configura el proyecto**:
   - Framework: Vite
   - Root Directory: client
   - Build Command: npm run build (ya definido en el `vercel.json`)
   - Output Directory: dist (ya definido en el `vercel.json`)

4. **Configura las variables de entorno**:
   - `VITE_API_URL`: URL del backend desplegado en Render
   - `VITE_NODE_ENV`: production

5. **Despliegue**:
   - Vercel desplegará automáticamente la aplicación
   - Las redirecciones a la API se configuran mediante el archivo `vercel.json`

6. **Verificación**:
   - Accede a tu aplicación usando el dominio proporcionado por Vercel
   - Intenta iniciar sesión y realizar operaciones básicas

## Solución de problemas comunes

### Problemas de CORS

Si encuentras errores de CORS después del despliegue:

1. Verifica la variable `ALLOWED_ORIGINS` en la configuración de Render
2. Asegúrate de que incluye exactamente el dominio de tu frontend en Vercel
3. No uses barras diagonales finales en las URLs

### Problemas con las imágenes

Si las imágenes de portadas no se muestran correctamente:

1. Verifica que el disco persistente está configurado en Render
2. Comprueba que los permisos de la carpeta `uploads` son correctos
3. Asegúrate de que las URLs de imágenes incluyen el dominio del backend

### Problemas de conexión con Turso

Si hay problemas de conexión con la base de datos:

1. Verifica que las credenciales son correctas
2. Asegúrate de que el token tiene permisos de lectura/escritura
3. Intenta recrear el token si es necesario

## Mantenimiento

### Ejecutar migraciones después del despliegue

Si necesitas aplicar nuevas migraciones después del despliegue:

1. Accede a `https://tu-api.onrender.com/api/migrations/run` con el secreto configurado
2. Alternativamente, usa el panel de Render para reiniciar el servicio

### Monitoreo de la aplicación

- Utiliza el panel de Render para ver los logs del backend
- Configura alertas para errores y tiempo de inactividad
