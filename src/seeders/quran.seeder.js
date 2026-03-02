import axios from 'axios';
import { Quran } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const surahTags = {
  1: { themeTags: ['guidance', 'faith', 'worship'], emotionTags: ['gratitude', 'hope'] },
  2: { themeTags: ['guidance', 'faith', 'patience', 'finances', 'relationships'], emotionTags: ['anxiety', 'hope', 'confusion'] },
  3: { themeTags: ['faith', 'patience', 'trust'], emotionTags: ['fear', 'hope', 'sadness'] },
  4: { themeTags: ['family', 'relationships', 'justice'], emotionTags: ['anger', 'sadness'] },
  5: { themeTags: ['faith', 'justice', 'relationships'], emotionTags: ['confusion', 'anger'] },
  6: { themeTags: ['faith', 'guidance', 'purpose'], emotionTags: ['confusion', 'hope'] },
  7: { themeTags: ['patience', 'faith', 'purpose'], emotionTags: ['sadness', 'hope'] },
  9: { themeTags: ['faith', 'trust', 'strength'], emotionTags: ['fear', 'anxiety'] },
  10: { themeTags: ['trust', 'faith', 'hope'], emotionTags: ['anxiety', 'hope'] },
  11: { themeTags: ['patience', 'trust', 'faith'], emotionTags: ['sadness', 'hope'] },
  12: { themeTags: ['patience', 'family', 'trust', 'loss'], emotionTags: ['sadness', 'grief', 'hope'] },
  13: { themeTags: ['trust', 'faith', 'guidance'], emotionTags: ['anxiety', 'confusion'] },
  14: { themeTags: ['gratitude', 'faith', 'patience'], emotionTags: ['gratitude', 'hope'] },
  17: { themeTags: ['guidance', 'faith', 'worship'], emotionTags: ['confusion', 'hope'] },
  18: { themeTags: ['patience', 'faith', 'purpose'], emotionTags: ['confusion', 'hope'] },
  19: { themeTags: ['family', 'faith', 'mercy'], emotionTags: ['loneliness', 'hope'] },
  20: { themeTags: ['patience', 'trust', 'faith'], emotionTags: ['anxiety', 'hope'] },
  21: { themeTags: ['faith', 'trust', 'patience'], emotionTags: ['fear', 'hope'] },
  22: { themeTags: ['faith', 'patience', 'worship'], emotionTags: ['confusion', 'hope'] },
  23: { themeTags: ['faith', 'success', 'purpose'], emotionTags: ['hope', 'gratitude'] },
  24: { themeTags: ['family', 'relationships', 'faith'], emotionTags: ['confusion', 'anger'] },
  25: { themeTags: ['guidance', 'faith', 'patience'], emotionTags: ['confusion', 'hope'] },
  26: { themeTags: ['faith', 'patience', 'trust'], emotionTags: ['sadness', 'hope'] },
  27: { themeTags: ['gratitude', 'faith', 'trust'], emotionTags: ['gratitude', 'hope'] },
  28: { themeTags: ['patience', 'trust', 'faith'], emotionTags: ['sadness', 'hope'] },
  29: { themeTags: ['patience', 'faith', 'trust'], emotionTags: ['anxiety', 'hope'] },
  30: { themeTags: ['faith', 'hope', 'trust'], emotionTags: ['sadness', 'hope'] },
  31: { themeTags: ['wisdom', 'family', 'gratitude'], emotionTags: ['confusion', 'gratitude'] },
  32: { themeTags: ['faith', 'guidance', 'patience'], emotionTags: ['confusion', 'hope'] },
  33: { themeTags: ['family', 'faith', 'relationships'], emotionTags: ['anxiety', 'hope'] },
  36: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  39: { themeTags: ['forgiveness', 'hope', 'faith'], emotionTags: ['sadness', 'hope', 'gratitude'] },
  40: { themeTags: ['faith', 'patience', 'trust'], emotionTags: ['fear', 'hope'] },
  41: { themeTags: ['faith', 'guidance', 'patience'], emotionTags: ['confusion', 'hope'] },
  42: { themeTags: ['patience', 'faith', 'trust'], emotionTags: ['sadness', 'hope'] },
  43: { themeTags: ['gratitude', 'faith', 'guidance'], emotionTags: ['confusion', 'gratitude'] },
  44: { themeTags: ['faith', 'patience', 'mercy'], emotionTags: ['sadness', 'hope'] },
  45: { themeTags: ['faith', 'gratitude', 'guidance'], emotionTags: ['confusion', 'gratitude'] },
  46: { themeTags: ['patience', 'faith', 'family'], emotionTags: ['sadness', 'hope'] },
  47: { themeTags: ['faith', 'strength', 'trust'], emotionTags: ['fear', 'hope'] },
  48: { themeTags: ['faith', 'victory', 'trust'], emotionTags: ['anxiety', 'hope'] },
  49: { themeTags: ['relationships', 'family', 'faith'], emotionTags: ['anger', 'confusion'] },
  50: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  51: { themeTags: ['faith', 'worship', 'gratitude'], emotionTags: ['gratitude', 'hope'] },
  52: { themeTags: ['faith', 'patience', 'trust'], emotionTags: ['fear', 'hope'] },
  53: { themeTags: ['faith', 'guidance', 'purpose'], emotionTags: ['confusion', 'hope'] },
  54: { themeTags: ['faith', 'patience', 'trust'], emotionTags: ['fear', 'hope'] },
  55: { themeTags: ['gratitude', 'faith', 'mercy'], emotionTags: ['gratitude', 'joy'] },
  56: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['fear', 'hope'] },
  57: { themeTags: ['faith', 'trust', 'patience'], emotionTags: ['sadness', 'hope'] },
  58: { themeTags: ['faith', 'relationships', 'justice'], emotionTags: ['anger', 'confusion'] },
  59: { themeTags: ['faith', 'trust', 'strength'], emotionTags: ['fear', 'hope'] },
  60: { themeTags: ['faith', 'relationships', 'trust'], emotionTags: ['confusion', 'hope'] },
  61: { themeTags: ['faith', 'strength', 'trust'], emotionTags: ['fear', 'hope'] },
  62: { themeTags: ['faith', 'worship', 'work'], emotionTags: ['confusion', 'hope'] },
  63: { themeTags: ['faith', 'finances', 'work'], emotionTags: ['confusion', 'anxiety'] },
  64: { themeTags: ['faith', 'trust', 'family'], emotionTags: ['anxiety', 'hope'] },
  65: { themeTags: ['family', 'relationships', 'trust'], emotionTags: ['sadness', 'hope'] },
  66: { themeTags: ['family', 'faith', 'forgiveness'], emotionTags: ['sadness', 'hope'] },
  67: { themeTags: ['faith', 'purpose', 'trust'], emotionTags: ['confusion', 'hope'] },
  68: { themeTags: ['patience', 'faith', 'guidance'], emotionTags: ['sadness', 'hope'] },
  69: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['fear', 'hope'] },
  70: { themeTags: ['patience', 'faith', 'worship'], emotionTags: ['anxiety', 'hope'] },
  71: { themeTags: ['faith', 'forgiveness', 'mercy'], emotionTags: ['sadness', 'hope'] },
  72: { themeTags: ['faith', 'guidance', 'purpose'], emotionTags: ['confusion', 'hope'] },
  73: { themeTags: ['patience', 'worship', 'faith'], emotionTags: ['anxiety', 'hope'] },
  74: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  75: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  76: { themeTags: ['gratitude', 'faith', 'patience'], emotionTags: ['gratitude', 'hope'] },
  77: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  78: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  79: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['fear', 'hope'] },
  80: { themeTags: ['faith', 'guidance', 'purpose'], emotionTags: ['confusion', 'hope'] },
  81: { themeTags: ['faith', 'guidance', 'purpose'], emotionTags: ['fear', 'hope'] },
  82: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['fear', 'hope'] },
  83: { themeTags: ['justice', 'faith', 'guidance'], emotionTags: ['anger', 'hope'] },
  84: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['fear', 'hope'] },
  85: { themeTags: ['patience', 'faith', 'trust'], emotionTags: ['sadness', 'hope'] },
  86: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  87: { themeTags: ['worship', 'faith', 'guidance'], emotionTags: ['confusion', 'hope'] },
  88: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['fear', 'hope'] },
  89: { themeTags: ['patience', 'faith', 'guidance'], emotionTags: ['sadness', 'hope'] },
  90: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  91: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  92: { themeTags: ['faith', 'generosity', 'guidance'], emotionTags: ['confusion', 'hope'] },
  93: { themeTags: ['hope', 'faith', 'guidance'], emotionTags: ['sadness', 'hope', 'loneliness'] },
  94: { themeTags: ['hope', 'relief', 'faith'], emotionTags: ['sadness', 'anxiety', 'hope'] },
  95: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  96: { themeTags: ['faith', 'knowledge', 'guidance'], emotionTags: ['confusion', 'hope'] },
  97: { themeTags: ['faith', 'worship', 'guidance'], emotionTags: ['gratitude', 'hope'] },
  98: { themeTags: ['faith', 'guidance', 'purpose'], emotionTags: ['confusion', 'hope'] },
  99: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['fear', 'hope'] },
  100: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  101: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['fear', 'hope'] },
  102: { themeTags: ['faith', 'purpose', 'guidance'], emotionTags: ['confusion', 'hope'] },
  103: { themeTags: ['patience', 'faith', 'purpose'], emotionTags: ['anxiety', 'hope'] },
  104: { themeTags: ['faith', 'justice', 'guidance'], emotionTags: ['anger', 'hope'] },
  105: { themeTags: ['faith', 'trust', 'guidance'], emotionTags: ['fear', 'hope'] },
  106: { themeTags: ['gratitude', 'faith', 'worship'], emotionTags: ['gratitude', 'hope'] },
  107: { themeTags: ['faith', 'generosity', 'guidance'], emotionTags: ['confusion', 'hope'] },
  108: { themeTags: ['gratitude', 'faith', 'worship'], emotionTags: ['gratitude', 'hope'] },
  109: { themeTags: ['faith', 'guidance', 'purpose'], emotionTags: ['confusion', 'hope'] },
  110: { themeTags: ['faith', 'forgiveness', 'worship'], emotionTags: ['gratitude', 'hope'] },
  111: { themeTags: ['faith', 'guidance', 'purpose'], emotionTags: ['confusion', 'hope'] },
  112: { themeTags: ['faith', 'worship', 'guidance'], emotionTags: ['confusion', 'hope'] },
  113: { themeTags: ['protection', 'faith', 'trust'], emotionTags: ['fear', 'anxiety', 'hope'] },
  114: { themeTags: ['protection', 'faith', 'trust'], emotionTags: ['fear', 'anxiety', 'hope'] },
};

export const seedQuran = async () => {
  try {
    logger.info('Starting Quran seeding from API...');
    const surahsResponse = await axios.get('https://api.alquran.cloud/v1/surah');
    const surahs = surahsResponse.data.data;
    let totalSeeded = 0;

    for (const surah of surahs) {
      const existing = await Quran.count({ where: { surahNumber: surah.number } });
      if (existing > 0) {
        logger.info(`Skipping Surah ${surah.number} - already seeded (${existing} verses)`);
        continue;
      }
      try {
        const arabicResponse = await axios.get(
            `https://api.alquran.cloud/v1/surah/${surah.number}`
        );

        const englishResponse = await axios.get(
            `https://api.alquran.cloud/v1/surah/${surah.number}/en.sahih`
        );

        const yusufAliResponse = await axios.get(
            `https://api.alquran.cloud/v1/surah/${surah.number}/en.yusufali`
        );

        const transliterationResponse = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surah.number}/en.transliteration`
        );

        const arabicVerses = arabicResponse.data.data.ayahs;
        const englishVerses = englishResponse.data.data.ayahs;
        const yusufAliVerses = yusufAliResponse.data.data.ayahs;
        const transliterationVerses = transliterationResponse.data.data.ayahs;

        const tags = surahTags[surah.number] || {
          themeTags: ['faith', 'guidance'],
          emotionTags: ['hope'],
        };

        const versesToInsert = arabicVerses.map((ayah, index) => ({
            surahNumber: surah.number,
            surahNameArabic: surah.name,
            surahNameEnglish: surah.englishName,
            ayahNumber: ayah.numberInSurah,
            textArabic: ayah.text,
            translationEnglishSahih: englishVerses[index]?.text || '',
            translationEnglishYusufAli: yusufAliVerses[index]?.text || '',
            transliteration: transliterationVerses[index]?.text || '',
            themeTags: tags.themeTags,
            emotionTags: tags.emotionTags,
            religion: 'Islam',
            embeddingVector: [],
        }));

        await Quran.bulkCreate(versesToInsert);
        totalSeeded += versesToInsert.length;
        logger.info(`Seeded Surah ${surah.number}: ${surah.englishName} (${versesToInsert.length} verses)`);

        await new Promise((resolve) => setTimeout(resolve, 300));

      } catch (surahError) {
        logger.error(`Error seeding Surah ${surah.number}: ${surahError.message}`);
      }
    }

    logger.info(`✅ Quran seeding complete. Total verses: ${totalSeeded}`);
  } catch (error) {
    logger.error(`Quran seeding error: ${error.message}`);
  }
};

export default seedQuran;