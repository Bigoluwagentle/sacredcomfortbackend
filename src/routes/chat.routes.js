import { Router } from 'express';
import {
  sendMessage,
  getConversations,
  getConversation,
  archiveConversation,
} from '../controllers/chat.controller.js';
import protect from '../middleware/auth.middleware.js';
import religionFilter from '../middleware/religion.middleware.js';
import { checkChatLimit } from '../middleware/subscription.middleware.js';

const router = Router();

router.use(protect);
router.use(religionFilter);

router.post('/', checkChatLimit, sendMessage);
router.get('/', getConversations);
router.get('/:conversationId', getConversation);
router.patch('/:conversationId/archive', archiveConversation);

export default router;