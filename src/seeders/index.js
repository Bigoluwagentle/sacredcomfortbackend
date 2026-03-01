import dotenv from 'dotenv';
dotenv.config();

import connectMongo from '../config/db.mongo.js';
import { sequelize } from '../models/postgres/index.js';
import { seedQuran } from './quran.seeder.js';
import { seedBible } from './bible.seeder.js';
import { seedDuas } from './dua.seeder.js';
import { seedPastoralPrayers } from './pastoralPrayer.seeder.js';
import { seedPhilosophy } from './philosophy.seeder.js';
import { seedCrisisResources } from './crisisResource.seeder.js';
import { seedAudioFiles } from './audio.seeder.js';
import logger from '../utils/logger.js';

const runSeeders = async () => {
  try {
    logger.info('🌱 Starting database seeding...');

    await connectMongo();
    await sequelize.authenticate();
    logger.info('✅ Databases connected.');

    logger.info('Seeding Crisis Resources...');
    await seedCrisisResources();

    logger.info('Seeding Du\'as...');
    await seedDuas();

    logger.info('Seeding Pastoral Prayers...');
    await seedPastoralPrayers();

    logger.info('Seeding Philosophy Quotes...');
    await seedPhilosophy();

    logger.info('Seeding Audio Files...');
    await seedAudioFiles();

    logger.info('Seeding Bible (this may take a while)...');
    await seedBible();

    logger.info('Seeding Quran (this may take a while)...');
    await seedQuran();

    logger.info('🎉 All seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

runSeeders();