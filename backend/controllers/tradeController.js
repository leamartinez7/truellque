// === controllers/tradeController.js ===
import Trade from '../models/Trade.js';
import Item from '../models/Item.js';

export const createTrade = async (req, res) => {
  const { itemOffered, itemRequested, toUser } = req.body;
  try {
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

export const getTrades = async (req, res) => {
  try {
    let trades;
    if (req.user.role === 'admin') {
      trades = await Trade.find()
        .populate('itemOffered')
        .populate('itemRequested')
        .populate('fromUser', 'name _id')
        .populate('toUser', 'name _id');
    } else {
      trades = await Trade.find({
        $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
      })
        .populate('itemOffered')
        .populate('itemRequested')
        .populate('fromUser', 'name _id')
        .populate('toUser', 'name _id');
    }

    const renamed = trades.map((t) => ({
      ...t.toObject(),
      sender: t.fromUser,
      receiver: t.toUser,
    }));

    res.status(200).json(renamed);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener propuestas' });
  }
};

export const getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id)
      .populate('itemOffered')
      .populate('itemRequested')
      .populate('fromUser', 'name _id')
      .populate('toUser', 'name _id');

    if (!trade) return res.status(404).json({ message: 'Propuesta no encontrada' });

    if (
      req.user.role !== 'admin' &&
      trade.fromUser._id.toString() !== req.user._id.toString() &&
      trade.toUser._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'No autorizado para ver esta propuesta' });
    }

    const renamed = {
      ...trade.toObject(),
      sender: trade.fromUser,
      receiver: trade.toUser,
    };

    res.status(200).json(renamed);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar propuesta' });
  }
};

export const updateTradeStatus = async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: 'Propuesta no encontrada' });

    if (req.user.role !== 'admin' && trade.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para actualizar esta propuesta' });
    }

    trade.status = status;
    await trade.save();

    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

export const deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: 'Propuesta no encontrada' });

    if (req.user.role !== 'admin' && trade.fromUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta propuesta' });
    }

    await trade.deleteOne();
    res.status(200).json({ message: 'Propuesta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar propuesta' });
  }
};