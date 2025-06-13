// === routes/trades.js ===
import express from 'express';
import {
  createTrade,
  getTrades,
  getTradeById,
  updateTradeStatus,
  deleteTrade
} from '../controllers/tradeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTrade); // Crear propuesta
router.get('/', authMiddleware, getTrades); // Ver todas las propuestas del usuario
router.get('/:id', authMiddleware, getTradeById); // Ver propuesta específica
router.patch('/:id', authMiddleware, updateTradeStatus); // Aceptar / rechazar
router.delete('/:id', authMiddleware, deleteTrade); // Eliminar propuesta enviada

export default router;
