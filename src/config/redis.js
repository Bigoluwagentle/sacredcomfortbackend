import { Redis } from '@upstash/redis';
import logger from '../utils/logger.js';

let redisClient = null;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction || (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)) {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  logger.info('Redis Connected (Upstash)');
}

export const connectRedis = async () => {
  if (!redisClient) {
    logger.warn('Redis not configured. Skipping Redis connection.');
    return;
  }
  try {
    await redisClient.ping();
    logger.info('Redis Connected');
  } catch (error) {
    logger.error(`Redis connection failed: ${error.message}`);
  }
};

export const getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
  } catch (error) {
    logger.error(`Redis get error: ${error.message}`);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch (error) {
    logger.error(`Redis set error: ${error.message}`);
  }
};

export const deleteCache = async (key) => {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Redis delete error: ${error.message}`);
  }
};

export const deleteCachePattern = async (pattern) => {
  if (!redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    logger.error(`Redis delete pattern error: ${error.message}`);
  }
};

export default redisClient;