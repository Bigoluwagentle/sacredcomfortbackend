import { io } from '../app.js';
import jwt from 'jsonwebtoken';
import User from '../models/mongo/User.model.js';
import { processChat } from '../services/chat.service.js';
import { RELIGIONS } from '../config/constants.js';
import logger from '../utils/logger.js';

const buildReligionFilter = (religiousPreference) => {
  switch (religiousPreference) {
    case RELIGIONS.ISLAM:
      return {
        allowedReligions: ['Islam'],
        showQuran: true,
        showHadith: true,
        showBible: false,
        showPhilosophy: false,
        aiReligionContext: 'Muslim',
        scriptureSource: 'Quran and Hadith only',
        prayerFormat: 'Islamic du\'a format with Arabic',
      };
    case RELIGIONS.CHRISTIANITY:
      return {
        allowedReligions: ['Christianity'],
        showQuran: false,
        showHadith: false,
        showBible: true,
        showPhilosophy: false,
        aiReligionContext: 'Christian',
        scriptureSource: 'Bible only',
        prayerFormat: 'Christian prayer format',
      };
    case RELIGIONS.OTHER:
      return {
        allowedReligions: ['Islam', 'Christianity', 'Other'],
        showQuran: true,
        showHadith: true,
        showBible: true,
        showPhilosophy: true,
        aiReligionContext: 'Spiritual but not religious',
        scriptureSource: 'Quran, Bible, and Philosophy',
        prayerFormat: 'General meditation and reflection format',
      };
    default:
      return {
        allowedReligions: [],
        showQuran: false,
        showHadith: false,
        showBible: false,
        showPhilosophy: false,
        aiReligionContext: 'General',
        scriptureSource: 'None',
        prayerFormat: 'General',
      };
  }
};

const initializeChatSocket = () => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required.'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive.'));
      }

      socket.user = user;
      socket.religionFilter = buildReligionFilter(user.religiousPreference);
      next();
    } catch (error) {
      next(new Error('Invalid token.'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected via socket: ${socket.user.fullName}`);

    socket.join(`user_${socket.user._id}`);

    socket.on('send_message', async (data) => {
      const { message, conversationId } = data;

      if (!message || message.trim() === '') {
        socket.emit('error', { message: 'Message cannot be empty.' });
        return;
      }

      try {
        socket.emit('ai_typing', { isTyping: true });

        const result = await processChat({
          user: socket.user,
          religionFilter: socket.religionFilter,
          message: message.trim(),
          conversationId,
        });

        socket.emit('ai_typing', { isTyping: false });

        socket.emit('receive_message', {
          conversationId: result.conversationId,
          message: result.message,
          emotions: result.emotions,
          topics: result.topics,
          versesShared: result.versesShared,
          persistentIssueDetected: result.persistentIssueDetected,
          therapyRecommendationMade: result.therapyRecommendationMade,
          crisisDetected: result.crisisDetected,
          timestamp: new Date(),
        });

      } catch (error) {
        socket.emit('ai_typing', { isTyping: false });
        socket.emit('error', {
          message: 'AI is temporarily unavailable. Please try again.',
        });
        logger.error(`Socket chat error: ${error.message}`);
      }
    });

    socket.on('user_typing', (data) => {
      socket.emit('user_typing_ack', { isTyping: data.isTyping });
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.fullName}`);
    });
  });

  logger.info('Socket.io chat initialized.');
};

export default initializeChatSocket;