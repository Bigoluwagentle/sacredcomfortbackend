import { createClient } from 'redis';
import logger from '../utils/logger.js';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => logger.error(`Redis error: ${err}`));
redisClient.on('connect', () => logger.info('Redis Connected'));
redisClient.on('reconnecting', () => logger.warn('Redis reconnecting...'));

export const connectRedis = async () => {
  await redisClient.connect();
};

export const getCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key, value, ttlSeconds = 3600) => {
  await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
};

export const deleteCache = async (key) => {
  await redisClient.del(key);
};

export const deleteCachePattern = async (pattern) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

export default redisClient;