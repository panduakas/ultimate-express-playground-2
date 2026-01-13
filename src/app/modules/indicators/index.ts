import { Elysia, t } from 'elysia';

import {
  IndicatorSeriesQuerySchema,
  IndicatorRowSchema,
  GenerateIndicatorsResponseSchema
} from './indicator.schema.js';
import { IndicatorRepository } from './repositories/indicator.repository.js';
import { IndicatorService } from './services/indicators.service.js';
const indService = new IndicatorService();
const indRepo = new IndicatorRepository();

export const indicatorModule = new Elysia({ prefix: '/indicators' })
  .get(
    '/series',
    async ({ query }) => {
      const rows = await indRepo.getIndicatorSeries(
        query.symbol ?? 'BTCIDR',
        query.tf ?? 60,
        query.name ?? 'sma20',
        query.limit ?? 10
      );
      return rows.map((r) => ({
        id: r.id,
        symbol: r.symbol,
        timeframeMin: r.timeframeMin,
        time: r.time,
        name: r.name,
        value: r.value
      }));
    },
    {
      query: IndicatorSeriesQuerySchema,
      response: t.Array(IndicatorRowSchema),
      detail: {
        description: 'Get indicator series data',
        tags: ['Indicators']
      }
    }
  )
  .post(
    '/generate',
    async () => {
      await indService.generateIndicators();
      return { ok: true };
    },
    {
      response: GenerateIndicatorsResponseSchema,
      detail: {
        description: 'Generate indicators',
        tags: ['Indicators']
      }
    }
  );
