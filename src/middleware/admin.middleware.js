import { AppError } from './error.middleware.js';

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admins only.', 403));
  }
  next();
};

export default adminOnly;