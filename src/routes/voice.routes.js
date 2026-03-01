import { Router } from 'express';
import {
  getVoiceCallRecords,
  getVoiceCallRecord,
  getVoiceAnalytics,
} from '../controllers/voice.controller.js';
import protect from '../middleware/auth.middleware.js';
import { checkVoiceLimit } from '../middleware/subscription.middleware.js';

const router = Router();

router.use(protect);

router.get('/', checkVoiceLimit, getVoiceCallRecords);
router.get('/analytics', getVoiceAnalytics);
router.get('/:callId', getVoiceCallRecord);

export default router;