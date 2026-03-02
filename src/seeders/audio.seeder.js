import { AudioFile } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const quranAudios = Array.from({ length: 114 }, (_, i) => ({
  title: `Surah ${i + 1}`,
  reciterName: 'Mishary Rashid Alafasy',
  audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${i + 1}.mp3`,
  religion: 'Islam',
  audioType: 'quran_recitation',
  language: 'ar',
  verseId: i + 1,
  duration: 0,
  isActive: true,
}));

const surahNames = {
  1: 'Al-Fatihah', 2: 'Al-Baqarah', 3: 'Al-Imran', 4: 'An-Nisa',
  5: 'Al-Maidah', 6: 'Al-Anam', 7: 'Al-Araf', 8: 'Al-Anfal',
  9: 'At-Tawbah', 10: 'Yunus', 11: 'Hud', 12: 'Yusuf',
  13: 'Ar-Rad', 14: 'Ibrahim', 15: 'Al-Hijr', 16: 'An-Nahl',
  17: 'Al-Isra', 18: 'Al-Kahf', 19: 'Maryam', 20: 'Ta-Ha',
  21: 'Al-Anbiya', 22: 'Al-Hajj', 23: 'Al-Muminun', 24: 'An-Nur',
  25: 'Al-Furqan', 26: 'Ash-Shuara', 27: 'An-Naml', 28: 'Al-Qasas',
  29: 'Al-Ankabut', 30: 'Ar-Rum', 31: 'Luqman', 32: 'As-Sajdah',
  33: 'Al-Ahzab', 34: 'Saba', 35: 'Fatir', 36: 'Ya-Sin',
  37: 'As-Saffat', 38: 'Sad', 39: 'Az-Zumar', 40: 'Ghafir',
  41: 'Fussilat', 42: 'Ash-Shura', 43: 'Az-Zukhruf', 44: 'Ad-Dukhan',
  45: 'Al-Jathiyah', 46: 'Al-Ahqaf', 47: 'Muhammad', 48: 'Al-Fath',
  49: 'Al-Hujurat', 50: 'Qaf', 51: 'Adh-Dhariyat', 52: 'At-Tur',
  53: 'An-Najm', 54: 'Al-Qamar', 55: 'Ar-Rahman', 56: 'Al-Waqiah',
  57: 'Al-Hadid', 58: 'Al-Mujadila', 59: 'Al-Hashr', 60: 'Al-Mumtahanah',
  61: 'As-Saf', 62: 'Al-Jumuah', 63: 'Al-Munafiqun', 64: 'At-Taghabun',
  65: 'At-Talaq', 66: 'At-Tahrim', 67: 'Al-Mulk', 68: 'Al-Qalam',
  69: 'Al-Haqqah', 70: 'Al-Maarij', 71: 'Nuh', 72: 'Al-Jinn',
  73: 'Al-Muzzammil', 74: 'Al-Muddaththir', 75: 'Al-Qiyamah', 76: 'Al-Insan',
  77: 'Al-Mursalat', 78: 'An-Naba', 79: 'An-Naziat', 80: 'Abasa',
  81: 'At-Takwir', 82: 'Al-Infitar', 83: 'Al-Mutaffifin', 84: 'Al-Inshiqaq',
  85: 'Al-Buruj', 86: 'At-Tariq', 87: 'Al-Ala', 88: 'Al-Ghashiyah',
  89: 'Al-Fajr', 90: 'Al-Balad', 91: 'Ash-Shams', 92: 'Al-Layl',
  93: 'Ad-Duha', 94: 'Ash-Sharh', 95: 'At-Tin', 96: 'Al-Alaq',
  97: 'Al-Qadr', 98: 'Al-Bayyinah', 99: 'Az-Zalzalah', 100: 'Al-Adiyat',
  101: 'Al-Qariah', 102: 'At-Takathur', 103: 'Al-Asr', 104: 'Al-Humazah',
  105: 'Al-Fil', 106: 'Quraysh', 107: 'Al-Maun', 108: 'Al-Kawthar',
  109: 'Al-Kafirun', 110: 'An-Nasr', 111: 'Al-Masad', 112: 'Al-Ikhlas',
  113: 'Al-Falaq', 114: 'An-Nas',
};

quranAudios.forEach((audio) => {
  if (surahNames[audio.verseId]) {
    audio.title = surahNames[audio.verseId];
  }
});

const bibleAudios = [
  { title: 'Psalm 23', verseId: 10001, audioUrl: 'https://www.bible.com/audio-bible/59/PSA.23.ESV', duration: 120 },
  { title: 'Psalm 91', verseId: 10002, audioUrl: 'https://www.bible.com/audio-bible/59/PSA.91.ESV', duration: 180 },
  { title: 'Psalm 121', verseId: 10003, audioUrl: 'https://www.bible.com/audio-bible/59/PSA.121.ESV', duration: 90 },
  { title: 'John 3', verseId: 10004, audioUrl: 'https://www.bible.com/audio-bible/59/JHN.3.ESV', duration: 300 },
  { title: 'John 14', verseId: 10005, audioUrl: 'https://www.bible.com/audio-bible/59/JHN.14.ESV', duration: 240 },
  { title: 'Romans 8', verseId: 10006, audioUrl: 'https://www.bible.com/audio-bible/59/ROM.8.ESV', duration: 360 },
  { title: 'Philippians 4', verseId: 10007, audioUrl: 'https://www.bible.com/audio-bible/59/PHP.4.ESV', duration: 240 },
  { title: 'Isaiah 53', verseId: 10008, audioUrl: 'https://www.bible.com/audio-bible/59/ISA.53.ESV', duration: 180 },
  { title: 'Isaiah 40', verseId: 10009, audioUrl: 'https://www.bible.com/audio-bible/59/ISA.40.ESV', duration: 300 },
  { title: 'Matthew 5', verseId: 10010, audioUrl: 'https://www.bible.com/audio-bible/59/MAT.5.ESV', duration: 420 },
  { title: '1 Corinthians 13', verseId: 10011, audioUrl: 'https://www.bible.com/audio-bible/59/1CO.13.ESV', duration: 180 },
  { title: 'Hebrews 11', verseId: 10012, audioUrl: 'https://www.bible.com/audio-bible/59/HEB.11.ESV', duration: 360 },
  { title: 'Proverbs 31', verseId: 10013, audioUrl: 'https://www.bible.com/audio-bible/59/PRO.31.ESV', duration: 240 },
  { title: 'Genesis 1', verseId: 10014, audioUrl: 'https://www.bible.com/audio-bible/59/GEN.1.ESV', duration: 300 },
  { title: 'Revelation 21', verseId: 10015, audioUrl: 'https://www.bible.com/audio-bible/59/REV.21.ESV', duration: 270 },
].map((b) => ({
  ...b,
  reciterName: 'Max McLean',
  religion: 'Christianity',
  audioType: 'bible_reading',
  language: 'en',
  isActive: true,
}));

const audioFiles = [...quranAudios, ...bibleAudios];

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