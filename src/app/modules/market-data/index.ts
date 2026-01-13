import { Elysia, t } from 'elysia';

import {
  MarketLatestQuerySchema,
  OhlcvRowSchema,
  SyncOhlcvResponseSchema
} from './market.schema.js';
import { OhlcvRepository } from './repositories/ohlcv.repository.js';
import { MarketDataService } from './services/market-data.service.js';
const marketService = new MarketDataService();
const ohlcvRepo = new OhlcvRepository();

export const marketModule = new Elysia({ prefix: '/market' })
  .get(
    '/latest',
    async ({ query }) => {
      const rows = await ohlcvRepo.getLatestOhlcv(
        query.symbol ?? 'BTCIDR',
        query.tf ?? 60,
        query.limit ?? 10
      );
      return rows.map((r) => ({
        id: r.id,
        symbol: r.symbol,
        timeframeMin: r.timeframeMin,
        time: r.time,
        open: r.open,
        high: r.high,
        low: r.low,
        close: r.close,
        volume: r.volume
      }));
    },
    {
      query: MarketLatestQuerySchema,
      response: t.Array(OhlcvRowSchema),
      detail: {
        description: 'Get latest OHLCV data',
        tags: ['Market Data']
      }
    }
  )
  .post(
    '/sync',
    async () => {
      await marketService.syncOhlcv();
      return { ok: true };
    },
    {
      response: SyncOhlcvResponseSchema,
      detail: {
        description: 'Sync market data from external source',
        tags: ['Market Data']
      }
    }
  );
