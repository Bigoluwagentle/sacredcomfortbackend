import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    personalContext: [String], // e.g., "User is a teacher", "User's mother is ill"
    recurringIssues: [String], 
    progressNotes: [String],   
    relationshipContext: [String], 
    emotionalPatterns: [{
      emotion: String,
      frequency: Number,
      lastDetected: Date,
    }],
    topicPatterns: [{
      topic: String,
      frequency: Number,
      lastDetected: Date,
      conversationIds: [mongoose.Schema.Types.ObjectId],
    }],
    conversationIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    }],
    lastConsolidated: Date,
  },
  { timestamps: true }
);

memorySchema.index({ userId: 1 });

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;