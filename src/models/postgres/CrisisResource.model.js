import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const CrisisResource = sequelize.define('CrisisResource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  phoneNumber: DataTypes.STRING,
  website: DataTypes.STRING,
  description: DataTypes.TEXT,
  country: {
    type: DataTypes.STRING,
    defaultValue: 'Global',
  },
  region: DataTypes.STRING,
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['English'],
  },
  religion: {
    type: DataTypes.STRING,
    defaultValue: 'All',
  }, 
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'crisis_resources',
  indexes: [
    { fields: ['country'] },
    { fields: ['type'] },
    { fields: ['religion'] },
  ],
});

export default CrisisResource;