import * as paymentService from '../services/payment.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const initializeSessionPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.initializeSessionPayment({
    userId: req.user._id,
    bookingId: req.params.bookingId,
    email: req.user.email,
  });
  successResponse(res, 200, 'Payment initialized successfully.', result);
});

export const initializeSubscriptionPayment = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  const result = await paymentService.initializeSubscriptionPayment({
    userId: req.user._id,
    email: req.user.email,
    plan,
  });
  successResponse(res, 200, 'Subscription payment initialized.', result);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyPayment(req.params.reference);
  successResponse(res, 200, 'Payment verified successfully.', result);
});

export const getPaymentHistory = asyncHandler(async (req, res) => {
  const history = await paymentService.getPaymentHistory(req.user._id);
  successResponse(res, 200, 'Payment history fetched successfully.', { history });
});