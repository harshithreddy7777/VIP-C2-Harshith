import express from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../controllers/cartController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken); // Protect all cart routes

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;
