# 📚 Sistema de Biblioteca CRUD (Node.js, Express, Turso/MySQL, React)

¡Bienvenido al sistema de gestión de biblioteca! Este proyecto es una solución completa para administrar libros, autores, categorías, préstamos, usuarios y editoriales, con un enfoque en la simplicidad, la experiencia de usuario y la modernidad visual.

---

## 🚀 Tecnologías principales

- **Backend:** Node.js, Express, Turso/MySQL
- **Frontend:** React (Vite), HTML, CSS (paleta azul pastel, UI moderna y sencilla)
- **Despliegue:** Render (backend), Vercel (frontend)

---

## 🏗️ Estructura del Proyecto

```
├── server/           # Backend (API REST)
├── client/           # Frontend (React)
├── uploads/          # Imágenes de libros
├── editorials.json   # Datos de ejemplo de editoriales
├── package.json      # Configuración general
```

---

## ✨ Funcionalidades principales

### 📖 Libros
- CRUD completo: crear, leer, actualizar y eliminar libros
- Subida de imágenes de portada
- Relación con autores, categorías y editoriales
- Búsqueda y filtrado avanzado

### 👤 Autores
- CRUD de autores
- Relación con libros

### 🏷️ Categorías
- CRUD de categorías
- Relación con libros

### 🏢 Editoriales
- CRUD de editoriales
- Interfaz moderna, sin componentes personalizados complejos
- Visualización en cards, búsqueda, ordenamiento y formulario modal
- Paleta azul pastel y botón de regreso

### 👥 Usuarios
- Registro y login
- Gestión de usuarios

### 📚 Préstamos
- Registro y gestión de préstamos de libros
- Relación con usuarios y libros

---

## 🖥️ Frontend (React)

- SPA con React y Vite
- Estilos modernos, limpios y pastel (azul)
- Sin dependencias de componentes custom complejos
- CRUD visual para todas las entidades
- Dashboard de editoriales simple y visualmente atractivo
- Botón de regreso en dashboards
- Formularios claros y validaciones amigables

### Estructura relevante
- `src/pages/` → Vistas principales (Dashboard, Editoriales, Libros, etc.)
- `src/components/` → Componentes reutilizables (algunos eliminados para simplificar UI)
- `src/services/` → Lógica de conexión con la API

---

## 🛠️ Backend (Node.js + Express)

- API RESTful organizada por recursos
- Controladores para cada entidad (`controllers/`)
- Modelos de datos (`models/`)
- Rutas separadas por recurso (`routes/`)
- Validaciones y middlewares
- Conexión a MySQL
- Subida de imágenes para libros

### Endpoints principales
- `/api/books`        → Libros
- `/api/authors`      → Autores
- `/api/categories`   → Categorías
- `/api/editorials`   → Editoriales
- `/api/loans`        → Préstamos
- `/api/users`        → Usuarios

---

## 🚀 Despliegue en producción

El sistema está preparado para ser desplegado en producción utilizando:

- **Base de datos:** [Turso](https://turso.tech) (SQLite en la nube, reemplazando MySQL)
- **Backend:** [Render](https://render.com)
- **Frontend:** [Vercel](https://vercel.com)

### Guía rápida de despliegue

1. **Preparación**:
   ```bash
   # Desde la raíz del proyecto
   npm install
   ```

2. **Configuración de Turso**:
   ```bash
   # Instalar CLI y preparar base de datos
   npm install -g turso
   turso auth login
   turso db create biblioteca
   turso db show biblioteca --url
   turso db tokens create biblioteca
   ```
   
3. **Configura los archivos `.env`**:
   - Copia `server/.env.example` a `server/.env`
   - Copia `client/.env.example` a `client/.env`
   - Actualiza con tus credenciales de Turso

4. **Despliegue del backend en Render**:
   - Conecta tu repositorio en Render
   - Usa la configuración del archivo `render.yaml` o consulta el [README del servidor](./server/README.md)

5. **Despliegue del frontend en Vercel**:
   - Conecta tu repositorio en Vercel
   - Configura el directorio raíz como `client`
   - Establece la variable `VITE_API_URL` con la URL de tu backend

Consulta [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas.

---

## ⚡ Instalación y uso local

1. **Clona el repositorio**
2. Instala dependencias:
   ```bash
   npm run install:all
   ```
3. Configura la base de datos:
   - **Para MySQL**: Importa el esquema SQL a tu servidor local
   - **Para Turso**: Configura según las instrucciones de despliegue
   - Actualiza las variables en `server/.env`

4. Inicia el servidor:
   ```bash
   npm run start:server
   ```
   
5. Inicia el cliente:
   ```bash
   npm run start:client
   ```
   
6. Abre http://localhost:5173 en tu navegador
   ```
5. Inicia el frontend:
   ```bash
   cd client && npm run dev
   ```
6. Accede a la app en [http://localhost:5173](http://localhost:5173)

---

## 🎨 Paleta de colores
- Azul pastel: `#e3f0fb`, `#2366a8`, `#b6d4f5`
- Blanco, gris claro y detalles en rojo para errores

---

## 👨‍💻 Créditos y contribución

- Proyecto realizado por [Daniel Buelvas]
- ¡Contribuciones y sugerencias son bienvenidas!

---

## 📝 Notas
- El dashboard de editoriales fue modernizado y simplificado para máxima compatibilidad y visualización inmediata.
- Se eliminaron componentes personalizados y se priorizó la experiencia de usuario sencilla.
- El backend está listo para producción, pero puedes adaptarlo a tus necesidades.

---

¡Gracias por usar este sistema de biblioteca! Si tienes dudas o sugerencias, abre un issue o contacta al autor.
