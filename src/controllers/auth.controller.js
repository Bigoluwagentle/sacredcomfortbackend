import * as authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });

  successResponse(res, 201, 'Account created successfully!', {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      religiousPreference: user.religiousPreference,
      subscriptionTier: user.subscriptionTier,
    },
    accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  successResponse(res, 200, 'Logged in successfully!', {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      religiousPreference: user.religiousPreference,
      subscriptionTier: user.subscriptionTier,
    },
    accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  successResponse(res, 200, 'Logged out successfully!');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);

  successResponse(res, 200, 'If an account with that email exists, a password reset link has been sent.');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const { user, accessToken, refreshToken } = await authService.resetPassword(token, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  successResponse(res, 200, 'Password reset successfully!', {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    accessToken,
  });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  await authService.deleteAccount(req.user._id, password);

  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  successResponse(res, 200, 'Account deleted successfully. We are sorry to see you go.');
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  await authService.verifyEmail(req.user._id, otp);

  successResponse(res, 200, 'Email verified successfully! Welcome to Sacred Comfort.');
});

export const resendOTP = asyncHandler(async (req, res) => {
  await authService.resendOTP(req.user._id);

  successResponse(res, 200, 'A new OTP has been sent to your email address.');
});