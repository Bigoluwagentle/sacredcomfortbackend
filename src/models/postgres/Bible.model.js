import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const Bible = sequelize.define('Bible', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bookName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chapterNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  verseNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  textKJV: DataTypes.TEXT,
  textNIV: DataTypes.TEXT,
  textESV: DataTypes.TEXT,
  textNRSV: DataTypes.TEXT,
  historicalContext: DataTypes.TEXT,
  themeTags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  emotionTags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  audioUrl: DataTypes.STRING,
  crossReferences: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  religion: {
    type: DataTypes.STRING,
    defaultValue: 'Christianity',
  },
  embeddingVector: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    defaultValue: [],
  },
}, {
  tableName: 'bible_verses',
  indexes: [
    { fields: ['bookName', 'chapterNumber', 'verseNumber'] },
    { fields: ['religion'] },
    { fields: ['emotionTags'], using: 'GIN' },
    { fields: ['themeTags'], using: 'GIN' },
  ],
});

export default Bible;