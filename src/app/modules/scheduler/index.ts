/**
 * Hourly scheduler orchestrating the pipeline
 */
import { everyHour } from '../../config/cron.config.js';
import { trainMindsDbModel } from '../ai/index.js';
import { generateIndicators } from '../indicators/index.js';
import { syncOhlcv } from '../market-data/index.js';
import { calculateAndStoreSignal } from '../signals/index.js';

export const registerScheduler = async (): Promise<void> => {
  everyHour(async () => {
    await syncOhlcv();
    await generateIndicators();
    await trainMindsDbModel();
    await calculateAndStoreSignal();
  });
};
