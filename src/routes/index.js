import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import chatRoutes from './chat.routes.js';
import memoryRoutes from './memory.routes.js';
import prayerRoutes from './prayer.routes.js';
import favoritesRoutes from './favorites.routes.js';

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

export default router;