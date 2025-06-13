
// === routes/items.js ===
import express from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', authMiddleware, createItem);
router.put('/:id', authMiddleware, updateItem);
router.delete('/:id', authMiddleware, deleteItem);

export default router;
