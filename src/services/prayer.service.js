import Prayer from '../models/mongo/Prayer.model.js';
import { Dua, PastoralPrayer } from '../models/postgres/index.js';
import { generateChatResponse } from './ai/claude.service.js';
import { AppError } from '../middleware/error.middleware.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

const searchDuas = async (emotions = [], topics = []) => {
  try {
    const duas = await Dua.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { emotionTags: { [Op.overlap]: emotions } },
          { themeTags: { [Op.overlap]: topics } },
        ],
      },
      limit: 3,
    });
    return duas;
  } catch (error) {
    logger.error(`Dua search error: ${error.message}`);
    return [];
  }
};
const searchPastoralPrayers = async (emotions = [], topics = []) => {
  try {
    const prayers = await PastoralPrayer.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { emotionTags: { [Op.overlap]: emotions } },
          { themeTags: { [Op.overlap]: topics } },
        ],
      },
      limit: 3,
    });
    return prayers;
  } catch (error) {
    logger.error(`Pastoral prayer search error: ${error.message}`);
    return [];
  }
};

export const generatePrayerPoints = async ({
  user,
  religionFilter,
  context,
  emotions = [],
  topics = [],
}) => {
  try {
    let dbPrayers = [];
    let systemPrompt = '';
    let userPrompt = '';

    if (user.religiousPreference === 'Islam') {
    
      dbPrayers = await searchDuas(emotions, topics);

      const duaContext = dbPrayers.length > 0
        ? `Use these authentic Du'as as the foundation:\n${dbPrayers.map((d) =>
            `- ${d.title}\n  Arabic: ${d.arabicText}\n  Transliteration: ${d.transliteration}\n  Meaning: ${d.englishMeaning}\n  Source: ${d.source}`
          ).join('\n\n')}`
        : '';

      systemPrompt = `You are an Islamic spiritual guide. Generate personalized Du'a recommendations for a Muslim user. Always include Arabic text, transliteration, and English meaning. Reference authentic sources from Quran and Sunnah.`;

      userPrompt = `Generate personalized Du'a recommendations for this situation: "${context}"

${duaContext}

Return ONLY a valid JSON object:
{
  "title": "Du'a for [topic]",
  "duas": [
    {
      "arabicText": "arabic text",
      "transliteration": "transliteration",
      "englishMeaning": "meaning",
      "source": "source reference"
    }
  ],
  "fullPrayer": "complete supplication combining the duas",
  "practiceGuide": "when and how to recite these duas"
}`;

    } else if (user.religiousPreference === 'Christianity') {
  
      dbPrayers = await searchPastoralPrayers(emotions, topics);

      const pastoralContext = dbPrayers.length > 0
        ? `Draw inspiration from these pastoral prayers:\n${dbPrayers.map((p) =>
            `- ${p.pastorName} (${p.ministryName}): ${p.title}\n  Prayer Points: ${p.prayerPoints.join(', ')}\n  Declarations: ${p.declarations.join(', ')}`
          ).join('\n\n')}`
        : '';

      systemPrompt = `You are a Christian spiritual guide inspired by great African pastors like E.A Adeboye (RCCG), David Oyedepo (Winners Chapel), W.F Kumuyi (Deeper Life), and Chris Oyakhilome (Christ Embassy). Generate powerful, faith-filled prayer points with declarations and scripture references.`;

      userPrompt = `Generate powerful Christian prayer points for this situation: "${context}"

${pastoralContext}

Return ONLY a valid JSON object:
{
  "title": "Prayer for [topic]",
  "prayerPoints": [
    "Father Lord, I thank you for...",
    "I declare by faith that...",
    "Every spirit of [issue] is destroyed by fire..."
  ],
  "declarations": [
    "I am more than a conqueror through Christ",
    "No weapon formed against me shall prosper"
  ],
  "scriptureReferences": ["Romans 8:37", "Isaiah 54:17"],
  "fullPrayer": "complete prayer text",
  "practiceGuide": "pray this prayer every morning for 7 days"
}`;

    } else {
    
      systemPrompt = `You are a mindfulness and meditation guide. Generate calming reflection prompts and affirmations drawing from Stoic, Buddhist, and general philosophical wisdom.`;

      userPrompt = `Generate mindfulness affirmations and reflection prompts for this situation: "${context}"

Return ONLY a valid JSON object:
{
  "title": "Reflection for [topic]",
  "affirmations": [
    "I am at peace with what I cannot control",
    "This moment is enough"
  ],
  "reflectionPrompts": [
    "What is within my control right now?",
    "What would Marcus Aurelius say about this situation?"
  ],
  "fullPrayer": "complete meditation/reflection text",
  "practiceGuide": "sit quietly for 10 minutes and repeat these affirmations"
}`;
    }

    const response = await generateChatResponse({
      systemPrompt,
      conversationHistory: [],
      userMessage: userPrompt,
      maxTokens: 1000,
    });

    const parsed = JSON.parse(response.trim());

    const prayer = await Prayer.create({
      userId: user._id,
      title: parsed.title,
      fullText: parsed.fullPrayer,
      arabicText: parsed.duas ? parsed.duas.map((d) => d.arabicText).join('\n') : '',
      transliteration: parsed.duas ? parsed.duas.map((d) => d.transliteration).join('\n') : '',
      source: 'AI-generated',
      religion: user.religiousPreference,
      category: context.substring(0, 50),
    });

    return {
      prayer,
      details: parsed,
      dbPrayersUsed: dbPrayers.length,
    };
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

export const createCustomPrayer = async ({
  userId, religion, title, fullText, arabicText, transliteration, category,
}) => {
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
    { $inc: { timesPrayed: 1 }, lastPrayed: new Date() },
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