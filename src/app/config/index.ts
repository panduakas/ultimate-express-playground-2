/**
 * Initialize core configs: DB, Redis
 */
import { connectDatabase } from './database.config.js';
import { connectRedis } from './redis.config.js';

export const initAllConfigs = async (): Promise<void> => {
  await connectDatabase();
  await connectRedis();
};
