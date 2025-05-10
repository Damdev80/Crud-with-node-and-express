# Biblioteca Virtual CRUD

Este proyecto es una aplicación completa de gestión de libros (CRUD) desarrollada con Node.js, Express, MySQL y React. Permite administrar un catálogo de libros con animaciones modernas, edición avanzada y una experiencia visual atractiva.

## Características principales
- **Catálogo de libros** con tarjetas animadas y visualmente atractivas.
- **CRUD completo**: crear, leer, actualizar y eliminar libros.
- **Formulario de edición** con validaciones, carga de imágenes y campos de autor/categoría editables como texto.
- **Animaciones modernas** en dashboard, catálogo y formularios.
- **Estadísticas** de libros, autores y categorías.
- **Búsqueda y filtrado** en tiempo real.
- **Carga y edición de portadas** de libros.
- **Newsletter** y footer con diseño profesional.

## Tecnologías utilizadas
- **Backend:** Node.js, Express, MySQL
- **Frontend:** React, Vite, TailwindCSS, React Icons

## Instalación y uso

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/Crud-with-node-and-express.git
   cd Crud-with-node-and-express
   ```
2. **Instala dependencias:**
   ```bash
   npm install
   cd client && npm install
   ```
3. **Configura la base de datos:**
   - Crea una base de datos MySQL y ajusta `server/config/db.js` con tus credenciales.
   - Ejecuta los scripts de migración si es necesario.
4. **Inicia el backend:**
   ```bash
   npm run dev
   ```
5. **Inicia el frontend:**
   ```bash
   cd client
   npm run dev
   ```
6. **Accede a la app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000/api](http://localhost:3000/api)

## Arquitectura del Proyecto

Este proyecto sigue una arquitectura de **aplicación web fullstack** dividida en dos grandes bloques:

### 1. Backend (API REST - Node.js/Express)
- **Estructura MVC**: Separación clara entre Modelos, Controladores y Rutas.
- **Modelos**: Definen la lógica de acceso a datos y operaciones sobre la base de datos MySQL (`server/models/`).
- **Controladores**: Gestionan la lógica de negocio y validaciones para cada recurso (`server/controllers/`).
- **Rutas**: Definen los endpoints de la API REST para libros, autores, categorías, préstamos y usuarios (`server/routes/`).
- **Middlewares**: Para manejo de archivos (subida de portadas), validaciones y otros (`server/middlewares/`).
- **Base de datos**: MySQL, con tablas para libros, autores, categorías, usuarios y préstamos.
- **Validaciones**: Validación de datos en el backend y manejo de errores robusto.

### 2. Frontend (React + Vite)
- **Componentes reutilizables**: Cards, formularios, listas, modales y footer (`client/src/components/`).
- **Páginas**: Dashboard, catálogo, edición/agregado de libros, home (`client/src/pages/`).
- **Servicios**: Abstracción de llamadas a la API (`client/src/services/`).
- **Estilos**: TailwindCSS y animaciones personalizadas (`client/styles/`).
- **Gestión de estado**: React hooks (`useState`, `useEffect`).
- **Validaciones**: Validación de formularios en frontend y feedback visual.
- **Carga de imágenes**: Soporte para previsualización y subida de portadas.

### Comunicación
- El frontend se comunica con el backend vía **API REST** (fetch/AJAX) para todas las operaciones CRUD.
- Las imágenes se almacenan en la carpeta `/uploads` y se sirven desde el backend.

### Seguridad y buenas prácticas
- Separación de credenciales y configuración en archivos dedicados (`config/db.js`).
- Sanitización y validación de datos tanto en frontend como en backend.
- Estructura escalable y fácil de mantener.

## Estructura del proyecto
- `/server`: Código backend (Express, modelos, controladores, rutas)
- `/client`: Código frontend (React, componentes, páginas, estilos)
- `/uploads`: Imágenes de portadas de libros

## Contribuir
Lee la guía en [CONTRIBUTE.md](./CONTRIBUTE.md) para saber cómo puedes aportar.

## Licencia
MIT

---

**Desarrollado por y para amantes de la lectura.**
