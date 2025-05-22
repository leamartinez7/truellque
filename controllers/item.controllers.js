import Item from '../models/Item.js';
import Category from '../models/Category.js';

// Obtener todos los items, con filtros y búsqueda
export const getItems = async (req, res) => {
  try {
    const { category, available, name } = req.query;
    const filter = {};

    if (category) {
      // validar que category exista para evitar errores
      const catExists = await Category.findOne({ name: category });
      if (!catExists) return res.status(400).json({ error: 'Categoría no encontrada' });
      filter.category = category;
    }

    if (available !== undefined) {
      if (available === 'true') filter.available = true;
      else if (available === 'false') filter.available = false;
      else return res.status(400).json({ error: 'available debe ser true o false' });
    }

    if (name) {
      // búsqueda insensible a mayúsculas y minúsculas
      filter.name = { $regex: name, $options: 'i' };
    }

    const items = await Item.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener items' });
  }
};

// Obtener item por ID
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    res.json(item);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
};

// Crear nuevo item con validaciones básicas
export const createItem = async (req, res) => {
  try {
    const { name, description, category, condition, desiredItems, available, price } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'name y category son obligatorios' });
    }

    const cat = await Category.findOne({ name: category });
    if (!cat) return res.status(400).json({ error: 'Categoría inválida' });

    const newItem = new Item({
      name,
      description,
      category: cat._id, 
      condition,
      desiredItems,
      available: available === undefined ? true : available,
      price
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error al crear item:', error); 
    res.status(500).json({ error: 'Error al crear item' });
  }
};


// Actualizar item con validaciones
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, available, price } = req.body;

    if (category) {
      const cat = await Category.findOne({ name: category });
      if (!cat) return res.status(400).json({ error: 'Categoría inválida' });
    }

    const updated = await Item.findByIdAndUpdate(
      id,
      { name, description, category, available, price },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Item no encontrado' });

    res.json(updated);
  } catch {
    res.status(400).json({ error: 'ID inválido o datos incorrectos' });
  }
};

// Eliminar item
export const deleteItem = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item no encontrado' });
    res.json({ message: 'Item eliminado correctamente' });
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
};

// Búsqueda simple por nombre (alternativa)
export const searchItems = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Parametro name requerido' });
    const items = await Item.find({ name: { $regex: name, $options: 'i' } });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Error en búsqueda' });
  }
};
