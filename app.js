import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import itemRoutes from './routes/item.routes.js';
import categoryRoutes from './routes/category.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Rutas
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => console.error(err));
