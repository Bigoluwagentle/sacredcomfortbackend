import mongoose from 'mongoose';
import { EMOTIONS, TOPICS } from '../../config/constants.js';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
    },
    messages: [messageSchema],
    detectedEmotions: [{
      type: String,
      enum: EMOTIONS,
    }],
    detectedTopics: [{
      type: String,
      enum: TOPICS,
    }],
    versesShared: [{
      verseId: String,
      source: String, 
      reference: String, 
    }],
    prayerPointsGenerated: [String],
    practicalGuidanceGiven: [String],
    criticalFeedbackGiven: {
      type: Boolean,
      default: false,
    },
    persistentIssueDetected: {
      type: Boolean,
      default: false,
    },
    therapyRecommendationMade: {
      type: Boolean,
      default: false,
    },
    crisisDetected: {
      type: Boolean,
      default: false,
    },
    sessionType: {
      type: String,
      enum: ['chat', 'voice'],
      default: 'chat',
    },
    duration: Number,
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, detectedTopics: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;