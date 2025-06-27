// === controllers/itemController.js ===
import Item from '../models/Item.js';

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('createdBy', 'name _id');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener ítems' });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ createdBy: req.user._id }).populate('createdBy', 'name _id');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tus ítems' });
  }
};

export const getItemById = async (req, res) => {
  try {
    console.log('User ID:', req.user._id); // Verifica si el ID del usuario está siendo asignado correctamente
    const item = await Item.findById(req.params.id).populate('createdBy', 'name _id');

    if (!item) return res.status(404).json({ message: 'Ítem no encontrado' });

    // Asegurémonos de que ambos valores sean cadenas antes de la comparación
    if (req.user._id.toString() !== item.createdBy._id.toString()) {
      console.log('Unauthorized access attempt by user ID:', req.user._id);
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error('Error al obtener el ítem:', err); // Log completo de error
    res.status(500).json({ message: 'Error al obtener ítem' });
  }
};


export const createItem = async (req, res) => {
  try {
    const { title, description, category, uso, price, currency } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = new Item({
      title,
      description,
      category,
      uso,
      price,
      currency,
      image,
      location: req.user.location,
      createdBy: req.user._id,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error al crear ítem:', err);
    res.status(500).json({ message: 'Error al crear ítem' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Ítem no encontrado' });
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    Object.assign(item, req.body);
    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar ítem' });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    await item.deleteOne();
    res.status(200).json({ message: 'Item eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando item' });
  }
};

export const getItemByIdPublic = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'createdBy',
      'name _id'
    );

    if (!item) return res.status(404).json({ message: 'Ítem no encontrado' });

    // ❗️No verificamos que sea el dueño; solo devolvemos el ítem
    res.status(200).json(item);
  } catch (err) {
    console.error('Error al obtener ítem público:', err);
    res.status(500).json({ message: 'Error al obtener ítem' });
  }
};

