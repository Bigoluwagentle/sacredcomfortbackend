import axios from 'axios';
import { Bible } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const BIBLE_API_KEY = process.env.BIBLE_API_KEY;
const BIBLE_API_URL = 'https://api.scripture.api.bible/v1';

const KJV_BIBLE_ID = 'de4e12af7f28f599-02';
const NIV_BIBLE_ID = '06125adad2d5898a-01';

const bookTags = {
  'GEN': { themeTags: ['faith', 'purpose', 'family', 'creation'], emotionTags: ['confusion', 'hope'] },
  'EXO': { themeTags: ['faith', 'freedom', 'trust', 'guidance'], emotionTags: ['fear', 'hope'] },
  'LEV': { themeTags: ['faith', 'worship', 'guidance'], emotionTags: ['confusion', 'hope'] },
  'NUM': { themeTags: ['faith', 'patience', 'guidance'], emotionTags: ['confusion', 'hope'] },
  'DEU': { themeTags: ['faith', 'guidance', 'love'], emotionTags: ['confusion', 'hope'] },
  'JOS': { themeTags: ['faith', 'strength', 'trust'], emotionTags: ['fear', 'hope'] },
  'JDG': { themeTags: ['faith', 'strength', 'guidance'], emotionTags: ['fear', 'hope'] },
  'RUT': { themeTags: ['family', 'love', 'loyalty'], emotionTags: ['loneliness', 'hope'] },
  '1SA': { themeTags: ['faith', 'strength', 'guidance'], emotionTags: ['fear', 'hope'] },
  '2SA': { themeTags: ['faith', 'forgiveness', 'guidance'], emotionTags: ['sadness', 'hope'] },
  '1KI': { themeTags: ['faith', 'wisdom', 'guidance'], emotionTags: ['confusion', 'hope'] },
  '2KI': { themeTags: ['faith', 'trust', 'guidance'], emotionTags: ['fear', 'hope'] },
  '1CH': { themeTags: ['faith', 'worship', 'guidance'], emotionTags: ['gratitude', 'hope'] },
  '2CH': { themeTags: ['faith', 'worship', 'guidance'], emotionTags: ['gratitude', 'hope'] },
  'EZR': { themeTags: ['faith', 'restoration', 'guidance'], emotionTags: ['hope', 'gratitude'] },
  'NEH': { themeTags: ['faith', 'strength', 'restoration'], emotionTags: ['anxiety', 'hope'] },
  'EST': { themeTags: ['faith', 'courage', 'trust'], emotionTags: ['fear', 'hope'] },
  'JOB': { themeTags: ['patience', 'faith', 'suffering', 'trust'], emotionTags: ['grief', 'sadness', 'confusion', 'hope'] },
  'PSA': { themeTags: ['worship', 'faith', 'trust', 'hope', 'gratitude'], emotionTags: ['anxiety', 'sadness', 'joy', 'gratitude', 'hope'] },
  'PRO': { themeTags: ['wisdom', 'guidance', 'family', 'work'], emotionTags: ['confusion', 'hope'] },
  'ECC': { themeTags: ['purpose', 'wisdom', 'faith'], emotionTags: ['confusion', 'sadness', 'hope'] },
  'SNG': { themeTags: ['love', 'relationships', 'family'], emotionTags: ['joy', 'loneliness'] },
  'ISA': { themeTags: ['hope', 'faith', 'strength', 'trust'], emotionTags: ['fear', 'sadness', 'hope'] },
  'JER': { themeTags: ['faith', 'trust', 'hope', 'patience'], emotionTags: ['sadness', 'grief', 'hope'] },
  'LAM': { themeTags: ['grief', 'hope', 'faith'], emotionTags: ['grief', 'sadness', 'hope'] },
  'EZK': { themeTags: ['faith', 'restoration', 'hope'], emotionTags: ['confusion', 'hope'] },
  'DAN': { themeTags: ['faith', 'trust', 'strength'], emotionTags: ['fear', 'hope'] },
  'HOS': { themeTags: ['love', 'faith', 'forgiveness'], emotionTags: ['sadness', 'hope'] },
  'JOL': { themeTags: ['faith', 'hope', 'restoration'], emotionTags: ['sadness', 'hope'] },
  'AMO': { themeTags: ['justice', 'faith', 'guidance'], emotionTags: ['anger', 'hope'] },
  'OBA': { themeTags: ['faith', 'justice', 'guidance'], emotionTags: ['anger', 'hope'] },
  'JON': { themeTags: ['faith', 'mercy', 'forgiveness'], emotionTags: ['fear', 'gratitude'] },
  'MIC': { themeTags: ['justice', 'faith', 'hope'], emotionTags: ['anger', 'hope'] },
  'NAM': { themeTags: ['faith', 'justice', 'trust'], emotionTags: ['fear', 'hope'] },
  'HAB': { themeTags: ['faith', 'trust', 'patience'], emotionTags: ['confusion', 'hope'] },
  'ZEP': { themeTags: ['faith', 'hope', 'restoration'], emotionTags: ['fear', 'hope'] },
  'HAG': { themeTags: ['faith', 'work', 'restoration'], emotionTags: ['confusion', 'hope'] },
  'ZEC': { themeTags: ['faith', 'hope', 'restoration'], emotionTags: ['confusion', 'hope'] },
  'MAL': { themeTags: ['faith', 'love', 'restoration'], emotionTags: ['sadness', 'hope'] },
  'MAT': { themeTags: ['faith', 'love', 'guidance', 'kingdom'], emotionTags: ['confusion', 'hope', 'joy'] },
  'MRK': { themeTags: ['faith', 'healing', 'strength'], emotionTags: ['fear', 'hope'] },
  'LUK': { themeTags: ['faith', 'love', 'mercy', 'hope'], emotionTags: ['joy', 'hope', 'gratitude'] },
  'JHN': { themeTags: ['faith', 'love', 'eternal life', 'hope'], emotionTags: ['joy', 'hope', 'love'] },
  'ACT': { themeTags: ['faith', 'strength', 'guidance'], emotionTags: ['fear', 'hope', 'joy'] },
  'ROM': { themeTags: ['faith', 'grace', 'hope', 'love'], emotionTags: ['confusion', 'hope', 'gratitude'] },
  '1CO': { themeTags: ['love', 'faith', 'relationships', 'wisdom'], emotionTags: ['confusion', 'hope', 'love'] },
  '2CO': { themeTags: ['faith', 'strength', 'hope', 'suffering'], emotionTags: ['sadness', 'hope', 'gratitude'] },
  'GAL': { themeTags: ['faith', 'freedom', 'grace'], emotionTags: ['confusion', 'hope'] },
  'EPH': { themeTags: ['faith', 'love', 'strength', 'family'], emotionTags: ['confusion', 'hope', 'joy'] },
  'PHP': { themeTags: ['joy', 'faith', 'peace', 'contentment'], emotionTags: ['anxiety', 'joy', 'gratitude'] },
  'COL': { themeTags: ['faith', 'wisdom', 'love'], emotionTags: ['confusion', 'hope'] },
  '1TH': { themeTags: ['faith', 'hope', 'love'], emotionTags: ['grief', 'hope'] },
  '2TH': { themeTags: ['faith', 'hope', 'patience'], emotionTags: ['anxiety', 'hope'] },
  '1TI': { themeTags: ['faith', 'guidance', 'wisdom'], emotionTags: ['confusion', 'hope'] },
  '2TI': { themeTags: ['faith', 'strength', 'guidance'], emotionTags: ['fear', 'hope'] },
  'TIT': { themeTags: ['faith', 'guidance', 'wisdom'], emotionTags: ['confusion', 'hope'] },
  'PHM': { themeTags: ['forgiveness', 'love', 'relationships'], emotionTags: ['anger', 'hope'] },
  'HEB': { themeTags: ['faith', 'hope', 'strength', 'perseverance'], emotionTags: ['anxiety', 'hope'] },
  'JAS': { themeTags: ['faith', 'wisdom', 'patience', 'work'], emotionTags: ['confusion', 'hope'] },
  '1PE': { themeTags: ['faith', 'hope', 'suffering', 'strength'], emotionTags: ['sadness', 'hope'] },
  '2PE': { themeTags: ['faith', 'guidance', 'hope'], emotionTags: ['confusion', 'hope'] },
  '1JN': { themeTags: ['love', 'faith', 'relationships'], emotionTags: ['loneliness', 'hope', 'love'] },
  '2JN': { themeTags: ['love', 'faith', 'guidance'], emotionTags: ['confusion', 'hope'] },
  '3JN': { themeTags: ['faith', 'love', 'guidance'], emotionTags: ['confusion', 'hope'] },
  'JUD': { themeTags: ['faith', 'guidance', 'strength'], emotionTags: ['fear', 'hope'] },
  'REV': { themeTags: ['faith', 'hope', 'strength', 'victory'], emotionTags: ['fear', 'hope'] },
};

export const seedBible = async () => {
  try {
    const count = await Bible.count();
    if (count > 0) {
      logger.info(`Bible already seeded (${count} records). Skipping...`);
      return;
    }

    logger.info('Starting Bible seeding from API...');

    const booksResponse = await axios.get(
      `${BIBLE_API_URL}/bibles/${KJV_BIBLE_ID}/books`,
      { headers: { 'api-key': BIBLE_API_KEY } }
    );

    const books = booksResponse.data.data;
    let totalSeeded = 0;

    for (const book of books) {
      try {
        const chaptersResponse = await axios.get(
          `${BIBLE_API_URL}/bibles/${KJV_BIBLE_ID}/books/${book.id}/chapters`,
          { headers: { 'api-key': BIBLE_API_KEY } }
        );

        const chapters = chaptersResponse.data.data.filter(
          (c) => c.id !== `${book.id}.intro`
        );

        const tags = bookTags[book.id] || {
          themeTags: ['faith', 'guidance'],
          emotionTags: ['hope'],
        };

        for (const chapter of chapters) {
          try {
            const versesResponse = await axios.get(
              `${BIBLE_API_URL}/bibles/${KJV_BIBLE_ID}/chapters/${chapter.id}/verses`,
              { headers: { 'api-key': BIBLE_API_KEY } }
            );

            const verses = versesResponse.data.data;

            for (const verse of verses) {
              try {
                const verseResponse = await axios.get(
                  `${BIBLE_API_URL}/bibles/${KJV_BIBLE_ID}/verses/${verse.id}?content-type=text&include-notes=false&include-titles=false`,
                  { headers: { 'api-key': BIBLE_API_KEY } }
                );

                const verseText = verseResponse.data.data.content
                  .replace(/<[^>]*>/g, '')
                  .trim();

                const chapterNum = parseInt(chapter.number);
                const verseNum = parseInt(verse.id.split('.')[2]);

                if (!isNaN(chapterNum) && !isNaN(verseNum)) {
                  await Bible.create({
                    bookName: book.name,
                    chapterNumber: chapterNum,
                    verseNumber: verseNum,
                    textKJV: verseText,
                    textNIV: verseText,
                    themeTags: tags.themeTags,
                    emotionTags: tags.emotionTags,
                    religion: 'Christianity',
                    embeddingVector: [],
                  });
                  totalSeeded++;
                }

                await new Promise((resolve) => setTimeout(resolve, 100));

              } catch (verseError) {
                logger.error(`Error seeding verse ${verse.id}: ${verseError.message}`);
              }
            }

            logger.info(`Seeded ${book.name} Chapter ${chapter.number}`);

          } catch (chapterError) {
            logger.error(`Error seeding chapter ${chapter.id}: ${chapterError.message}`);
          }
        }

        logger.info(`✅ Completed ${book.name}`);

      } catch (bookError) {
        logger.error(`Error seeding book ${book.id}: ${bookError.message}`);
      }
    }

    logger.info(`✅ Bible seeding complete. Total verses: ${totalSeeded}`);
  } catch (error) {
    logger.error(`Bible seeding error: ${error.message}`);
  }
};

export default seedBible;