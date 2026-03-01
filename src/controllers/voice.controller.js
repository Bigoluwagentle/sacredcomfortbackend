import Conversation from '../models/mongo/Conversation.model.js';
import Analytics from '../models/mongo/Analytics.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const getVoiceCallRecords = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const calls = await Conversation.find({
    userId: req.user._id,
    sessionType: 'voice',
    isArchived: false,
  })
    .select('title detectedEmotions detectedTopics duration createdAt crisisDetected therapyRecommendationMade')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Conversation.countDocuments({
    userId: req.user._id,
    sessionType: 'voice',
  });

  successResponse(res, 200, 'Voice call records fetched successfully.', {
    calls,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

export const getVoiceCallRecord = asyncHandler(async (req, res) => {
  const call = await Conversation.findOne({
    _id: req.params.callId,
    userId: req.user._id,
    sessionType: 'voice',
  });

  if (!call) {
    return res.status(404).json({
      success: false,
      message: 'Voice call record not found.',
    });
  }

  successResponse(res, 200, 'Voice call record fetched successfully.', { call });
});

export const getVoiceAnalytics = asyncHandler(async (req, res) => {
  const totalCalls = await Conversation.countDocuments({
    userId: req.user._id,
    sessionType: 'voice',
  });

  const totalDuration = await Conversation.aggregate([
    {
      $match: {
        userId: req.user._id,
        sessionType: 'voice',
      },
    },
    {
      $group: {
        _id: null,
        totalDuration: { $sum: '$duration' },
      },
    },
  ]);

  successResponse(res, 200, 'Voice analytics fetched successfully.', {
    totalCalls,
    totalDurationSeconds: totalDuration[0]?.totalDuration || 0,
  });
});