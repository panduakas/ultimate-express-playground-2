/**
 * Redis caching service
 */
import { redis } from '../../../config/redis.config.js';

export const getCache = async (key: string): Promise<string | null> => {
  const val = await redis.get(key);
  return val;
};

export const setCache = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, value, 'EX', ttlSeconds);
  } else {
    await redis.set(key, value);
  }
};
