import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
    },
    description: String,
    colorTheme: {
      type: String,
      default: '#4A90A4',
    },
    privacySetting: {
      type: String,
      enum: ['private', 'shareable'],
      default: 'private',
    },
    verseIds: [String],
  },
  { timestamps: true }
);

collectionSchema.index({ userId: 1 });

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;