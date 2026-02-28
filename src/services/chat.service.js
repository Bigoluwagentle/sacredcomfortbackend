import Conversation from '../models/mongo/Conversation.model.js';
import Analytics from '../models/mongo/Analytics.model.js';
import { generateChatResponse, detectEmotionsAndTopics } from './ai/claude.service.js';
import { buildSystemPrompt } from './ai/prompt.service.js';
import { loadUserMemory, updateUserMemory, updateTopicPatterns } from './ai/memory.service.js';
import { searchScriptureByTags } from './scripture/search.service.js';
import { detectCrisis, getCrisisResources, logCrisisEvent, buildCrisisResponse } from './crisis.service.js';
import { PERSISTENT_ISSUE_THRESHOLD } from '../config/constants.js';
import logger from '../utils/logger.js';

export const processChat = async ({ user, religionFilter, message, conversationId }) => {
  try {
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: user._id,
      });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId: user._id,
        title: message.substring(0, 50),
        messages: [],
        sessionType: 'chat',
      });
    }

    const { memorySummary, recurringIssues } = await loadUserMemory(user._id);

    const { emotions, topics, distressLevel, crisisDetected: aiCrisisDetected } =
      await detectEmotionsAndTopics(message);

    const { crisisDetected, triggerKeywords } = detectCrisis(message);
    const isCrisis = crisisDetected || aiCrisisDetected;

    const relevantVerses = await searchScriptureByTags({
      emotions,
      topics,
      religionFilter,
      limit: 2,
    });

    const systemPrompt = buildSystemPrompt({
      user,
      religionFilter,
      memorySummary,
      recurringIssues,
      relevantVerses,
    });

    let aiResponse = await generateChatResponse({
      systemPrompt,
      conversationHistory: conversation.messages.slice(-10),
      userMessage: message,
    });

    let crisisResources = [];
    if (isCrisis) {
      crisisResources = await getCrisisResources();
      aiResponse += buildCrisisResponse(crisisResources);
      await logCrisisEvent({
        userId: user._id,
        conversationId: conversation._id,
        triggerKeywords,
        severity: distressLevel >= 8 ? 'high' : 'medium',
        resourcesProvided: crisisResources.map((r) => r.name),
      });
    }

    const persistentTopics = await updateTopicPatterns(
      user._id,
      conversation._id,
      topics
    );
    const persistentIssueDetected = persistentTopics.length > 0;
    const therapyRecommendationMade =
      persistentIssueDetected || isCrisis || distressLevel >= 7;

    if (therapyRecommendationMade && !isCrisis) {
      aiResponse += `\n\n---\n💙 **A gentle suggestion:** I've noticed this has been weighing on you. Speaking with a licensed therapist could provide deeper support. Would you like me to help you find one?`;
    }

    conversation.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );
    conversation.detectedEmotions = emotions;
    conversation.detectedTopics = topics;
    conversation.versesShared = relevantVerses.map((v) => ({
      verseId: String(v.id),
      source: v.source,
      reference: v.reference,
    }));
    conversation.persistentIssueDetected = persistentIssueDetected;
    conversation.therapyRecommendationMade = therapyRecommendationMade;
    conversation.crisisDetected = isCrisis;
    await conversation.save();

    updateUserMemory(user._id, conversation._id, conversation.messages).catch(
      (err) => logger.error(`Memory update failed: ${err.message}`)
    );

    updateAnalytics(user._id, emotions, topics).catch(
      (err) => logger.error(`Analytics update failed: ${err.message}`)
    );

    return {
      conversationId: conversation._id,
      message: aiResponse,
      emotions,
      topics,
      versesShared: relevantVerses,
      persistentIssueDetected,
      therapyRecommendationMade,
      crisisDetected: isCrisis,
    };
  } catch (error) {
    logger.error(`Chat processing error: ${error.message}`);
    throw error;
  }
};

export const getConversationHistory = async (userId, conversationId) => {
  return await Conversation.findOne({ _id: conversationId, userId });
};

export const getUserConversations = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const conversations = await Conversation.find({ userId, isArchived: false })
    .select('title detectedEmotions detectedTopics createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Conversation.countDocuments({ userId, isArchived: false });

  return { conversations, total, page, totalPages: Math.ceil(total / limit) };
};

export const archiveConversation = async (userId, conversationId) => {
  return await Conversation.findOneAndUpdate(
    { _id: conversationId, userId },
    { isArchived: true },
    { new: true }
  );
};

const updateAnalytics = async (userId, emotions, topics) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const analytics = await Analytics.findOne({ userId });
  if (!analytics) return;

  analytics.totalConversations += 1;

  emotions.forEach((emotion) => {
    const existing = analytics.emotionalTrends.find((e) => e.emotion === emotion);
    if (existing) {
      existing.count += 1;
      existing.lastDetected = new Date();
    } else {
      analytics.emotionalTrends.push({
        emotion,
        count: 1,
        lastDetected: new Date(),
      });
    }
  });

  topics.forEach((topic) => {
    const existing = analytics.topicFrequency.find((t) => t.topic === topic);
    if (existing) {
      existing.count += 1;
      existing.lastDiscussed = new Date();
    } else {
      analytics.topicFrequency.push({
        topic,
        count: 1,
        lastDiscussed: new Date(),
      });
    }
  });

  const monthlyEntry = analytics.monthlyUsage.find((m) => m.month === currentMonth);
  if (monthlyEntry) {
    monthlyEntry.chatConversations += 1;
  } else {
    analytics.monthlyUsage.push({
      month: currentMonth,
      chatConversations: 1,
      voiceCalls: 0,
      therapistBookings: 0,
    });
  }

  await analytics.save();
};