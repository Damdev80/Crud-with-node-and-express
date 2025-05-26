import multer from 'multer';
import path from 'path';
import imageStorage from '../utils/imageStorage.js';

// Configuración de almacenamiento de las imágenes con gestión mejorada
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = imageStorage.getUploadPath();
    console.log(`📁 Saving file to: ${uploadPath}`);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único con timestamp y extensión original
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log(`📝 Generated filename: ${uniqueName}`);
    cb(null, uniqueName);
  }
});

// Configuración de multer con validaciones
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
    }
  }
});

export default upload;
