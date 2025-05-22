
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js'; 

dotenv.config();

const categorias = [
  { name: 'Tecnología' },
  { name: 'Libros' },
  { name: 'Ropa' },
  { name: 'Muebles' },
  { name: 'Juegos' },
  { name: 'Servicios' },
  { name: 'Hogar' },
  { name: 'Deportes' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    for (const cat of categorias) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`Categoría creada: ${cat.name}`);
      } else {
        console.log(`Categoría ya existe: ${cat.name}`);
      }
    }

    console.log('Seed finalizado');
    process.exit();
  } catch (error) {
    console.error('Error al hacer el seed', error);
    process.exit(1);
  }
};

seedCategories();
