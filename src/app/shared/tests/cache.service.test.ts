import { describe, expect, test, jest } from '@jest/globals';

import { redis } from '../../config/redis.config.js';
import { getCache, setCache } from '../services/cache.service.js';

describe('Cache Service', () => {
  test('Get and set cache', async () => {
    jest.spyOn(redis, 'get').mockResolvedValue('value');
    jest.spyOn(redis, 'set').mockResolvedValue('OK' as unknown as string);
    const v = await getCache('k1');
    expect(v).toBe('value');
    await setCache('k1', 'value', 10);
    expect(redis.set).toHaveBeenCalled();
  });
});
