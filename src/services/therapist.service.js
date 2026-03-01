import { Therapist, TherapistAvailability } from '../models/postgres/index.js';
import { Op } from 'sequelize';
import { AppError } from '../middleware/error.middleware.js';

export const getTherapists = async ({
  specialization,
  religiousBackground,
  language,
  minRate,
  maxRate,
  page = 1,
  limit = 10,
}) => {
  const where = { isActive: true, isVerified: true };

  if (religiousBackground) where.religiousBackground = religiousBackground;
  if (minRate || maxRate) {
    where.hourlyRate = {};
    if (minRate) where.hourlyRate[Op.gte] = minRate;
    if (maxRate) where.hourlyRate[Op.lte] = maxRate;
  }
  if (specialization) {
    where.specializations = { [Op.contains]: [specialization] };
  }
  if (language) {
    where.languages = { [Op.contains]: [language] };
  }

  const offset = (page - 1) * limit;
  const { rows: therapists, count: total } = await Therapist.findAndCountAll({
    where,
    limit,
    offset,
    order: [['rating', 'DESC']],
  });

  return { therapists, total, page, totalPages: Math.ceil(total / limit) };
};

export const getTherapist = async (therapistId) => {
  const therapist = await Therapist.findOne({
    where: { id: therapistId, isActive: true },
    include: [{ model: TherapistAvailability, as: 'availability' }],
  });

  if (!therapist) throw new AppError('Therapist not found.', 404);
  return therapist;
};

export const getTherapistAvailability = async (therapistId) => {
  const availability = await TherapistAvailability.findAll({
    where: { therapistId, isBooked: false },
    order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
  });
  return availability;
};

export const getMatchedTherapists = async (religiousPreference, page = 1, limit = 10) => {
  const religionMap = {
    Islam: 'Muslim',
    Christianity: 'Christian',
    Other: 'Secular',
  };

  const preferredBackground = religionMap[religiousPreference] || 'Secular';

  const offset = (page - 1) * limit;
  const { rows: therapists, count: total } = await Therapist.findAndCountAll({
    where: {
      isActive: true,
      isVerified: true,
      religiousBackground: {
        [Op.in]: [preferredBackground, 'Secular'],
      },
    },
    limit,
    offset,
    order: [['rating', 'DESC']],
  });

  return { therapists, total, page, totalPages: Math.ceil(total / limit) };
};