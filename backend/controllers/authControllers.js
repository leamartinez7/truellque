// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password, location } = req.body;

  try {
    // Verificamos si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

    // Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos el usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      location, //  Guardamos la ubicación
      role: 'user', 
    });

    await newUser.save();

    // Generamos token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        location: newUser.location,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
