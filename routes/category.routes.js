import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/category.controllers.js';
const router = Router();
router.get('/', getCategories);
router.post('/', createCategory);
export default router;