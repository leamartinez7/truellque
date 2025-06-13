// BACKEND - ESTRUCTURA BASE DEL PROYECTO TRUEQUE 2.0 (ES MODULES)

// === app.js ===
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import tradeRoutes from './routes/trades.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/trades', tradeRoutes);

app.get('/', (req, res) => {
  res.send('API Trueque 2.0 funcionando 🚀');
});

// Conexión DB y servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('Servidor corriendo en puerto', process.env.PORT || 5000);
    });
  })
  .catch(err => console.log('Error DB:', err));
