import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
} from '../controllers/booking.controller.js';
import protect from '../middleware/auth.middleware.js';
import { checkBookingLimit } from '../middleware/subscription.middleware.js';

const router = Router();

router.use(protect);

router.post('/', checkBookingLimit, createBooking);
router.get('/', getMyBookings);
router.get('/:bookingId', getBooking);
router.patch('/:bookingId/cancel', cancelBooking);

export default router;