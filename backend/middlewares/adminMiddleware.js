// === middlewares/adminMiddleware.js ===
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo admin' });
  }
  next();
};

export default adminMiddleware;