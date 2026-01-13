import { describe, expect, test, jest } from '@jest/globals';
import type mysql from 'mysql2/promise';

import * as minds from '../services/ai.service.js';

describe('AI Service', () => {
  test('Builds integration URL', async () => {
    const mockConn: Pick<mysql.Connection, 'execute' | 'end'> = {
      execute: jest.fn().mockResolvedValue([[], []]),
      end: jest.fn()
    };
    await minds.trainMindsDbModel({ connection: mockConn });
    expect(mockConn.execute).toHaveBeenCalled();
  });
});
