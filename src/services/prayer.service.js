import Prayer from '../models/mongo/Prayer.model.js';
import { generateChatResponse } from './ai/claude.service.js';
import { AppError } from '../middleware/error.middleware.js';
import logger from '../utils/logger.js';

export const generatePrayerPoints = async ({ user, religionFilter, context }) => {
  try {
    const prompt = `Generate personalized prayer points for a ${religionFilter.aiReligionContext} user based on this context: "${context}".

Format: ${religionFilter.prayerFormat}

Return ONLY a JSON object with no extra text:
{
  "title": "Prayer for [topic]",
  "prayerPoints": ["point 1", "point 2", "point 3"],
  "fullPrayer": "complete prayer text here",
  "arabicText": "arabic text if Islamic prayer, otherwise empty string",
  "transliteration": "transliteration if Islamic prayer, otherwise empty string"
}`;

    const response = await generateChatResponse({
      systemPrompt: `You are a spiritual prayer guide for ${religionFilter.aiReligionContext} users. Generate heartfelt, personalized prayers.`,
      conversationHistory: [],
      userMessage: prompt,
      maxTokens: 800,
    });

    const parsed = JSON.parse(response.trim());

    const prayer = await Prayer.create({
      userId: user._id,
      title: parsed.title,
      fullText: parsed.fullPrayer,
      arabicText: parsed.arabicText || '',
      transliteration: parsed.transliteration || '',
      source: 'AI-generated',
      religion: user.religiousPreference,
      category: context.substring(0, 50),
    });

    return prayer;
  } catch (error) {
    logger.error(`Prayer generation error: ${error.message}`);
    throw new AppError('Could not generate prayer points. Please try again.', 500);
  }
};

export const getUserPrayers = async (userId, religion, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const prayers = await Prayer.find({ userId, religion })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Prayer.countDocuments({ userId, religion });
  return { prayers, total, page, totalPages: Math.ceil(total / limit) };
};

export const createCustomPrayer = async ({ userId, religion, title, fullText, arabicText, transliteration, category }) => {
  const prayer = await Prayer.create({
    userId,
    title,
    fullText,
    arabicText: arabicText || '',
    transliteration: transliteration || '',
    source: 'custom',
    religion,
    category: category || 'General',
  });
  return prayer;
};

export const updatePrayer = async (userId, prayerId, updateData) => {
  const prayer = await Prayer.findOneAndUpdate(
    { _id: prayerId, userId },
    updateData,
    { new: true, runValidators: true }
  );
  if (!prayer) throw new AppError('Prayer not found.', 404);
  return prayer;
};

export const deletePrayer = async (userId, prayerId) => {
  const prayer = await Prayer.findOneAndDelete({ _id: prayerId, userId });
  if (!prayer) throw new AppError('Prayer not found.', 404);
  return true;
};

export const markAsPrayed = async (userId, prayerId) => {
  const prayer = await Prayer.findOneAndUpdate(
    { _id: prayerId, userId },
    {
      $inc: { timesPrayed: 1 },
      lastPrayed: new Date(),
    },
    { new: true }
  );
  if (!prayer) throw new AppError('Prayer not found.', 404);
  return prayer;
};

export const getPrayer = async (userId, prayerId) => {
  const prayer = await Prayer.findOne({ _id: prayerId, userId });
  if (!prayer) throw new AppError('Prayer not found.', 404);
  return prayer;
};