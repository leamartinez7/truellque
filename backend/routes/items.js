// routes/items.js
import express from 'express';
import {
  getAllItems,
  getItemById,
  getItemByIdPublic,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
} from '../controllers/itemController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllItems);
router.get('/mine', authMiddleware, getMyItems);
router.get('/public/:id', authMiddleware, getItemByIdPublic); 
router.get('/:id', authMiddleware, getItemById);
router.post('/', authMiddleware, upload.single('image'), createItem);
router.put('/:id', authMiddleware, updateItem);
router.delete('/:id', authMiddleware, deleteItem);

export default router;
