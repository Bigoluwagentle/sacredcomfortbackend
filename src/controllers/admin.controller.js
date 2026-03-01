import User from '../models/mongo/User.model.js';
import Conversation from '../models/mongo/Conversation.model.js';
import Booking from '../models/mongo/Booking.model.js';
import CrisisLog from '../models/mongo/CrisisLog.model.js';
import Analytics from '../models/mongo/Analytics.model.js';
import { Therapist, Quran, Bible, Hadith, Philosophy } from '../models/postgres/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalConversations,
    totalBookings,
    crisisEvents,
    premiumUsers,
    activeUsers,
  ] = await Promise.all([
    User.countDocuments(),
    Conversation.countDocuments(),
    Booking.countDocuments(),
    CrisisLog.countDocuments(),
    User.countDocuments({ subscriptionTier: 'Premium' }),
    User.countDocuments({
      lastSeen: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  successResponse(res, 200, 'Dashboard overview fetched.', {
    overview: {
      totalUsers,
      totalConversations,
      totalBookings,
      crisisEvents,
      premiumUsers,
      activeUsers,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();
  successResponse(res, 200, 'Users fetched successfully.', {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { isActive: false },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  successResponse(res, 200, 'User deactivated successfully.', { user });
});

export const getFlaggedConversations = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const conversations = await Conversation.find({
    $or: [
      { crisisDetected: true },
      { criticalFeedbackGiven: true },
    ],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'fullName email religiousPreference');

  const total = await Conversation.countDocuments({
    $or: [{ crisisDetected: true }, { criticalFeedbackGiven: true }],
  });

  successResponse(res, 200, 'Flagged conversations fetched.', {
    conversations,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

export const getCrisisEvents = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const events = await CrisisLog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'fullName email')
    .populate('conversationId', 'title createdAt');

  const total = await CrisisLog.countDocuments();
  successResponse(res, 200, 'Crisis events fetched.', {
    events,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const bookings = await Booking.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'fullName email');

  const total = await Booking.countDocuments();
  successResponse(res, 200, 'Bookings fetched successfully.', {
    bookings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

export const verifyTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findOne({
    where: { id: req.params.therapistId },
  });

  if (!therapist) {
    return res.status(404).json({ success: false, message: 'Therapist not found.' });
  }

  therapist.isVerified = true;
  await therapist.save();

  successResponse(res, 200, 'Therapist verified successfully.', { therapist });
});