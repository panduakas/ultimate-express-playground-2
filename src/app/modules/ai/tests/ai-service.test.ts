import { describe, expect, test, jest } from '@jest/globals';
import * as minds from '../services/ai.service.js';

describe('AI Service', () => {
  test('Builds integration URL', async () => {
    const mockConn: any = {
      execute: jest.fn<() => Promise<[unknown[], unknown[]]>>().mockResolvedValue([[], []]),
      end: jest.fn()
    };
    await minds.trainMindsDbModel({ connection: mockConn });
    expect(mockConn.execute).toHaveBeenCalled();
  });
});
