import * as therapistService from '../services/therapist.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const getTherapists = asyncHandler(async (req, res) => {
  const {
    specialization,
    religiousBackground,
    language,
    minRate,
    maxRate,
    page,
    limit,
  } = req.query;

  const result = await therapistService.getTherapists({
    specialization,
    religiousBackground,
    language,
    minRate: minRate ? Number(minRate) : null,
    maxRate: maxRate ? Number(maxRate) : null,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

  successResponse(res, 200, 'Therapists fetched successfully.', result);
});

export const getMatchedTherapists = asyncHandler(async (req, res) => {
  const result = await therapistService.getMatchedTherapists(
    req.user.religiousPreference,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 10
  );
  successResponse(res, 200, 'Matched therapists fetched successfully.', result);
});

export const getTherapist = asyncHandler(async (req, res) => {
  const therapist = await therapistService.getTherapist(req.params.therapistId);
  successResponse(res, 200, 'Therapist fetched successfully.', { therapist });
});

export const getTherapistAvailability = asyncHandler(async (req, res) => {
  const availability = await therapistService.getTherapistAvailability(
    req.params.therapistId
  );
  successResponse(res, 200, 'Availability fetched successfully.', {
    availability,
  });
});