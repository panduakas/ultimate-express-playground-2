import { Elysia, t } from 'elysia';

import { Signal } from './entities/signal.entity.js';
import { SignalsService } from './services/signals.service.js';
import {
  CalculateSignalResponseSchema,
  SignalRowSchema,
  SignalsLatestQuerySchema
} from './signal.schema.js';
const signalsService = new SignalsService();

export const signalsModule = new Elysia({ prefix: '/signals' })
  .post(
    '/calc',
    async () => {
      await signalsService.calculateAndStoreSignal();
      return { ok: true };
    },
    {
      response: CalculateSignalResponseSchema,
      detail: {
        description: 'Calculate and store signal',
        tags: ['Signals']
      }
    }
  )
  .get(
    '/latest',
    async ({ query }) => {
      const symbol = query.symbol ?? 'BTCIDR';
      const timeframeMin = query.tf ?? 60;
      const saved = await Signal.findOne({
        where: { symbol, timeframeMin },
        order: [['time', 'DESC']]
      });
      if (!saved) return null;
      return {
        id: saved.id,
        symbol: saved.symbol,
        timeframeMin: saved.timeframeMin,
        time: saved.time,
        signal: saved.signal as 'buy' | 'sell' | 'hold',
        predictedPrice: saved.predictedPrice,
        strategyScores: saved.strategyScores
      };
    },
    {
      query: SignalsLatestQuerySchema,
      response: t.Nullable(SignalRowSchema),
      detail: {
        description: 'Get latest signal',
        tags: ['Signals']
      }
    }
  );
