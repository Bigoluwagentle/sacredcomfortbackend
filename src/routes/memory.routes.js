import { Router } from 'express';
import {
  getMyMemory,
  deleteMemoryEntry,
  clearAllMemory,
} from '../controllers/memory.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getMyMemory);
router.delete('/', clearAllMemory);
router.delete('/:memoryType/:index', deleteMemoryEntry);

export default router;