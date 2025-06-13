import Item from '../models/Item.js';

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('createdBy', 'name location');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo items' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name location');
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo item' });
  }
};

export const createItem = async (req, res) => {
  const { title, description, category, location } = req.body;
  try {
    const newItem = new Item({
      title,
      description,
      category,
      location,
      createdBy: req.userId,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creando item' });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, location } = req.body;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    if (item.createdBy.toString() !== req.userId)
      return res.status(403).json({ message: 'No autorizado' });

    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.location = location || item.location;

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando item' });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    if (item.createdBy.toString() !== req.userId)
      return res.status(403).json({ message: 'No autorizado' });

    await item.remove();
    res.status(200).json({ message: 'Item eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando item' });
  }
};
