import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'daily_verse',
        'prayer_reminder',
        'booking_confirmation',
        'session_reminder_24h',
        'session_reminder_1h',
        'post_session_followup',
        'weekly_summary',
        'account',
        'general',
      ],
      required: true,
    },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    deliveryChannels: [{
      type: String,
      enum: ['in_app', 'email', 'push', 'sms'],
    }],
    relatedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    scheduledFor: Date,
    sentAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ scheduledFor: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;