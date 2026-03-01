import { Router } from 'express';
import {
  getTherapists,
  getMatchedTherapists,
  getTherapist,
  getTherapistAvailability,
} from '../controllers/therapist.controller.js';
import protect from '../middleware/auth.middleware.js';
import religionFilter from '../middleware/religion.middleware.js';

const router = Router();

router.use(protect);
router.use(religionFilter);

router.get('/', getTherapists);
router.get('/matched', getMatchedTherapists);
router.get('/:therapistId', getTherapist);
router.get('/:therapistId/availability', getTherapistAvailability);

export default router;