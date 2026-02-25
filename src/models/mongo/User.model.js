import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { RELIGIONS, SUBSCRIPTION_TIERS } from '../../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, 
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'apple'],
      default: 'local',
    },
    googleId: String,
    appleId: String,
    religiousPreference: {
      type: String,
      enum: Object.values(RELIGIONS),
      required: [true, 'Religious preference is required'],
    },
    denomination: String,
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    location: {
      country: String,
      city: String,
      timezone: String,
    },
    subscriptionTier: {
      type: String,
      enum: Object.values(SUBSCRIPTION_TIERS),
      default: SUBSCRIPTION_TIERS.FREE,
    },
    privacySettings: {
      retainConversationHistory: { type: Boolean, default: true },
      autoDeletePeriodDays: { type: Number, default: 30 },
    },
    therapistBookingPreference: {
      type: String,
      enum: ['Anonymous', 'Identified'],
      default: 'Identified',
    },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastSeen: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;