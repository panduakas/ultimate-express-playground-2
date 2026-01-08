/**
 * Hourly scheduler orchestrating the pipeline
 */
import { everyHour } from '../../config/cron.config.js';
import { trainMindsDbModel } from '../ai/services/ai.service.js';
import { generateIndicators } from '../indicators/services/indicators.service.js';
import { syncOhlcv } from '../market-data/services/market-data.service.js';
import { calculateAndStoreSignal } from '../signals/services/signals.service.js';

export const registerScheduler = async (): Promise<void> => {
  everyHour(async () => {
    await syncOhlcv();
    await generateIndicators();
    await trainMindsDbModel();
    await calculateAndStoreSignal();
  });
};
