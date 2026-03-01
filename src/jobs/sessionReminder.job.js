import cron from 'node-cron';
import Booking from '../models/mongo/Booking.model.js';
import Notification from '../models/mongo/Notification.model.js';
import User from '../models/mongo/User.model.js';
import { SESSION_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

const sessionReminderJob = cron.schedule('0 * * * *', async () => {
  logger.info('Running session reminder job...');

  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const bookings24h = await Booking.find({
      sessionStatus: SESSION_STATUS.SCHEDULED,
      sessionDate: { $gte: in24Hours, $lte: in25Hours },
      reminderSent24h: false,
    });

    for (const booking of bookings24h) {
      await Notification.create({
        userId: booking.userId,
        type: 'session_reminder_24h',
        title: 'Session Reminder',
        message: 'You have a therapy session scheduled in 24 hours.',
        deliveryChannels: ['in_app'],
        relatedBookingId: booking._id,
        sentAt: new Date(),
      });

      booking.reminderSent24h = true;
      await booking.save();
    }

    const bookings1h = await Booking.find({
      sessionStatus: SESSION_STATUS.SCHEDULED,
      sessionDate: { $gte: in1Hour, $lte: in2Hours },
      reminderSent1h: false,
    });

    for (const booking of bookings1h) {
      await Notification.create({
        userId: booking.userId,
        type: 'session_reminder_1h',
        title: 'Session Starting Soon',
        message: 'Your therapy session starts in 1 hour. Please be ready.',
        deliveryChannels: ['in_app'],
        relatedBookingId: booking._id,
        sentAt: new Date(),
      });

      booking.reminderSent1h = true;
      await booking.save();
    }

    logger.info('Session reminder job completed.');
  } catch (error) {
    logger.error(`Session reminder job error: ${error.message}`);
  }
}, { scheduled: false });

export default sessionReminderJob;