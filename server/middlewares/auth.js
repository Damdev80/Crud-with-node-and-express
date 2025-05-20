// middlewares/auth.js
/**
 * Middleware de autenticación para verificar si el usuario está logueado
 * Verifica si hay un usuario en la sesión/token
 */
export const isAuthenticated = (req, res, next) => {
  // En un sistema real, aquí verificarías el token JWT o la sesión
  // Por ahora, solo verificamos si hay un user_id en el request
  // que probablemente se añadiría después de un login exitoso
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'No autorizado. Debe iniciar sesión.' 
    });
  }
  next();
};

/**
 * Middleware de autorización para verificar si el usuario tiene el rol necesario
 * @param {Array|String} roles - Array de roles permitidos o un solo rol
 */
export const hasRole = (roles) => {
  return (req, res, next) => {
    // Primero verificamos que esté autenticado
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado. Debe iniciar sesión.' 
      });
    }

    // Convertimos roles a array si es un string
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Verificamos si el usuario tiene alguno de los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. No tiene permisos suficientes.' 
      });
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario es admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
  next();
};

/**
 * Middleware para verificar si el usuario es bibliotecario o admin
 */
export const isLibrarianOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'librarian' && req.user.role !== 'admin')) {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado. Se requieren permisos de bibliotecario o administrador.' 
    });
  }
  next();
};

/**
 * Middleware para procesar el usuario desde el token/sesión
 * En un sistema real esto extraería el usuario del token JWT
 */
export const processUser = (req, res, next) => {
  // En un sistema real, decodificarías el token JWT
  // Por ahora, vamos a simular un usuario basado en un encabezado temporal
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'] || 'user';
  
  if (userId) {
    req.user = {
      user_id: userId,
      role: userRole
    };
  }
  
  next();
};
