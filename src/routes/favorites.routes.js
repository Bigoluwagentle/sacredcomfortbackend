import { Router } from 'express';
import {
  saveFavorite,
  getMyFavorites,
  updateFavorite,
  deleteFavorite,
  createCollection,
  getMyCollections,
  getCollection,
  addToCollection,
  removeFromCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/favorites.controller.js';
import protect from '../middleware/auth.middleware.js';
import religionFilter from '../middleware/religion.middleware.js';

const router = Router();

router.use(protect);
router.use(religionFilter);

router.post('/', saveFavorite);
router.get('/', getMyFavorites);
router.patch('/:favoriteId', updateFavorite);
router.delete('/:favoriteId', deleteFavorite);

router.post('/collections', createCollection);
router.get('/collections', getMyCollections);
router.get('/collections/:collectionId', getCollection);
router.patch('/collections/:collectionId', updateCollection);
router.delete('/collections/:collectionId', deleteCollection);
router.post('/collections/:collectionId/verses', addToCollection);
router.delete('/collections/:collectionId/verses/:verseId', removeFromCollection);

export default router;