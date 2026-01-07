/**
 * Redis configuration
 */
import Redis from 'ioredis';

import { ENV } from '../../variables.js';

export const redis = new Redis({
  host: ENV.REDIS_HOST,
  port: ENV.REDIS_PORT,
  lazyConnect: true
});

export const connectRedis = async (): Promise<void> => {
  await redis.connect();
};
