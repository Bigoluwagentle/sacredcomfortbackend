import Analytics from '../models/mongo/Analytics.model.js';
import Conversation from '../models/mongo/Conversation.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const getMyAnalytics = asyncHandler(async (req, res) => {
  let analytics = await Analytics.findOne({ userId: req.user._id });

  if (!analytics) {
    analytics = await Analytics.create({ userId: req.user._id });
  }

  successResponse(res, 200, 'Analytics fetched successfully.', { analytics });
});

export const getEmotionalTrends = asyncHandler(async (req, res) => {
  const analytics = await Analytics.findOne({ userId: req.user._id });

  if (!analytics) {
    return successResponse(res, 200, 'No data yet.', { trends: [] });
  }

  const trends = analytics.emotionalTrends.sort((a, b) => b.count - a.count);
  successResponse(res, 200, 'Emotional trends fetched successfully.', { trends });
});

export const getTopicFrequency = asyncHandler(async (req, res) => {
  const analytics = await Analytics.findOne({ userId: req.user._id });

  if (!analytics) {
    return successResponse(res, 200, 'No data yet.', { topics: [] });
  }

  const topics = analytics.topicFrequency.sort((a, b) => b.count - a.count);
  successResponse(res, 200, 'Topic frequency fetched successfully.', { topics });
});

export const getMonthlyUsage = asyncHandler(async (req, res) => {
  const analytics = await Analytics.findOne({ userId: req.user._id });

  if (!analytics) {
    return successResponse(res, 200, 'No data yet.', { usage: [] });
  }

  successResponse(res, 200, 'Monthly usage fetched successfully.', {
    usage: analytics.monthlyUsage,
  });
});

export const getSummaryStats = asyncHandler(async (req, res) => {
  const analytics = await Analytics.findOne({ userId: req.user._id });
  const totalConversations = await Conversation.countDocuments({
    userId: req.user._id,
  });
  const crisisConversations = await Conversation.countDocuments({
    userId: req.user._id,
    crisisDetected: true,
  });

  successResponse(res, 200, 'Summary stats fetched successfully.', {
    summary: {
      totalConversations,
      crisisConversations,
      versesSaved: analytics?.versesSaved || 0,
      prayerStreak: analytics?.prayerStreak || 0,
      longestPrayerStreak: analytics?.longestPrayerStreak || 0,
      persistentIssuesDetected: analytics?.persistentIssuesDetected || 0,
      therapyRecommendationsMade: analytics?.therapyRecommendationsMade || 0,
      memoryEntriesCount: analytics?.memoryEntriesCount || 0,
    },
  });
});