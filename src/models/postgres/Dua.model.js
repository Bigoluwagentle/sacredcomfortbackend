import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const Dua = sequelize.define('Dua', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  arabicText: {
    type: DataTypes.TEXT,
    allowNull: false,
  }, 
  transliteration: {
    type: DataTypes.TEXT,
    allowNull: false,
  }, 
  englishMeaning: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  }, // e.g., 'Sahih Bukhari', 'Quran 2:286'
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'duas',
  indexes: [
    { fields: ['religion'] },
    { fields: ['emotionTags'], using: 'GIN' },
    { fields: ['themeTags'], using: 'GIN' },
  ],
});

export default Dua;