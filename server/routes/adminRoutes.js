import express from 'express';
import { getDashboardStats, seedAdmin } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Seed admin user (public, only creates if not exists)
router.post('/seed', seedAdmin);

// Dashboard stats
router.get('/stats', protect, admin, getDashboardStats);

export default router;
