import * as bookingService from '../services/booking.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const createBooking = asyncHandler(async (req, res) => {
  const result = await bookingService.createBooking({
    userId: req.user._id,
    ...req.body,
  });
  successResponse(res, 201, 'Session booked successfully!', result);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const result = await bookingService.getUserBookings(
    req.user._id,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 10
  );
  successResponse(res, 200, 'Bookings fetched successfully.', result);
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBooking(
    req.user._id,
    req.params.bookingId
  );
  successResponse(res, 200, 'Booking fetched successfully.', { booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(
    req.user._id,
    req.params.bookingId
  );
  successResponse(res, 200, 'Booking cancelled successfully.', { booking });
});