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
  googleAuthCallback,
} from '../controllers/auth.controller.js';
import passport from '../config/passport.js';
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
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
    session: false,
  }),
  googleAuthCallback
);

export default router;