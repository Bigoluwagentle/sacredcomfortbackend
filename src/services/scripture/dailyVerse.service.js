import { Quran, Bible, Philosophy } from '../../models/postgres/index.js';
import Notification from '../../models/mongo/Notification.model.js';
import User from '../../models/mongo/User.model.js';
import Analytics from '../../models/mongo/Analytics.model.js';
import { RELIGIONS } from '../../config/constants.js';
import logger from '../../utils/logger.js';

export const getPersonalizedDailyVerse = async (userId, religionFilter) => {
  try {
    const analytics = await Analytics.findOne({ userId });
    let dominantEmotion = null;

    if (analytics && analytics.emotionalTrends.length > 0) {
      const recentTrends = analytics.emotionalTrends
        .sort((a, b) => b.count - a.count);
      dominantEmotion = recentTrends[0]?.emotion;
    }

    let verse = null;

    if (religionFilter.showQuran) {
      const query = dominantEmotion
        ? { where: { emotionTags: { $contains: [dominantEmotion] } }, limit: 10 }
        : { limit: 10 };

      const verses = await Quran.findAll(query);
      if (verses.length > 0) {
        const random = verses[Math.floor(Math.random() * verses.length)];
        verse = {
          reference: `${random.surahNameEnglish} ${random.surahNumber}:${random.ayahNumber}`,
          text: random.translationEnglishSahih,
          arabicText: random.textArabic,
          source: 'Quran',
          religion: 'Islam',
          emotion: dominantEmotion,
        };
      }
    }

    if (!verse && religionFilter.showBible) {
      const verses = await Bible.findAll({ limit: 10 });
      if (verses.length > 0) {
        const random = verses[Math.floor(Math.random() * verses.length)];
        verse = {
          reference: `${random.bookName} ${random.chapterNumber}:${random.verseNumber}`,
          text: random.textNIV || random.textKJV,
          source: 'Bible',
          religion: 'Christianity',
          emotion: dominantEmotion,
        };
      }
    }

    if (!verse && religionFilter.showPhilosophy) {
      const quotes = await Philosophy.findAll({ limit: 10 });
      if (quotes.length > 0) {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        verse = {
          reference: random.philosopher,
          text: random.quoteText,
          source: 'Philosophy',
          religion: 'Other',
          emotion: dominantEmotion,
        };
      }
    }

    return verse;
  } catch (error) {
    logger.error(`Personalized daily verse error: ${error.message}`);
    return null;
  }
};

export const sendDailyVerseToAllUsers = async () => {
  try {
    const users = await User.find({ isActive: true });
    let successCount = 0;

    for (const user of users) {
      const religionFilter = {
        showQuran: user.religiousPreference === RELIGIONS.ISLAM ||
          user.religiousPreference === RELIGIONS.OTHER,
        showBible: user.religiousPreference === RELIGIONS.CHRISTIANITY ||
          user.religiousPreference === RELIGIONS.OTHER,
        showHadith: user.religiousPreference === RELIGIONS.ISLAM,
        showPhilosophy: user.religiousPreference === RELIGIONS.OTHER,
      };

      const verse = await getPersonalizedDailyVerse(user._id, religionFilter);
      if (!verse) continue;

      await Notification.create({
        userId: user._id,
        type: 'daily_verse',
        title: '🌟 Your Daily Verse',
        message: `${verse.reference}: "${verse.text.substring(0, 120)}..."`,
        deliveryChannels: ['in_app'],
        sentAt: new Date(),
      });

      successCount++;
    }

    logger.info(`Daily verse sent to ${successCount} users.`);
    return successCount;
  } catch (error) {
    logger.error(`Send daily verse error: ${error.message}`);
    return 0;
  }
};