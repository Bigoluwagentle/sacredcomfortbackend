import axios from 'axios';
import { Bible } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const bookTags = {
  'Genesis': { themeTags: ['faith', 'purpose', 'family', 'creation'], emotionTags: ['confusion', 'hope'] },
  'Exodus': { themeTags: ['faith', 'freedom', 'trust', 'guidance'], emotionTags: ['fear', 'hope'] },
  'Leviticus': { themeTags: ['faith', 'worship', 'guidance'], emotionTags: ['confusion', 'hope'] },
  'Numbers': { themeTags: ['faith', 'patience', 'guidance'], emotionTags: ['confusion', 'hope'] },
  'Deuteronomy': { themeTags: ['faith', 'guidance', 'love'], emotionTags: ['confusion', 'hope'] },
  'Joshua': { themeTags: ['faith', 'strength', 'trust'], emotionTags: ['fear', 'hope'] },
  'Judges': { themeTags: ['faith', 'strength', 'guidance'], emotionTags: ['fear', 'hope'] },
  'Ruth': { themeTags: ['family', 'love', 'loyalty'], emotionTags: ['loneliness', 'hope'] },
  '1 Samuel': { themeTags: ['faith', 'strength', 'guidance'], emotionTags: ['fear', 'hope'] },
  '2 Samuel': { themeTags: ['faith', 'forgiveness', 'guidance'], emotionTags: ['sadness', 'hope'] },
  '1 Kings': { themeTags: ['faith', 'wisdom', 'guidance'], emotionTags: ['confusion', 'hope'] },
  '2 Kings': { themeTags: ['faith', 'trust', 'guidance'], emotionTags: ['fear', 'hope'] },
  '1 Chronicles': { themeTags: ['faith', 'worship', 'guidance'], emotionTags: ['gratitude', 'hope'] },
  '2 Chronicles': { themeTags: ['faith', 'worship', 'guidance'], emotionTags: ['gratitude', 'hope'] },
  'Ezra': { themeTags: ['faith', 'restoration', 'guidance'], emotionTags: ['hope', 'gratitude'] },
  'Nehemiah': { themeTags: ['faith', 'strength', 'restoration'], emotionTags: ['anxiety', 'hope'] },
  'Esther': { themeTags: ['faith', 'courage', 'trust'], emotionTags: ['fear', 'hope'] },
  'Job': { themeTags: ['patience', 'faith', 'suffering', 'trust'], emotionTags: ['grief', 'sadness', 'confusion', 'hope'] },
  'Psalms': { themeTags: ['worship', 'faith', 'trust', 'hope', 'gratitude'], emotionTags: ['anxiety', 'sadness', 'joy', 'gratitude', 'hope'] },
  'Proverbs': { themeTags: ['wisdom', 'guidance', 'family', 'work'], emotionTags: ['confusion', 'hope'] },
  'Ecclesiastes': { themeTags: ['purpose', 'wisdom', 'faith'], emotionTags: ['confusion', 'sadness', 'hope'] },
  'Song of Solomon': { themeTags: ['love', 'relationships', 'family'], emotionTags: ['joy', 'loneliness'] },
  'Isaiah': { themeTags: ['hope', 'faith', 'strength', 'trust'], emotionTags: ['fear', 'sadness', 'hope'] },
  'Jeremiah': { themeTags: ['faith', 'trust', 'hope', 'patience'], emotionTags: ['sadness', 'grief', 'hope'] },
  'Lamentations': { themeTags: ['grief', 'hope', 'faith'], emotionTags: ['grief', 'sadness', 'hope'] },
  'Ezekiel': { themeTags: ['faith', 'restoration', 'hope'], emotionTags: ['confusion', 'hope'] },
  'Daniel': { themeTags: ['faith', 'trust', 'strength'], emotionTags: ['fear', 'hope'] },
  'Hosea': { themeTags: ['love', 'faith', 'forgiveness'], emotionTags: ['sadness', 'hope'] },
  'Joel': { themeTags: ['faith', 'hope', 'restoration'], emotionTags: ['sadness', 'hope'] },
  'Amos': { themeTags: ['justice', 'faith', 'guidance'], emotionTags: ['anger', 'hope'] },
  'Obadiah': { themeTags: ['faith', 'justice', 'guidance'], emotionTags: ['anger', 'hope'] },
  'Jonah': { themeTags: ['faith', 'mercy', 'forgiveness'], emotionTags: ['fear', 'gratitude'] },
  'Micah': { themeTags: ['justice', 'faith', 'hope'], emotionTags: ['anger', 'hope'] },
  'Nahum': { themeTags: ['faith', 'justice', 'trust'], emotionTags: ['fear', 'hope'] },
  'Habakkuk': { themeTags: ['faith', 'trust', 'patience'], emotionTags: ['confusion', 'hope'] },
  'Zephaniah': { themeTags: ['faith', 'hope', 'restoration'], emotionTags: ['fear', 'hope'] },
  'Haggai': { themeTags: ['faith', 'work', 'restoration'], emotionTags: ['confusion', 'hope'] },
  'Zechariah': { themeTags: ['faith', 'hope', 'restoration'], emotionTags: ['confusion', 'hope'] },
  'Malachi': { themeTags: ['faith', 'love', 'restoration'], emotionTags: ['sadness', 'hope'] },
  'Matthew': { themeTags: ['faith', 'love', 'guidance', 'kingdom'], emotionTags: ['confusion', 'hope', 'joy'] },
  'Mark': { themeTags: ['faith', 'healing', 'strength'], emotionTags: ['fear', 'hope'] },
  'Luke': { themeTags: ['faith', 'love', 'mercy', 'hope'], emotionTags: ['joy', 'hope', 'gratitude'] },
  'John': { themeTags: ['faith', 'love', 'eternal life', 'hope'], emotionTags: ['joy', 'hope', 'love'] },
  'Acts': { themeTags: ['faith', 'strength', 'guidance'], emotionTags: ['fear', 'hope', 'joy'] },
  'Romans': { themeTags: ['faith', 'grace', 'hope', 'love'], emotionTags: ['confusion', 'hope', 'gratitude'] },
  '1 Corinthians': { themeTags: ['love', 'faith', 'relationships', 'wisdom'], emotionTags: ['confusion', 'hope', 'love'] },
  '2 Corinthians': { themeTags: ['faith', 'strength', 'hope', 'suffering'], emotionTags: ['sadness', 'hope', 'gratitude'] },
  'Galatians': { themeTags: ['faith', 'freedom', 'grace'], emotionTags: ['confusion', 'hope'] },
  'Ephesians': { themeTags: ['faith', 'love', 'strength', 'family'], emotionTags: ['confusion', 'hope', 'joy'] },
  'Philippians': { themeTags: ['joy', 'faith', 'peace', 'contentment'], emotionTags: ['anxiety', 'joy', 'gratitude'] },
  'Colossians': { themeTags: ['faith', 'wisdom', 'love'], emotionTags: ['confusion', 'hope'] },
  '1 Thessalonians': { themeTags: ['faith', 'hope', 'love'], emotionTags: ['grief', 'hope'] },
  '2 Thessalonians': { themeTags: ['faith', 'hope', 'patience'], emotionTags: ['anxiety', 'hope'] },
  '1 Timothy': { themeTags: ['faith', 'guidance', 'wisdom'], emotionTags: ['confusion', 'hope'] },
  '2 Timothy': { themeTags: ['faith', 'strength', 'guidance'], emotionTags: ['fear', 'hope'] },
  'Titus': { themeTags: ['faith', 'guidance', 'wisdom'], emotionTags: ['confusion', 'hope'] },
  'Philemon': { themeTags: ['forgiveness', 'love', 'relationships'], emotionTags: ['anger', 'hope'] },
  'Hebrews': { themeTags: ['faith', 'hope', 'strength', 'perseverance'], emotionTags: ['anxiety', 'hope'] },
  'James': { themeTags: ['faith', 'wisdom', 'patience', 'work'], emotionTags: ['confusion', 'hope'] },
  '1 Peter': { themeTags: ['faith', 'hope', 'suffering', 'strength'], emotionTags: ['sadness', 'hope'] },
  '2 Peter': { themeTags: ['faith', 'guidance', 'hope'], emotionTags: ['confusion', 'hope'] },
  '1 John': { themeTags: ['love', 'faith', 'relationships'], emotionTags: ['loneliness', 'hope', 'love'] },
  '2 John': { themeTags: ['love', 'faith', 'guidance'], emotionTags: ['confusion', 'hope'] },
  '3 John': { themeTags: ['faith', 'love', 'guidance'], emotionTags: ['confusion', 'hope'] },
  'Jude': { themeTags: ['faith', 'guidance', 'strength'], emotionTags: ['fear', 'hope'] },
  'Revelation': { themeTags: ['faith', 'hope', 'strength', 'victory'], emotionTags: ['fear', 'hope'] },
};

const books = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah',
  'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke',
  'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians',
  '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

export const seedBible = async () => {
  try {
    logger.info('Starting Bible seeding from GitHub KJV JSON...');
    let totalSeeded = 0;

    for (const bookName of books) {
      const existing = await Bible.count({ where: { bookName } });
      if (existing > 0) {
        logger.info(`Skipping ${bookName} - already seeded (${existing} verses)`);
        continue;
      }

      try {
        const encodedBook = encodeURIComponent(bookName);
        const url = `https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${encodedBook}.json`;
        const response = await axios.get(url);
        const bookData = response.data;

        const tags = bookTags[bookName] || { themeTags: ['faith', 'guidance'], emotionTags: ['hope'] };
        const versesToInsert = [];

        for (const chapter of bookData.chapters) {
          for (const verse of chapter.verses) {
            versesToInsert.push({
              bookName,
              chapterNumber: chapter.chapter,
              verseNumber: verse.verse,
              textKJV: verse.text.trim(),
              textNIV: verse.text.trim(),
              themeTags: tags.themeTags,
              emotionTags: tags.emotionTags,
              religion: 'Christianity',
              embeddingVector: [],
            });
          }
        }

        await Bible.bulkCreate(versesToInsert);
        totalSeeded += versesToInsert.length;
        logger.info(`✅ Seeded ${bookName} - ${versesToInsert.length} verses`);

        await new Promise((resolve) => setTimeout(resolve, 200));

      } catch (bookError) {
        logger.error(`Error seeding ${bookName}: ${bookError.message}`);
      }
    }

    logger.info(`✅ Bible seeding complete. Total verses: ${totalSeeded}`);
  } catch (error) {
    logger.error(`Bible seeding error: ${error.message}`);
  }
};

export default seedBible;