import express from 'express';
import {
  createTrade,
  getTrades,
  getTradeById,
  updateTradeStatus,
  deleteTrade,
} from '../controllers/tradeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); // todas rutas protegidas

router.post('/', createTrade);
router.get('/', getTrades);
router.get('/:id', getTradeById);
router.put('/:id', updateTradeStatus);
router.delete('/:id', deleteTrade);

export default router;
