import { describe, expect, test, jest, afterEach } from '@jest/globals';
import axios from 'axios';

import { ENV } from '../../../../variables.js';
import { connectDatabase } from '../../../config/database.config.js';
import { redis } from '../../../config/redis.config.js';
import { Ohlcv } from '../entities/ohlcv.entity.js';
import { syncOhlcv } from '../services/market-data.service.js';

describe('Market Data', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Sync OHLCV from mocked API', async () => {
    await connectDatabase();
    jest.spyOn(redis, 'get').mockResolvedValue(null);
    jest.spyOn(redis, 'set').mockResolvedValue('OK' as unknown as string);
    const now = Math.floor(Date.now() / 1000);
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        s: 'ok',
        t: [now - 3600, now],
        o: [100, 110],
        h: [120, 115],
        l: [90, 105],
        c: [115, 108],
        v: [1, 2]
      }
    } as unknown as { data: unknown });
    await syncOhlcv();
    const count = await Ohlcv.count({
      where: { symbol: ENV.INDODAX_PAIR, timeframeMin: ENV.INDODAX_TIMEFRAME_MIN }
    });
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
