import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const Philosophy = sequelize.define('Philosophy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  philosopher: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  quoteText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  context: DataTypes.TEXT,
  philosophyType: {
    type: DataTypes.STRING,
    allowNull: false,
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
    defaultValue: 'Other',
  },
  embeddingVector: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    defaultValue: [],
  },
}, {
  tableName: 'philosophy_quotes',
  indexes: [
    { fields: ['religion'] },
    { fields: ['philosophyType'] },
    { fields: ['emotionTags'], using: 'GIN' },
    { fields: ['themeTags'], using: 'GIN' },
  ],
});

export default Philosophy;