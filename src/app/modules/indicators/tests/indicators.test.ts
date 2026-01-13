import { describe, expect, test } from '@jest/globals';

import { ENV } from '../../../../variables.js';
import { connectDatabase } from '../../../config/database.config.js';
import { upsertOhlcv } from '../../market-data/repositories/ohlcv.repository.js';
import { getIndicatorSeries } from '../repositories/indicator.repository.js';
import { generateIndicators } from '../services/indicators.service.js';

describe('Indicators', () => {
  test('SMA/EMA/RSI generated', async () => {
    await connectDatabase();
    const base = 10000;
    const rows = Array.from({ length: 60 }, (_, i) => ({
      symbol: ENV.INDODAX_PAIR,
      timeframeMin: ENV.INDODAX_TIMEFRAME_MIN,
      time: new Date(Date.now() - (60 - i) * 60 * 1000),
      open: base + i,
      high: base + i + 10,
      low: base + i - 10,
      close: base + i + (i % 5),
      volume: 1 + i
    }));
    await upsertOhlcv(rows);
    await generateIndicators();
    const sma20 = await getIndicatorSeries(ENV.INDODAX_PAIR, ENV.INDODAX_TIMEFRAME_MIN, 'sma20', 1);
    const ema12 = await getIndicatorSeries(ENV.INDODAX_PAIR, ENV.INDODAX_TIMEFRAME_MIN, 'ema12', 1);
    const rsi14 = await getIndicatorSeries(ENV.INDODAX_PAIR, ENV.INDODAX_TIMEFRAME_MIN, 'rsi14', 1);
    const win1m = await getIndicatorSeries(
      ENV.INDODAX_PAIR,
      ENV.INDODAX_TIMEFRAME_MIN,
      'winrate_1m',
      1
    );
    expect(sma20.length).toBe(1);
    expect(ema12.length).toBe(1);
    expect(rsi14.length).toBe(1);
    expect(win1m.length).toBe(1);
    expect(Number.isFinite(sma20[0].value)).toBe(true);
    expect(Number.isFinite(ema12[0].value)).toBe(true);
    expect(Number.isFinite(rsi14[0].value)).toBe(true);
    expect(win1m[0].value).toBeGreaterThanOrEqual(0);
    expect(win1m[0].value).toBeLessThanOrEqual(100);
  });
});
