import { describe, expect, test } from '@jest/globals';

import { ENV } from '../../../../variables.js';
import { connectDatabase } from '../../../config/database.config.js';
import { upsertOhlcv } from '../../market-data/repositories/ohlcv.repository.js';
import { generateIndicators } from '../../indicators/services/indicators.service.js';
import { runStrategies } from '../services/strategies.service.js';

describe('Strategies', () => {
  test('Produce signals', async () => {
    await connectDatabase();
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
    await generateIndicators();
    const res = await runStrategies();
    expect(res.length).toBeGreaterThanOrEqual(9);
    const valid = res.every((r) => ['buy', 'sell', 'hold'].includes(r.signal));
    expect(valid).toBe(true);
  });
});
