import { Quran, Hadith, Bible, Philosophy } from '../../models/postgres/index.js';
import { Op } from 'sequelize';
import logger from '../../utils/logger.js';

export const searchScriptureByTags = async ({
  emotions = [],
  topics = [],
  religionFilter,
  limit = 3,
}) => {
  try {
    const results = [];

    if (religionFilter.showQuran && emotions.length > 0) {
      const quranVerses = await Quran.findAll({
        where: {
          [Op.or]: [
            { emotionTags: { [Op.overlap]: emotions } },
            { themeTags: { [Op.overlap]: topics } },
          ],
        },
        limit,
        order: [['id', 'ASC']],
      });

      quranVerses.forEach((verse) => {
        results.push({
          id: verse.id,
          reference: `${verse.surahNameEnglish} ${verse.surahNumber}:${verse.ayahNumber}`,
          text: verse.translationEnglishSahih,
          source: 'Quran',
          religion: 'Islam',
        });
      });
    }

    if (religionFilter.showHadith && emotions.length > 0) {
      const hadiths = await Hadith.findAll({
        where: {
          [Op.or]: [
            { emotionTags: { [Op.overlap]: emotions } },
            { themeTags: { [Op.overlap]: topics } },
          ],
        },
        limit,
        order: [['id', 'ASC']],
      });

      hadiths.forEach((hadith) => {
        results.push({
          id: hadith.id,
          reference: `${hadith.collection} - ${hadith.hadithNumber}`,
          text: hadith.englishTranslation,
          source: 'Hadith',
          religion: 'Islam',
        });
      });
    }

    if (religionFilter.showBible && emotions.length > 0) {
      const bibleVerses = await Bible.findAll({
        where: {
          [Op.or]: [
            { emotionTags: { [Op.overlap]: emotions } },
            { themeTags: { [Op.overlap]: topics } },
          ],
        },
        limit,
        order: [['id', 'ASC']],
      });

      bibleVerses.forEach((verse) => {
        results.push({
          id: verse.id,
          reference: `${verse.bookName} ${verse.chapterNumber}:${verse.verseNumber}`,
          text: verse.textNIV || verse.textKJV,
          source: 'Bible',
          religion: 'Christianity',
        });
      });
    }

    if (religionFilter.showPhilosophy && emotions.length > 0) {
      const quotes = await Philosophy.findAll({
        where: {
          [Op.or]: [
            { emotionTags: { [Op.overlap]: emotions } },
            { themeTags: { [Op.overlap]: topics } },
          ],
        },
        limit,
        order: [['id', 'ASC']],
      });

      quotes.forEach((quote) => {
        results.push({
          id: quote.id,
          reference: `${quote.philosopher} - ${quote.philosophyType}`,
          text: quote.quoteText,
          source: 'Philosophy',
          religion: 'Other',
        });
      });
    }

    return results;
  } catch (error) {
    logger.error(`Scripture search error: ${error.message}`);
    return [];
  }
};

export const getDailyVerse = async (religionFilter) => {
  try {
    let verse = null;

    if (religionFilter.showQuran) {
      const count = await Quran.count();
      if (count > 0) {
        const randomOffset = Math.floor(Math.random() * count);
        verse = await Quran.findOne({ offset: randomOffset });
        if (verse) {
          return {
            reference: `${verse.surahNameEnglish} ${verse.surahNumber}:${verse.ayahNumber}`,
            text: verse.translationEnglishSahih,
            source: 'Quran',
            religion: 'Islam',
          };
        }
      }
    }

    if (religionFilter.showBible) {
      const count = await Bible.count();
      if (count > 0) {
        const randomOffset = Math.floor(Math.random() * count);
        verse = await Bible.findOne({ offset: randomOffset });
        if (verse) {
          return {
            reference: `${verse.bookName} ${verse.chapterNumber}:${verse.verseNumber}`,
            text: verse.textNIV || verse.textKJV,
            source: 'Bible',
            religion: 'Christianity',
          };
        }
      }
    }

    return null;
  } catch (error) {
    logger.error(`Daily verse error: ${error.message}`);
    return null;
  }
};

// Keyword search across scripture
export const keywordSearchScripture = async (keyword, religionFilter, limit = 10) => {
  try {
    const results = [];
    const searchTerm = `%${keyword}%`;

    if (religionFilter.showQuran) {
      const verses = await Quran.findAll({
        where: {
          [Op.or]: [
            { translationEnglishSahih: { [Op.iLike]: searchTerm } },
            { surahNameEnglish: { [Op.iLike]: searchTerm } },
          ],
        },
        limit,
      });

      verses.forEach((verse) => {
        results.push({
          reference: `${verse.surahNameEnglish} ${verse.surahNumber}:${verse.ayahNumber}`,
          text: verse.translationEnglishSahih,
          source: 'Quran',
          religion: 'Islam',
        });
      });
    }

    if (religionFilter.showBible) {
      const verses = await Bible.findAll({
        where: {
          [Op.or]: [
            { textNIV: { [Op.iLike]: searchTerm } },
            { textKJV: { [Op.iLike]: searchTerm } },
            { bookName: { [Op.iLike]: searchTerm } },
          ],
        },
        limit,
      });

      verses.forEach((verse) => {
        results.push({
          reference: `${verse.bookName} ${verse.chapterNumber}:${verse.verseNumber}`,
          text: verse.textNIV || verse.textKJV,
          source: 'Bible',
          religion: 'Christianity',
        });
      });
    }

    if (religionFilter.showPhilosophy) {
      const quotes = await Philosophy.findAll({
        where: {
          [Op.or]: [
            { quoteText: { [Op.iLike]: searchTerm } },
            { philosopher: { [Op.iLike]: searchTerm } },
          ],
        },
        limit,
      });

      quotes.forEach((quote) => {
        results.push({
          reference: `${quote.philosopher}`,
          text: quote.quoteText,
          source: 'Philosophy',
          religion: 'Other',
        });
      });
    }

    return results;
  } catch (error) {
    logger.error(`Keyword search error: ${error.message}`);
    return [];
  }
};