import express from 'express';
import { getAdminStats, getStoreConfig, updateStoreConfig, getAllUsers } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/config', getStoreConfig); // Public so frontend landing page can read banner
router.get('/stats', verifyToken, isAdmin, getAdminStats);
router.put('/config', verifyToken, isAdmin, updateStoreConfig);
router.get('/users', verifyToken, isAdmin, getAllUsers);

export default router;
