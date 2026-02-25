import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const Therapist = sequelize.define('Therapist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qualifications: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  specializations: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  }, 
  religiousBackground: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  photo: DataTypes.STRING,
  bio: DataTypes.TEXT,
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['English'],
  },
  videoCallPlatform: {
    type: DataTypes.STRING,
    defaultValue: 'Zoom',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'therapists',
  indexes: [
    { fields: ['religiousBackground'] },
    { fields: ['isVerified', 'isActive'] },
    { fields: ['specializations'], using: 'GIN' },
  ],
});

export default Therapist;