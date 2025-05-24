import ModelFactory from '../models/model-factory.js';
import bcrypt from 'bcryptjs';

const User = ModelFactory.User;

// Listar usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al listar usuarios', error: error.message });
  }
};

// Usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuario', error: error.message });
  }
};

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear usuario', error: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const updated = await User.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'No existe usuario para actualizar' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const ok = await User.delete(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: error.message });
  }
};

// Préstamos de un usuario
export const getUserLoans = async (req, res) => {
  try {
    const loans = await User.getLoans(req.params.id);
    res.json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener préstamos', error: error.message });
  }
};

// Registro de usuario seguro
export const registerUser = async (req, res) => {
  try {
    console.log('🚀 [REGISTER] Starting user registration process');
    console.log('🔧 [REGISTER] DB Provider:', process.env.DB_PROVIDER);
    console.log('🔧 [REGISTER] User model type:', User.constructor.name);
    console.log('📝 [REGISTER] Request body:', { ...req.body, password: '[HIDDEN]' });
    
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      console.log('❌ [REGISTER] Missing required fields');
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }
    
    console.log('🔍 [REGISTER] Checking if email exists:', email);
    // Verificar si ya existe el email
    const existing = await User.findByEmail(email);
    if (existing) {
      console.log('❌ [REGISTER] Email already exists');
      return res.status(409).json({ success: false, message: 'El email ya está registrado' });
    }
    console.log('✅ [REGISTER] Email is available');
    
    // Hashear contraseña
    console.log('🔐 [REGISTER] Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ [REGISTER] Password hashed successfully');
    
    // Por defecto, asignar rol 'user' a menos que se especifique otro
    // Solo permitir roles válidos
    let validRole = role;
    if (!['user', 'librarian', 'admin'].includes(role)) {
      validRole = 'user'; // Si no es un rol válido, asignar 'user'
    }
    console.log('👤 [REGISTER] Using role:', validRole);
    
    const userData = { 
      name, 
      email, 
      password: hashedPassword, 
      role: validRole 
    };
    console.log('💾 [REGISTER] About to create user with data:', { ...userData, password: '[HIDDEN]' });    const newUser = await User.create(userData);
    console.log('✅ [REGISTER] User created successfully:', { ...newUser, password: '[HIDDEN]' });
    
    // No exponer password - crear nuevo objeto sin password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('❌ [REGISTER] Registration failed:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      cause: error.cause
    });
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar usuario', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Login seguro
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }    // Validar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    
    // No exponer password - crear nuevo objeto sin password
    const { password: _, ...userWithoutPassword } = user;
    
    // Generar token (en un sistema real usarías JWT)
    // Por ahora, simplemente retornamos la info del usuario con su rol
    res.json({ 
      success: true, 
      data: {
        ...userWithoutPassword,
        // Garantizamos que el rol exista y sea válido
        role: user.role && ['user', 'librarian', 'admin'].includes(user.role) 
          ? user.role 
          : 'user'
      },
      // Si fuera JWT: token: generatedToken
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: error.message });
  }
};
