import crypto from 'crypto';
import User from '../models/mongo/User.model.js';
import Analytics from '../models/mongo/Analytics.model.js';
import Memory from '../models/mongo/Memory.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { AppError } from '../middleware/error.middleware.js';

export const registerUser = async (userData) => {
  const { fullName, email, password, religiousPreference, preferredLanguage } = userData;


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered. Please log in.', 400);
  }

  const user = await User.create({
    fullName,
    email,
    password,
    religiousPreference,
    preferredLanguage: preferredLanguage || 'en',
  });


  await Analytics.create({ userId: user._id });

  await Memory.create({ userId: user._id });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password.', 401);
  }

  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('No account found with that email address.', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  return { resetToken, user };
};


export const resetPassword = async (resetToken, newPassword) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Reset token is invalid or has expired.', 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};

export const deleteAccount = async (userId, password) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Incorrect password. Account deletion cancelled.', 401);
  }

  await Promise.all([
    User.findByIdAndDelete(userId),
    Analytics.findOneAndDelete({ userId }),
    Memory.findOneAndDelete({ userId }),
  ]);

  return true;
};