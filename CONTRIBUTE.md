# Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto de Biblioteca Virtual!

## ¿Cómo contribuir?

1. **Forkea** este repositorio y clona tu fork localmente.
2. Crea una rama descriptiva para tu cambio:
   ```bash
   git checkout -b feature/nombre-del-cambio
   ```
3. Realiza tus cambios y asegúrate de seguir la guía de estilos del proyecto.
4. Haz commit y push a tu fork:
   ```bash
   git add .
   git commit -m "Descripción clara del cambio"
   git push origin feature/nombre-del-cambio
   ```
5. Abre un Pull Request hacia la rama principal (`main`).
6. Describe claramente tu aporte y, si es posible, adjunta capturas o ejemplos.

## Buenas prácticas
- Escribe código limpio y comentado.
- Añade pruebas si tu cambio lo requiere.
- No subas archivos de configuración personal ni credenciales.
- Si tu cambio afecta la UI, intenta mantener la coherencia visual.

## Instalación local
1. Clona el repo:
   ```bash
   git clone https://github.com/tuusuario/Crud-with-node-and-express.git
   cd Crud-with-node-and-express
   ```
2. Instala dependencias:
   ```bash
   npm install
   cd client && npm install
   ```
3. Configura la base de datos MySQL y el archivo `config/db.js`.
4. Inicia el backend:
   ```bash
   npm run dev
   ```
5. Inicia el frontend:
   ```bash
   cd client
   npm run dev
   ```

## Reportar bugs o sugerencias
- Usa la sección de Issues para reportar errores o proponer mejoras.

¡Esperamos tus aportes! 🚀
