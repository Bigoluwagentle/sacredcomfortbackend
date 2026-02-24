import 'dotenv/config';
import { httpServer } from './app.js';
import connectMongoDB from './config/db.mongo.js';
import { connectPostgres } from './config/db.postgres.js';
import { connectRedis } from './config/redis.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectMongoDB();
    await connectPostgres();
    await connectRedis();

    httpServer.listen(PORT, () => {
      logger.info(`
        ================================================
        🕌  Sacred Comfort API Running
        ================================================
        Environment : ${process.env.NODE_ENV}
        Port        : ${PORT}
        Health      : http://localhost:${PORT}/health
        API Base    : http://localhost:${PORT}/api/v1
        ================================================
      `);
    });

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

startServer();