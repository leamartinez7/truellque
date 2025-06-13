import Trade from '../models/Trade.js';
import Item from '../models/Item.js';

// Crear propuesta de intercambio
export const createTrade = async (req, res) => {
  const { itemOffered, itemRequested, toUser } = req.body;
  try {
    // Validar que los items existan y pertenezcan a los usuarios correspondientes
    const offeredItem = await Item.findById(itemOffered);
    const requestedItem = await Item.findById(itemRequested);
    if (!offeredItem || !requestedItem) {
      return res.status(404).json({ message: 'Uno o ambos objetos no existen' });
    }
    if (offeredItem.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No sos dueño del objeto ofrecido' });
    }
    if (requestedItem.createdBy.toString() !== toUser) {
      return res.status(400).json({ message: 'El objeto solicitado no pertenece al usuario destino' });
    }

    const newTrade = new Trade({
      itemOffered,
      itemRequested,
      fromUser: req.user._id,
      toUser,
    });

    const savedTrade = await newTrade.save();
    res.status(201).json(savedTrade);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear propuesta de intercambio' });
  }
};

// Obtener todas las propuestas donde el usuario sea participante
export const getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    })
      .populate('itemOffered')
      .populate('itemRequested')
      .populate('fromUser', 'name')
      .populate('toUser', 'name');
    res.status(200).json(trades);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener propuestas' });
  }
};

// Obtener propuesta por ID (solo si usuario es parte)
export const getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id)
      .populate('itemOffered')
      .populate('itemRequested')
      .populate('fromUser', 'name')
      .populate('toUser', 'name');

    if (!trade) return res.status(404).json({ message: 'Propuesta no encontrada' });

    if (
      trade.fromUser._id.toString() !== req.user._id.toString() &&
      trade.toUser._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'No autorizado para ver esta propuesta' });
    }

    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar propuesta' });
  }
};

// Actualizar estado de propuesta (aceptar/rechazar)
export const updateTradeStatus = async (req, res) => {
  const { status } = req.body; // expected 'accepted' or 'rejected'

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) return res.status(404).json({ message: 'Propuesta no encontrada' });

    if (trade.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para actualizar esta propuesta' });
    }

    trade.status = status;
    await trade.save();

    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

// Eliminar propuesta (solo creador)
export const deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: 'Propuesta no encontrada' });

    if (trade.fromUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta propuesta' });
    }

    await trade.deleteOne();
    res.status(200).json({ message: 'Propuesta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar propuesta' });
  }
};
