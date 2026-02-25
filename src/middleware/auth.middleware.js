import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/mongo/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AppError } from '../middleware/error.middleware.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  req.user = user;
  next();
});

export default protect;