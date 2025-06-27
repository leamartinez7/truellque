import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Extraemos el token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded ID:', decoded.id);  // Asegúrate de que decoded.id esté presente
    req.user = await User.findById(decoded.id).select('-password');
    req.userId = decoded.id;  // Asegúrate de que req.userId esté correctamente asignado
    console.log('User ID:', req.userId); // Verifica que req.userId esté presente

    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    next(); // Si todo está correcto, pasamos al siguiente middleware
  } catch (error) {
    console.error('Token error:', error); // Log de error
    res.status(401).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;
