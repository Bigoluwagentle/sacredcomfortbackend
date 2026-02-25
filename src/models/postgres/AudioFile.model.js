import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const AudioFile = sequelize.define('AudioFile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  verseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reciterName: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  reciterPhoto: DataTypes.STRING,
  voiceStyleDescription: DataTypes.STRING,
  audioUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: DataTypes.INTEGER, 
  religion: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  reference: DataTypes.STRING, 
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'audio_files',
  indexes: [
    { fields: ['verseId'] },
    { fields: ['religion'] },
    { fields: ['reciterName'] },
  ],
});

export default AudioFile;