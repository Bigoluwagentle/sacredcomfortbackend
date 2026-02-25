import mongoose from 'mongoose';

const crisisLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    triggerKeywords: [String],
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    resourcesProvided: [String],
    therapyRecommended: { type: Boolean, default: true },
    resolvedAt: Date,
    notes: String, 
  },
  { timestamps: true }
);

crisisLogSchema.index({ userId: 1, createdAt: -1 });

const CrisisLog = mongoose.model('CrisisLog', crisisLogSchema);
export default CrisisLog;