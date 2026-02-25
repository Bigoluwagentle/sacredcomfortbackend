import mongoose from 'mongoose';
import { BOOKING_TYPES, SESSION_STATUS } from '../../config/constants.js';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    therapistId: {
      type: String, 
      required: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      enum: [30, 60, 90],
      default: 60,
    },
    bookingType: {
      type: String,
      enum: Object.values(BOOKING_TYPES),
      default: BOOKING_TYPES.IDENTIFIED,
    },
    pseudonym: String, 
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentIntentId: String, 
    sessionStatus: {
      type: String,
      enum: Object.values(SESSION_STATUS),
      default: SESSION_STATUS.SCHEDULED,
    },
    videoCallLink: String,
    sessionNotes: String, 
    sharedConversationSummary: {
      type: Boolean,
      default: false,
    },
    conversationSummary: String, 
    urgencyFlag: {
      type: Boolean,
      default: false,
    }, 
    reminderSent24h: { type: Boolean, default: false },
    reminderSent1h: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, sessionDate: -1 });
bookingSchema.index({ therapistId: 1, sessionDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;