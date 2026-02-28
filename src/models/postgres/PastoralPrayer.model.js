import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const PastoralPrayer = sequelize.define('PastoralPrayer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pastorName: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  ministryName: {
    type: DataTypes.STRING,
  }, 
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  prayerPoints: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
  }, 
  fullPrayer: {
    type: DataTypes.TEXT,
  },
  declarations: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
  },
  scriptureReferences: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
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
    defaultValue: 'Christianity',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'pastoral_prayers',
  indexes: [
    { fields: ['religion'] },
    { fields: ['pastorName'] },
    { fields: ['emotionTags'], using: 'GIN' },
    { fields: ['themeTags'], using: 'GIN' },
  ],
});

export default PastoralPrayer;