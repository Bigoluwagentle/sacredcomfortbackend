import Booking from '../models/mongo/Booking.model.js';
import Analytics from '../models/mongo/Analytics.model.js';
import { Therapist, TherapistAvailability } from '../models/postgres/index.js';
import { AppError } from '../middleware/error.middleware.js';
import { encrypt } from '../utils/encryption.js';
import { BOOKING_TYPES, SESSION_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const createBooking = async ({
  userId,
  therapistId,
  sessionDate,
  duration,
  bookingType,
  pseudonym,
  shareConversationHistory,
  conversationSummary,
  urgencyFlag,
}) => {
  const therapist = await Therapist.findOne({
    where: { id: therapistId, isActive: true, isVerified: true },
  });
  if (!therapist) throw new AppError('Therapist not found or unavailable.', 404);

  const encryptedPseudonym =
    bookingType === BOOKING_TYPES.ANONYMOUS && pseudonym
      ? encrypt(pseudonym)
      : null;

  const booking = await Booking.create({
    userId,
    therapistId: String(therapistId),
    sessionDate,
    duration: duration || 60,
    bookingType: bookingType || BOOKING_TYPES.IDENTIFIED,
    pseudonym: encryptedPseudonym,
    sharedConversationSummary: shareConversationHistory || false,
    conversationSummary: shareConversationHistory ? conversationSummary : null,
    urgencyFlag: urgencyFlag || false,
    sessionStatus: SESSION_STATUS.SCHEDULED,
  });

  await updateBookingAnalytics(userId);

  return { booking, therapist };
};

export const getUserBookings = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const bookings = await Booking.find({ userId })
    .sort({ sessionDate: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments({ userId });
  return { bookings, total, page, totalPages: Math.ceil(total / limit) };
};

export const getBooking = async (userId, bookingId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) throw new AppError('Booking not found.', 404);
  return booking;
};

export const cancelBooking = async (userId, bookingId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) throw new AppError('Booking not found.', 404);

  if (booking.sessionStatus === SESSION_STATUS.COMPLETED) {
    throw new AppError('Cannot cancel a completed session.', 400);
  }

  booking.sessionStatus = SESSION_STATUS.CANCELLED;
  await booking.save();
  return booking;
};

const updateBookingAnalytics = async (userId) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const analytics = await Analytics.findOne({ userId });
    if (!analytics) return;

    const monthlyEntry = analytics.monthlyUsage.find(
      (m) => m.month === currentMonth
    );
    if (monthlyEntry) {
      monthlyEntry.therapistBookings += 1;
    } else {
      analytics.monthlyUsage.push({
        month: currentMonth,
        chatConversations: 0,
        voiceCalls: 0,
        therapistBookings: 1,
      });
    }

    await analytics.save();
  } catch (error) {
    logger.error(`Booking analytics update error: ${error.message}`);
  }
};