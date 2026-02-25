import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalConversations: { type: Number, default: 0 },
    totalReflectionTime: { type: Number, default: 0 }, 
    versesSaved: { type: Number, default: 0 },
    prayerStreak: { type: Number, default: 0 },
    longestPrayerStreak: { type: Number, default: 0 },
    lastPrayedDate: Date,
    readingProgress: {
      quranPercentage: { type: Number, default: 0 },
      biblePercentage: { type: Number, default: 0 },
    },
    emotionalTrends: [{
      emotion: String,
      count: Number,
      lastDetected: Date,
    }],
    topicFrequency: [{
      topic: String,
      count: Number,
      lastDiscussed: Date,
    }],
    mostHelpfulVerses: [{
      verseId: String,
      reference: String,
      viewCount: Number,
      saveCount: Number,
    }],
    prayerActivityHeatmap: [{
      date: Date,
      count: Number,
    }],
    persistentIssuesDetected: { type: Number, default: 0 },
    therapyRecommendationsMade: { type: Number, default: 0 },
    memoryEntriesCount: { type: Number, default: 0 },
    monthlyUsage: [{
      month: String,
      chatConversations: { type: Number, default: 0 },
      voiceCalls: { type: Number, default: 0 },
      therapistBookings: { type: Number, default: 0 },
    }],
  },
  { timestamps: true }
);

analyticsSchema.index({ userId: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;