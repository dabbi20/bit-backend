import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/UsuarioModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

export const verifyToken = async (req, res, next) => {
  try {
    // Obtener el token del header 'Authorization'
    const token = req.headers['x-access-token'] || 
                 req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'No se proporcionó un token de autenticación'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar el usuario en la base de datos
    const usuario = await UsuarioModel.findById(decoded.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Añadir el ID del usuario al objeto request
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error('Error en verifyToken:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'El token ha expirado',
        expiredAt: error.expiredAt
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al autenticar el token',
      error: error.message
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const usuario = await UsuarioModel.findById(req.userId);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el usuario es administrador
    if (usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Se requieren privilegios de administrador para esta acción'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error en isAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar los permisos del usuario',
      error: error.message
    });
  }
};
