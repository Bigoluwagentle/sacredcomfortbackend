import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const Quran = sequelize.define('Quran', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  surahNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  surahNameArabic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surahNameEnglish: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ayahNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  textArabic: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  translationEnglishSahih: DataTypes.TEXT,
  translationEnglishYusufAli: DataTypes.TEXT,
  translationEnglishPickthall: DataTypes.TEXT,
  transliteration: DataTypes.TEXT,
  revelationContext: DataTypes.TEXT,
  themeTags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  emotionTags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  audioUrl: DataTypes.STRING,
  relatedVerses: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  religion: {
    type: DataTypes.STRING,
    defaultValue: 'Islam',
  },
  embeddingVector: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    defaultValue: [],
  },
}, {
  tableName: 'quran_verses',
  indexes: [
    { fields: ['surahNumber', 'ayahNumber'] },
    { fields: ['religion'] },
    { fields: ['emotionTags'], using: 'GIN' },
    { fields: ['themeTags'], using: 'GIN' },
  ],
});

export default Quran;