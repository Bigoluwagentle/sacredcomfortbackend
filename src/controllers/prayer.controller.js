import * as prayerService from '../services/prayer.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const generatePrayer = asyncHandler(async (req, res) => {
  const { context } = req.body;
  if (!context) {
    return res.status(400).json({ success: false, message: 'Context is required.' });
  }
  const prayer = await prayerService.generatePrayerPoints({
    user: req.user,
    religionFilter: req.religionFilter,
    context,
  });
  successResponse(res, 201, 'Prayer points generated successfully.', { prayer });
});

export const getMyPrayers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await prayerService.getUserPrayers(
    req.user._id,
    req.user.religiousPreference,
    page,
    limit
  );
  successResponse(res, 200, 'Prayers fetched successfully.', result);
});

export const getMyPrayer = asyncHandler(async (req, res) => {
  const prayer = await prayerService.getPrayer(req.user._id, req.params.prayerId);
  successResponse(res, 200, 'Prayer fetched successfully.', { prayer });
});

export const createPrayer = asyncHandler(async (req, res) => {
  const prayer = await prayerService.createCustomPrayer({
    userId: req.user._id,
    religion: req.user.religiousPreference,
    ...req.body,
  });
  successResponse(res, 201, 'Prayer created successfully.', { prayer });
});

export const updatePrayer = asyncHandler(async (req, res) => {
  const prayer = await prayerService.updatePrayer(
    req.user._id,
    req.params.prayerId,
    req.body
  );
  successResponse(res, 200, 'Prayer updated successfully.', { prayer });
});

export const deletePrayer = asyncHandler(async (req, res) => {
  await prayerService.deletePrayer(req.user._id, req.params.prayerId);
  successResponse(res, 200, 'Prayer deleted successfully.');
});

export const markAsPrayed = asyncHandler(async (req, res) => {
  const prayer = await prayerService.markAsPrayed(req.user._id, req.params.prayerId);
  successResponse(res, 200, 'Prayer marked as prayed.', { prayer });
});