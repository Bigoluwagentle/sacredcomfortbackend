import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.postgres.js';

const TherapistAvailability = sequelize.define('TherapistAvailability', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  therapistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }, 
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  }, 
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  }, 
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  bookedDate: DataTypes.DATEONLY, 
}, {
  tableName: 'therapist_availability',
  indexes: [
    { fields: ['therapistId'] },
    { fields: ['therapistId', 'dayOfWeek'] },
    { fields: ['isBooked'] },
  ],
});

export default TherapistAvailability;