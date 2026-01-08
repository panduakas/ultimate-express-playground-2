import { describe, expect, test, jest, afterEach } from '@jest/globals';

import * as ai from '../../ai/services/ai.service.js';
import { ENV } from '../../../../variables.js';
import { upsertOhlcv } from '../../market-data/repositories/ohlcv.repository.js';
import { calculateAndStoreSignal } from '../services/signals.service.js';
import { Signal } from '../entities/signal.entity.js';
import { connectDatabase } from '../../../config/database.config.js';

describe('Signal Engine', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Stores final signal', async () => {
    await connectDatabase();
    jest.spyOn(ai, 'predictNextPrice').mockResolvedValue({ predicted: 10100, confidence: 0.8 });
    const base = 10000;
    const rows = Array.from({ length: 80 }, (_, i) => ({
      symbol: ENV.INDODAX_PAIR,
      timeframeMin: ENV.INDODAX_TIMEFRAME_MIN,
      time: new Date(Date.now() - (80 - i) * 60 * 1000),
      open: base + i,
      high: base + i + 10,
      low: base + i - 10,
      close: base + i + (i % 3),
      volume: 1 + i
    }));
    await upsertOhlcv(rows);
    await calculateAndStoreSignal();
    const saved = await Signal.findOne({
      where: { symbol: ENV.INDODAX_PAIR },
      order: [['time', 'DESC']]
    });
    expect(saved).not.toBeNull();
    expect(['buy', 'sell', 'hold'].includes(saved!.signal)).toBe(true);
  });
});
