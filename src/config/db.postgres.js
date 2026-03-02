import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';

const sequelize = new Sequelize(
  process.env.PG_DATABASE || 'sacred_comfort',
  process.env.PG_USER || 'postgres',
  process.env.PG_PASSWORD ? String(process.env.PG_PASSWORD) : 'Sodiq234',
  {
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT) || 5432,
    dialect: 'postgres',
    logging: (msg) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug(msg);
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL Connected successfully.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('PostgreSQL models synced.');
    }
  } catch (error) {
    logger.error(`PostgreSQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default sequelize;