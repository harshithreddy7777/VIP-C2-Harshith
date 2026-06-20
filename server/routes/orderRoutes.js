import express from 'express';
import { createOrder, getUserOrders, cancelOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);
router.put('/:id/cancel', verifyToken, cancelOrder);
router.get('/admin', verifyToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);

export default router;
