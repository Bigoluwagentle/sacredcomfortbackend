import User from '../models/mongo/User.model.js';
import { AppError } from '../middleware/error.middleware.js';
import { deleteFile } from '../config/cloudinary.js';

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const allowedFields = [
    'fullName',
    'preferredLanguage',
    'denomination',
    'location',
    'therapistBookingPreference',
  ];

  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    filteredData,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

export const updateProfilePicture = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (user.profilePicture.publicId) {
    await deleteFile(user.profilePicture.publicId);
  }

  user.profilePicture = {
    url: file.path,
    publicId: file.filename,
  };

  await user.save({ validateBeforeSave: false });
  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new AppError('Current password is incorrect.', 401);
  }

  user.password = newPassword;
  await user.save();

  return user;
};

export const updatePrivacySettings = async (userId, privacySettings) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { privacySettings },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};