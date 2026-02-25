import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const Hadith = sequelize.define('Hadith', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  collection: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  bookName: DataTypes.STRING,
  hadithNumber: DataTypes.STRING,
  arabicText: DataTypes.TEXT,
  englishTranslation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    defaultValue: 'Sahih',
  }, 
  themeTags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  emotionTags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
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
  tableName: 'hadiths',
  indexes: [
    { fields: ['religion'] },
    { fields: ['emotionTags'], using: 'GIN' },
    { fields: ['themeTags'], using: 'GIN' },
  ],
});

export default Hadith;