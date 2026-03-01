import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import chatRoutes from './chat.routes.js';
import memoryRoutes from './memory.routes.js';
import prayerRoutes from './prayer.routes.js';
import favoritesRoutes from './favorites.routes.js';
import scriptureRoutes from './scripture.routes.js';
import analyticsRoutes from './analytics.routes.js';
import therapistRoutes from './therapist.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Sacred Comfort API v1',
    version: '1.0.0',
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chat', chatRoutes);
router.use('/memory', memoryRoutes);
router.use('/prayers', prayerRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/scripture', scriptureRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/therapists', therapistRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;