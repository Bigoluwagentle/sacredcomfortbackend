import { Router } from 'express';
import {
  getMyAnalytics,
  getEmotionalTrends,
  getTopicFrequency,
  getMonthlyUsage,
  getSummaryStats,
} from '../controllers/analytics.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getMyAnalytics);
router.get('/emotions', getEmotionalTrends);
router.get('/topics', getTopicFrequency);
router.get('/usage', getMonthlyUsage);
router.get('/summary', getSummaryStats);

export default router;