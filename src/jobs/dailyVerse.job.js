import cron from 'node-cron';
import User from '../models/mongo/User.model.js';
import Notification from '../models/mongo/Notification.model.js';
import { getDailyVerse } from '../services/scripture/search.service.js';
import { RELIGIONS } from '../config/constants.js';
import logger from '../utils/logger.js';

const dailyVerseJob = cron.schedule('0 7 * * *', async () => {
  logger.info('Running daily verse job...');

  try {
    const users = await User.find({ isActive: true });

    for (const user of users) {
      const religionFilter = {
        showQuran: user.religiousPreference === RELIGIONS.ISLAM || user.religiousPreference === RELIGIONS.OTHER,
        showBible: user.religiousPreference === RELIGIONS.CHRISTIANITY || user.religiousPreference === RELIGIONS.OTHER,
        showHadith: user.religiousPreference === RELIGIONS.ISLAM,
        showPhilosophy: user.religiousPreference === RELIGIONS.OTHER,
      };

      const verse = await getDailyVerse(religionFilter);
      if (!verse) continue;

      await Notification.create({
        userId: user._id,
        type: 'daily_verse',
        title: 'Your Daily Verse',
        message: `${verse.reference}: "${verse.text.substring(0, 100)}..."`,
        deliveryChannels: ['in_app'],
        sentAt: new Date(),
      });
    }

    logger.info('Daily verse job completed successfully.');
  } catch (error) {
    logger.error(`Daily verse job error: ${error.message}`);
  }
}, { scheduled: false });

export default dailyVerseJob;