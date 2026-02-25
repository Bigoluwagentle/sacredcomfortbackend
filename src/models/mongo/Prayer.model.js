import mongoose from 'mongoose';
import { RELIGIONS } from '../../config/constants.js';

const prayerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Prayer title is required'],
      trim: true,
    },
    fullText: {
      type: String,
      required: [true, 'Prayer text is required'],
    },
    arabicText: String,       
    transliteration: String,  
    source: {
      type: String,
      enum: ['AI-generated', 'traditional', 'custom'],
      default: 'AI-generated',
    },
    religion: {
      type: String,
      enum: Object.values(RELIGIONS),
      required: true,
    },
    relatedConversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    category: String,
    timesPrayed: {
      type: Number,
      default: 0,
    },
    lastPrayed: Date,
  },
  { timestamps: true }
);

prayerSchema.index({ userId: 1, religion: 1 });

const Prayer = mongoose.model('Prayer', prayerSchema);
export default Prayer;