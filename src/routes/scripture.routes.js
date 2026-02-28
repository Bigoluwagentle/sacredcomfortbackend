import { Router } from 'express';
import {
  searchScripture,
  searchByTags,
  getDailyVerseHandler,
  getQuranVerse,
  getBibleVerse,
} from '../controllers/scripture.controller.js';
import protect from '../middleware/auth.middleware.js';
import religionFilter from '../middleware/religion.middleware.js';

const router = Router();

router.use(protect);
router.use(religionFilter);

router.get('/search', searchScripture);
router.get('/tags', searchByTags);
router.get('/daily', getDailyVerseHandler);
router.get('/quran/:surah/:ayah', getQuranVerse);
router.get('/bible/:book/:chapter/:verse', getBibleVerse);

export default router;