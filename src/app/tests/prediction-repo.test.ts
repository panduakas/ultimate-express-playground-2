import { describe, expect, test } from '@jest/globals';

import { ENV } from '../../variables.js';
import { connectDatabase } from '../config/database.config.js';
import { upsertPrediction, getLatestPrediction } from '../repositories/prediction.repository.js';

describe('Prediction Repository', () => {
  test('Upsert and get latest', async () => {
    await connectDatabase();
    const now = new Date();
    await upsertPrediction({
      symbol: ENV.INDODAX_PAIR,
      timeframeMin: ENV.INDODAX_TIMEFRAME_MIN,
      time: now,
      predictedPrice: 12345.67,
      modelName: 'test_model',
      confidence: 0.9
    });
    const latest = await getLatestPrediction(ENV.INDODAX_PAIR, ENV.INDODAX_TIMEFRAME_MIN);
    expect(latest).not.toBeNull();
    expect(latest!.predictedPrice).toBeCloseTo(12345.67);
    expect(latest!.modelName).toBe('test_model');
  });
});
