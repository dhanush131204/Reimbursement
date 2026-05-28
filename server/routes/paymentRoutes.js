import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/razorpay/order', protect, admin, createRazorpayOrder);
router.post('/razorpay/verify', protect, admin, verifyRazorpayPayment);

export default router;
