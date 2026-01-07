/**
 * Environment variables loader using dotenv-safe
 */
import { config } from 'dotenv-safe';

try {
  config({
    allowEmptyValues: true
  });
} catch {
  // ignore in test/development when .env is absent
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  APP_PORT: Number(process.env.APP_PORT ?? 8080),
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: Number(process.env.DB_PORT ?? 3306),
  DB_NAME: process.env.DB_NAME ?? 'trading_service',
  DB_USER: process.env.DB_USER ?? 'trader',
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',
  REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT ?? 6379),
  MINDSDB_HOST: process.env.MINDSDB_HOST ?? 'localhost',
  MINDSDB_PORT: Number(process.env.MINDSDB_PORT ?? 47335),
  MINDSDB_USER: process.env.MINDSDB_USER ?? 'mindsdb',
  MINDSDB_PASSWORD: process.env.MINDSDB_PASSWORD ?? '',
  INDODAX_PAIR: process.env.INDODAX_PAIR ?? 'BTCIDR',
  INDODAX_TIMEFRAME_MIN: Number(process.env.INDODAX_TIMEFRAME_MIN ?? 60)
} as const;
