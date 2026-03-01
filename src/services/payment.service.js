import Paystack from 'paystack-node';
import Booking from '../models/mongo/Booking.model.js';
import User from '../models/mongo/User.model.js';
import { AppError } from '../middleware/error.middleware.js';
import logger from '../utils/logger.js';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

export const initializeSessionPayment = async ({ userId, bookingId, email }) => {
  try {
    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) throw new AppError('Booking not found.', 404);

    if (booking.paymentStatus === 'paid') {
      throw new AppError('This session has already been paid for.', 400);
    }

    const amountInKobo = 50000 * 100; 

    const response = await paystack.transaction.initialize({
      email,
      amount: amountInKobo,
      reference: `booking_${bookingId}_${Date.now()}`,
      metadata: {
        bookingId: bookingId.toString(),
        userId: userId.toString(),
        type: 'session_payment',
      },
      callback_url: `${process.env.CLIENT_URL}/payment/verify`,
    });

    if (!response.body.status) {
      throw new AppError('Payment initialization failed.', 500);
    }

    booking.paymentIntentId = response.body.data.reference;
    await booking.save();

    return {
      authorizationUrl: response.body.data.authorization_url,
      reference: response.body.data.reference,
      accessCode: response.body.data.access_code,
    };
  } catch (error) {
    logger.error(`Payment initialization error: ${error.message}`);
    throw error;
  }
};

export const initializeSubscriptionPayment = async ({ userId, email, plan }) => {
  try {
    const planAmounts = {
      Premium: 500000, 
    };

    const amount = planAmounts[plan];
    if (!amount) throw new AppError('Invalid subscription plan.', 400);

    const response = await paystack.transaction.initialize({
      email,
      amount,
      reference: `sub_${userId}_${Date.now()}`,
      metadata: {
        userId: userId.toString(),
        plan,
        type: 'subscription',
      },
      callback_url: `${process.env.CLIENT_URL}/payment/verify`,
    });

    if (!response.body.status) {
      throw new AppError('Payment initialization failed.', 500);
    }

    return {
      authorizationUrl: response.body.data.authorization_url,
      reference: response.body.data.reference,
      accessCode: response.body.data.access_code,
    };
  } catch (error) {
    logger.error(`Subscription payment error: ${error.message}`);
    throw error;
  }
};

export const verifyPayment = async (reference) => {
  try {
    const response = await paystack.transaction.verify({ reference });

    if (!response.body.status) {
      throw new AppError('Payment verification failed.', 400);
    }

    const data = response.body.data;

    if (data.status !== 'success') {
      throw new AppError('Payment was not successful.', 400);
    }

    const { type, bookingId, userId, plan } = data.metadata;

    if (type === 'session_payment') {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
      });
      return { type: 'session_payment', bookingId, status: 'paid' };
    }

    if (type === 'subscription') {
      await User.findByIdAndUpdate(userId, {
        subscriptionTier: plan,
      });
      return { type: 'subscription', plan, status: 'active' };
    }

  } catch (error) {
    logger.error(`Payment verification error: ${error.message}`);
    throw error;
  }
};

export const getPaymentHistory = async (userId) => {
  const bookings = await Booking.find({
    userId,
    paymentStatus: 'paid',
  }).sort({ createdAt: -1 });

  return bookings;
};