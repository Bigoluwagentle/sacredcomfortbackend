import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import chatRoutes from './chat.routes.js';

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

export default router;