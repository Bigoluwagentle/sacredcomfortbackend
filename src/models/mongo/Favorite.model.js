import mongoose from 'mongoose';
import { RELIGIONS } from '../../config/constants.js';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    verseId: {
      type: String,
      required: true,
    },
    sourceReligion: {
      type: String,
      enum: Object.values(RELIGIONS),
      required: true,
    },
    reference: String, 
    text: String,      
    personalNotes: String,
    tags: [String],
    savedFrom: {
      type: String,
      enum: ['conversation', 'reading', 'search', 'daily-verse'],
      default: 'reading',
    },
    relatedConversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, sourceReligion: 1 });
favoriteSchema.index({ userId: 1, verseId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;