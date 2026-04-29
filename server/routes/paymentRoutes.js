import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/razorpay/config', protect, getRazorpayKey);
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

export default router;
