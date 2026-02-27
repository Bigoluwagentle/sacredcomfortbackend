import { SUBSCRIPTION_TIERS, FREE_TIER_LIMITS } from '../config/constants.js';
import Analytics from '../models/mongo/Analytics.model.js';
import { AppError } from '../middleware/error.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

export const checkChatLimit = asyncHandler(async (req, res, next) => {
  if (req.user.subscriptionTier === SUBSCRIPTION_TIERS.PREMIUM) return next();

  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., '2026-02'
  const analytics = await Analytics.findOne({ userId: req.user._id });

  if (!analytics) return next();

  const monthlyUsage = analytics.monthlyUsage.find((m) => m.month === currentMonth);
  const chatCount = monthlyUsage ? monthlyUsage.chatConversations : 0;

  if (chatCount >= FREE_TIER_LIMITS.CHAT_CONVERSATIONS_PER_MONTH) {
    return next(new AppError(
      `You have reached your free tier limit of ${FREE_TIER_LIMITS.CHAT_CONVERSATIONS_PER_MONTH} conversations per month. Please upgrade to Premium for unlimited access.`,
      403
    ));
  }

  next();
});

export const checkVoiceLimit = asyncHandler(async (req, res, next) => {
  if (req.user.subscriptionTier === SUBSCRIPTION_TIERS.PREMIUM) return next();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const analytics = await Analytics.findOne({ userId: req.user._id });

  if (!analytics) return next();

  const monthlyUsage = analytics.monthlyUsage.find((m) => m.month === currentMonth);
  const voiceCount = monthlyUsage ? monthlyUsage.voiceCalls : 0;

  if (voiceCount >= FREE_TIER_LIMITS.VOICE_CALLS_PER_MONTH) {
    return next(new AppError(
      `You have reached your free tier limit of ${FREE_TIER_LIMITS.VOICE_CALLS_PER_MONTH} voice calls per month. Please upgrade to Premium for unlimited access.`,
      403
    ));
  }

  next();
});

export const checkBookingLimit = asyncHandler(async (req, res, next) => {
  if (req.user.subscriptionTier === SUBSCRIPTION_TIERS.PREMIUM) return next();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const analytics = await Analytics.findOne({ userId: req.user._id });

  if (!analytics) return next();

  const monthlyUsage = analytics.monthlyUsage.find((m) => m.month === currentMonth);
  const bookingCount = monthlyUsage ? monthlyUsage.therapistBookings : 0;

  if (bookingCount >= FREE_TIER_LIMITS.THERAPIST_BOOKINGS_PER_MONTH) {
    return next(new AppError(
      `You have reached your free tier limit of ${FREE_TIER_LIMITS.THERAPIST_BOOKINGS_PER_MONTH} therapist booking per month. Please upgrade to Premium for unlimited bookings.`,
      403
    ));
  }

  next();
});