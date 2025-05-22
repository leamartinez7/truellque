import { Router } from 'express';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  searchItems,
} from '../controllers/item.controllers.js';

const router = Router();

router.get('/', getItems);
router.get('/search', searchItems);
router.get('/:id', getItem);
router.post('/', createItem);     
router.put('/:id', updateItem);   
router.delete('/:id', deleteItem);

export default router;
