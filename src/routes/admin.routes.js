import { Router } from 'express';
import {
  getDashboardOverview,
  getAllUsers,
  deactivateUser,
  getFlaggedConversations,
  getCrisisEvents,
  getAllBookings,
  verifyTherapist,
} from '../controllers/admin.controller.js';
import protect from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get('/overview', getDashboardOverview);
router.get('/users', getAllUsers);
router.patch('/users/:userId/deactivate', deactivateUser);
router.get('/conversations/flagged', getFlaggedConversations);
router.get('/crisis', getCrisisEvents);
router.get('/bookings', getAllBookings);
router.patch('/therapists/:therapistId/verify', verifyTherapist);

export default router;