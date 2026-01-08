import { describe, expect, test, jest } from '@jest/globals';

import { predictNextPrice } from '../services/ai.service.js';

describe('AI Predict', () => {
  test('Uses provided connection', async () => {
    const mockConn: any = {
      execute: jest.fn().mockResolvedValue([[{ predicted: 20000, confidence: 0.7 }]]),
      end: jest.fn()
    };
    const res = await predictNextPrice({ connection: mockConn });
    expect(res.predicted).toBe(20000);
    expect(res.confidence).toBe(0.7);
    expect(mockConn.execute).toHaveBeenCalled();
    expect(mockConn.end).not.toHaveBeenCalled();
  });
});
