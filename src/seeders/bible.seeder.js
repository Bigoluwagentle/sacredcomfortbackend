import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Bible } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bookNames = {
  'gn': 'Genesis', 'ex': 'Exodus', 'lv': 'Leviticus', 'nm': 'Numbers',
  'dt': 'Deuteronomy', 'js': 'Joshua', 'jud': 'Judges', 'rt': 'Ruth',
  '1sm': '1 Samuel', '2sm': '2 Samuel', '1kgs': '1 Kings', '2kgs': '2 Kings',
  '1ch': '1 Chronicles', '2ch': '2 Chronicles', 'ezr': 'Ezra', 'ne': 'Nehemiah',
  'est': 'Esther', 'job': 'Job', 'ps': 'Psalms', 'prv': 'Proverbs',
  'ec': 'Ecclesiastes', 'so': 'Song of Solomon', 'is': 'Isaiah', 'jr': 'Jeremiah',
  'lm': 'Lamentations', 'ez': 'Ezekiel', 'dn': 'Daniel', 'ho': 'Hosea',
  'jl': 'Joel', 'am': 'Amos', 'ob': 'Obadiah', 'jn': 'Jonah', 'mi': 'Micah',
  'na': 'Nahum', 'hk': 'Habakkuk', 'zp': 'Zephaniah', 'hg': 'Haggai',
  'zc': 'Zechariah', 'ml': 'Malachi', 'mt': 'Matthew', 'mk': 'Mark',
  'lk': 'Luke', 'jo': 'John', 'act': 'Acts', 'rm': 'Romans',
  '1co': '1 Corinthians', '2co': '2 Corinthians', 'gl': 'Galatians',
  'eph': 'Ephesians', 'ph': 'Philippians', 'cl': 'Colossians',
  '1ts': '1 Thessalonians', '2ts': '2 Thessalonians', '1tm': '1 Timothy',
  '2tm': '2 Timothy', 'tt': 'Titus', 'phm': 'Philemon', 'hb': 'Hebrews',
  'jm': 'James', '1pe': '1 Peter', '2pe': '2 Peter', '1jo': '1 John',
  '2jo': '2 John', '3jo': '3 John', 'jd': 'Jude', 're': 'Revelation',
};

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

export const seedBible = async () => {
  try {
    logger.info('Starting Bible seeding from local JSON file...');

    const filePath = join(__dirname, 'bible.json');
    const rawData = readFileSync(filePath, 'utf8');
    const bibleData = JSON.parse(rawData);

    let totalSeeded = 0;

    for (const book of bibleData) {
      const bookName = bookNames[book.abbrev];
      if (!bookName) {
        logger.warn(`Unknown book abbreviation: ${book.abbrev}`);
        continue;
      }

      const existing = await Bible.count({ where: { bookName } });
      if (existing > 0) {
        logger.info(`Skipping ${bookName} - already seeded (${existing} verses)`);
        continue;
      }

      const tags = bookTags[bookName] || { themeTags: ['faith', 'guidance'], emotionTags: ['hope'] };
      const versesToInsert = [];

      book.chapters.forEach((chapter, chapterIndex) => {
        chapter.forEach((verseText, verseIndex) => {
          versesToInsert.push({
            bookName,
            chapterNumber: chapterIndex + 1,
            verseNumber: verseIndex + 1,
            textKJV: verseText.trim(),
            textNIV: verseText.trim(),
            themeTags: tags.themeTags,
            emotionTags: tags.emotionTags,
            religion: 'Christianity',
            embeddingVector: [],
          });
        });
      });

      await Bible.bulkCreate(versesToInsert);
      totalSeeded += versesToInsert.length;
      logger.info(`✅ Seeded ${bookName} - ${versesToInsert.length} verses`);
    }

    logger.info(`✅ Bible seeding complete. Total verses: ${totalSeeded}`);
  } catch (error) {
    logger.error(`Bible seeding error: ${error.message}`);
  }
};

export default seedBible;