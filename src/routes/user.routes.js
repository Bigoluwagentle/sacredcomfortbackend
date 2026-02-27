import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  updateProfilePicture,
  changePassword,
  updatePrivacySettings,
} from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';
import religionFilter from '../middleware/religion.middleware.js';
import { uploadProfilePicture } from '../config/cloudinary.js';

const router = Router();

router.use(protect);
router.use(religionFilter);

router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);
router.patch('/me/profile-picture', uploadProfilePicture.single('profilePicture'), updateProfilePicture);
router.patch('/me/change-password', changePassword);
router.patch('/me/privacy', updatePrivacySettings);

export default router;