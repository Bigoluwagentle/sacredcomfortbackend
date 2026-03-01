import { Router } from 'express';
import {
  initializeSessionPayment,
  initializeSubscriptionPayment,
  verifyPayment,
  getPaymentHistory,
} from '../controllers/payment.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/session/:bookingId', initializeSessionPayment);
router.post('/subscription', initializeSubscriptionPayment);
router.get('/verify/:reference', verifyPayment);
router.get('/history', getPaymentHistory);

export default router;