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

router.post('/', authMiddleware, createTrade);
router.get('/', authMiddleware, getTrades);
router.get('/:id', authMiddleware, getTradeById);
router.put('/:id', authMiddleware, updateTradeStatus); 
router.delete('/:id', authMiddleware, deleteTrade);

export default router;
