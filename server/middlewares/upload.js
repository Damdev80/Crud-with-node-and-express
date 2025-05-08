import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ruta donde guardar las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada imagen
  }
});

const upload = multer({ storage: storage });

export default upload;
