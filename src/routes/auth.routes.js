import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  deleteAccount,
  verifyEmail,
  resendOTP,
} from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOTPSchema,
  deleteAccountSchema,
} from '../utils/validators.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.delete('/delete-account', protect, validate(deleteAccountSchema), deleteAccount);
router.post('/verify-email', protect, validate(verifyOTPSchema), verifyEmail);
router.post('/resend-otp', protect, resendOTP);

export default router;