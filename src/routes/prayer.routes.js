import { Router } from 'express';
import {
  generatePrayer,
  getMyPrayers,
  getMyPrayer,
  createPrayer,
  updatePrayer,
  deletePrayer,
  markAsPrayed,
} from '../controllers/prayer.controller.js';
import protect from '../middleware/auth.middleware.js';
import religionFilter from '../middleware/religion.middleware.js';

const router = Router();

router.use(protect);
router.use(religionFilter);

router.post('/generate', generatePrayer);
router.get('/', getMyPrayers);
router.post('/', createPrayer);
router.get('/:prayerId', getMyPrayer);
router.patch('/:prayerId', updatePrayer);
router.delete('/:prayerId', deletePrayer);
router.patch('/:prayerId/prayed', markAsPrayed);

export default router;