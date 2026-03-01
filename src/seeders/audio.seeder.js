import { AudioFile } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const audioFiles = [
  {
    title: 'Al-Fatihah',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
    religion: 'Islam',
    audioType: 'quran_recitation',
    language: 'ar',
    verseId: '1',
    duration: 30,
    isActive: true,
  },
  {
    title: 'Al-Baqarah',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3',
    religion: 'Islam',
    audioType: 'quran_recitation',
    language: 'ar',
    verseId: '2',
    duration: 6900,
    isActive: true,
  },
  {
    title: 'Al-Imran',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3',
    religion: 'Islam',
    audioType: 'quran_recitation',
    language: 'ar',
    verseId: '3',
    duration: 3600,
    isActive: true,
  },
  {
    title: 'Al-Kahf',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/18.mp3',
    religion: 'Islam',
    audioType: 'quran_recitation',
    language: 'ar',
    verseId: '18',
    duration: 2700,
    isActive: true,
  },
  {
    title: 'Yasin',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/36.mp3',
    religion: 'Islam',
    audioType: 'quran_recitation',
    language: 'ar',
    verseId: '36',
    duration: 1800,
    isActive: true,
  },
  {
    title: 'Ar-Rahman',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/55.mp3',
    religion: 'Islam',
    audioType: 'quran_recitation',
    language: 'ar',
    verseId: '55',
    duration: 900,
    isActive: true,
  },
  {
    title: 'Al-Mulk',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3',
    religion: 'Islam',
    audioType: 'quran_recitation',
    language: 'ar',
    verseId: '67',
    duration: 720,
    isActive: true,
  },
  {
    title: 'Al-Waqiah',
    reciterName: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/56.mp3',
    religion: 'Islam',
    audioType: 'quran_recitation',
    language: 'ar',
    verseId: '56',
    duration: 900,
    isActive: true,
  },

  {
    title: 'Psalm 23 - The Lord is My Shepherd',
    reciterName: 'Max McLean',
    audioUrl: 'https://www.bible.com/audio-bible/59/PSA.23.ESV',
    religion: 'Christianity',
    audioType: 'bible_reading',
    language: 'en',
    verseId: 'PSA.23',
    duration: 120,
    isActive: true,
  },
  {
    title: 'John 3 - For God So Loved the World',
    reciterName: 'Max McLean',
    audioUrl: 'https://www.bible.com/audio-bible/59/JHN.3.ESV',
    religion: 'Christianity',
    audioType: 'bible_reading',
    language: 'en',
    verseId: 'JHN.3',
    duration: 300,
    isActive: true,
  },
  {
    title: 'Romans 8 - No Condemnation',
    reciterName: 'Max McLean',
    audioUrl: 'https://www.bible.com/audio-bible/59/ROM.8.ESV',
    religion: 'Christianity',
    audioType: 'bible_reading',
    language: 'en',
    verseId: 'ROM.8',
    duration: 360,
    isActive: true,
  },
  {
    title: 'Philippians 4 - Rejoice in the Lord',
    reciterName: 'Max McLean',
    audioUrl: 'https://www.bible.com/audio-bible/59/PHP.4.ESV',
    religion: 'Christianity',
    audioType: 'bible_reading',
    language: 'en',
    verseId: 'PHP.4',
    duration: 240,
    isActive: true,
  },
  {
    title: 'Isaiah 53 - The Suffering Servant',
    reciterName: 'Max McLean',
    audioUrl: 'https://www.bible.com/audio-bible/59/ISA.53.ESV',
    religion: 'Christianity',
    audioType: 'bible_reading',
    language: 'en',
    verseId: 'ISA.53',
    duration: 180,
    isActive: true,
  },
];

export const seedAudioFiles = async () => {
  try {
    const count = await AudioFile.count();
    if (count > 0) {
      logger.info(`Audio files already seeded (${count} records). Skipping...`);
      return;
    }

    await AudioFile.bulkCreate(audioFiles);
    logger.info(`✅ Seeded ${audioFiles.length} audio files successfully.`);
  } catch (error) {
    logger.error(`Audio seeding error: ${error.message}`);
  }
};

export default seedAudioFiles;