import Notification from '../models/mongo/Notification.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ userId: req.user._id });
  const unreadCount = await Notification.countDocuments({
    userId: req.user._id,
    isRead: false,
  });

  successResponse(res, 200, 'Notifications fetched successfully.', {
    notifications,
    total,
    unreadCount,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.notificationId, userId: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found.',
    });
  }

  successResponse(res, 200, 'Notification marked as read.', { notification });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true }
  );
  successResponse(res, 200, 'All notifications marked as read.');
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.notificationId,
    userId: req.user._id,
  });
  successResponse(res, 200, 'Notification deleted successfully.');
});