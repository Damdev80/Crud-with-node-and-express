# 📚 Sistema de Biblioteca CRUD (Node.js, Express, MySQL, React)

¡Bienvenido al sistema de gestión de biblioteca! Este proyecto es una solución completa para administrar libros, autores, categorías, préstamos, usuarios y editoriales, con un enfoque en la simplicidad, la experiencia de usuario y la modernidad visual.

---

## 🚀 Tecnologías principales

- **Backend:** Node.js, Express, MySQL
- **Frontend:** React (Vite), HTML, CSS (paleta azul pastel, UI moderna y sencilla)

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

## ⚡ Instalación y uso rápido

1. **Clona el repositorio**
2. Instala dependencias en ambos proyectos:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Configura la base de datos MySQL y variables de entorno si es necesario
4. Inicia el backend:
   ```bash
   cd server && npm start
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
