import * as userService from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user._id);
  successResponse(res, 200, 'Profile fetched successfully.', { user });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user._id, req.body);
  successResponse(res, 200, 'Profile updated successfully.', { user });
});

export const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image file.',
    });
  }

  const user = await userService.updateProfilePicture(req.user._id, req.file);
  successResponse(res, 200, 'Profile picture updated successfully.', {
    profilePicture: user.profilePicture,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user._id, currentPassword, newPassword);
  successResponse(res, 200, 'Password changed successfully.');
});

export const updatePrivacySettings = asyncHandler(async (req, res) => {
  const user = await userService.updatePrivacySettings(req.user._id, req.body);
  successResponse(res, 200, 'Privacy settings updated successfully.', {
    privacySettings: user.privacySettings,
  });
});