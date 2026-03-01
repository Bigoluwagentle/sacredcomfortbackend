import cron from 'node-cron';
import User from '../models/mongo/User.model.js';
import Notification from '../models/mongo/Notification.model.js';
import logger from '../utils/logger.js';

const subscriptionRenewalJob = cron.schedule('0 0 * * *', async () => {
  logger.info('Running subscription renewal job...');

  try {

    const premiumUsers = await User.find({ subscriptionTier: 'Premium' });

    logger.info(`Checked ${premiumUsers.length} premium subscriptions.`);

  } catch (error) {
    logger.error(`Subscription renewal job error: ${error.message}`);
  }
}, { scheduled: false });

export default subscriptionRenewalJob;