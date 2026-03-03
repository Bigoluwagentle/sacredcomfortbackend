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

const bibleBooks = [
  { name: 'Genesis', abbrev: 'GEN', chapters: 50 },
  { name: 'Exodus', abbrev: 'EXO', chapters: 40 },
  { name: 'Leviticus', abbrev: 'LEV', chapters: 27 },
  { name: 'Numbers', abbrev: 'NUM', chapters: 36 },
  { name: 'Deuteronomy', abbrev: 'DEU', chapters: 34 },
  { name: 'Joshua', abbrev: 'JOS', chapters: 24 },
  { name: 'Judges', abbrev: 'JDG', chapters: 21 },
  { name: 'Ruth', abbrev: 'RUT', chapters: 4 },
  { name: '1 Samuel', abbrev: '1SA', chapters: 31 },
  { name: '2 Samuel', abbrev: '2SA', chapters: 24 },
  { name: '1 Kings', abbrev: '1KI', chapters: 22 },
  { name: '2 Kings', abbrev: '2KI', chapters: 25 },
  { name: '1 Chronicles', abbrev: '1CH', chapters: 29 },
  { name: '2 Chronicles', abbrev: '2CH', chapters: 36 },
  { name: 'Ezra', abbrev: 'EZR', chapters: 10 },
  { name: 'Nehemiah', abbrev: 'NEH', chapters: 13 },
  { name: 'Esther', abbrev: 'EST', chapters: 10 },
  { name: 'Job', abbrev: 'JOB', chapters: 42 },
  { name: 'Psalms', abbrev: 'PSA', chapters: 150 },
  { name: 'Proverbs', abbrev: 'PRO', chapters: 31 },
  { name: 'Ecclesiastes', abbrev: 'ECC', chapters: 12 },
  { name: 'Song of Solomon', abbrev: 'SNG', chapters: 8 },
  { name: 'Isaiah', abbrev: 'ISA', chapters: 66 },
  { name: 'Jeremiah', abbrev: 'JER', chapters: 52 },
  { name: 'Lamentations', abbrev: 'LAM', chapters: 5 },
  { name: 'Ezekiel', abbrev: 'EZK', chapters: 48 },
  { name: 'Daniel', abbrev: 'DAN', chapters: 12 },
  { name: 'Hosea', abbrev: 'HOS', chapters: 14 },
  { name: 'Joel', abbrev: 'JOL', chapters: 3 },
  { name: 'Amos', abbrev: 'AMO', chapters: 9 },
  { name: 'Obadiah', abbrev: 'OBA', chapters: 1 },
  { name: 'Jonah', abbrev: 'JON', chapters: 4 },
  { name: 'Micah', abbrev: 'MIC', chapters: 7 },
  { name: 'Nahum', abbrev: 'NAM', chapters: 3 },
  { name: 'Habakkuk', abbrev: 'HAB', chapters: 3 },
  { name: 'Zephaniah', abbrev: 'ZEP', chapters: 3 },
  { name: 'Haggai', abbrev: 'HAG', chapters: 2 },
  { name: 'Zechariah', abbrev: 'ZEC', chapters: 14 },
  { name: 'Malachi', abbrev: 'MAL', chapters: 4 },
  { name: 'Matthew', abbrev: 'MAT', chapters: 28 },
  { name: 'Mark', abbrev: 'MRK', chapters: 16 },
  { name: 'Luke', abbrev: 'LUK', chapters: 24 },
  { name: 'John', abbrev: 'JHN', chapters: 21 },
  { name: 'Acts', abbrev: 'ACT', chapters: 28 },
  { name: 'Romans', abbrev: 'ROM', chapters: 16 },
  { name: '1 Corinthians', abbrev: '1CO', chapters: 16 },
  { name: '2 Corinthians', abbrev: '2CO', chapters: 13 },
  { name: 'Galatians', abbrev: 'GAL', chapters: 6 },
  { name: 'Ephesians', abbrev: 'EPH', chapters: 6 },
  { name: 'Philippians', abbrev: 'PHP', chapters: 4 },
  { name: 'Colossians', abbrev: 'COL', chapters: 4 },
  { name: '1 Thessalonians', abbrev: '1TH', chapters: 5 },
  { name: '2 Thessalonians', abbrev: '2TH', chapters: 3 },
  { name: '1 Timothy', abbrev: '1TI', chapters: 6 },
  { name: '2 Timothy', abbrev: '2TI', chapters: 4 },
  { name: 'Titus', abbrev: 'TIT', chapters: 3 },
  { name: 'Philemon', abbrev: 'PHM', chapters: 1 },
  { name: 'Hebrews', abbrev: 'HEB', chapters: 13 },
  { name: 'James', abbrev: 'JAS', chapters: 5 },
  { name: '1 Peter', abbrev: '1PE', chapters: 5 },
  { name: '2 Peter', abbrev: '2PE', chapters: 3 },
  { name: '1 John', abbrev: '1JN', chapters: 5 },
  { name: '2 John', abbrev: '2JN', chapters: 1 },
  { name: '3 John', abbrev: '3JN', chapters: 1 },
  { name: 'Jude', abbrev: 'JUD', chapters: 1 },
  { name: 'Revelation', abbrev: 'REV', chapters: 22 },
];

const bibleAudios = [];
let verseIdCounter = 10001;

for (const book of bibleBooks) {
  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    bibleAudios.push({
      title: `${book.name} ${chapter}`,
      reciterName: 'Max McLean',
      audioUrl: `https://www.bible.com/audio-bible/59/${book.abbrev}.${chapter}.ESV`,
      religion: 'Christianity',
      audioType: 'bible_reading',
      language: 'en',
      verseId: verseIdCounter++,
      duration: 0,
      isActive: true,
    });
  }
}

const audioFiles = [...quranAudios, ...bibleAudios];

export const seedAudioFiles = async () => {
  try {
    const count = await AudioFile.count();
    if (count > 0) {
      logger.info(`Audio files already seeded (${count} records). Clearing and reseeding...`);
      await AudioFile.destroy({ where: {} });
    }

    await AudioFile.bulkCreate(audioFiles);
    logger.info(`✅ Seeded ${audioFiles.length} audio files successfully.`);
  } catch (error) {
    logger.error(`Audio seeding error: ${error.message}`);
  }
};

export default seedAudioFiles;