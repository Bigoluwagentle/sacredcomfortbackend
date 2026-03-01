import cron from 'node-cron';
import { sendDailyVerseToAllUsers } from '../services/scripture/dailyVerse.service.js';
import logger from '../utils/logger.js';

const dailyVerseJob = cron.schedule('0 7 * * *', async () => {
  logger.info('Running daily verse job...');
  try {
    const count = await sendDailyVerseToAllUsers();
    logger.info(`Daily verse job completed. Sent to ${count} users.`);
  } catch (error) {
    logger.error(`Daily verse job error: ${error.message}`);
  }
}, { scheduled: false });

export default dailyVerseJob;