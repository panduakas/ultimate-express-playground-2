import type { Request, Response } from 'express';

import { ENV } from '../../variables.js';
import {
  MarketLatestQuery,
  IndicatorSeriesQuery,
  SignalsLatestQuery,
  OkResponse
} from '../dto/openapi.js';
import { Signal } from '../entities/signal.entity.js';
import { trainMindsDbModel, predictNextPrice } from '../modules/ai/index.js';
import { generateIndicators } from '../modules/indicators/index.js';
import { syncOhlcv } from '../modules/market-data/index.js';
import { calculateAndStoreSignal } from '../modules/signals/index.js';
import { runStrategies } from '../modules/strategies/index.js';
import { getIndicatorSeries } from '../repositories/indicator.repository.js';
import { getLatestOhlcv } from '../repositories/ohlcv.repository.js';

type App = {
  get: (path: string, handler: (req: Request, res: Response) => void) => unknown;
  post: (path: string, handler: (req: Request, res: Response) => void) => unknown;
  use: (mw: (req: Request, res: Response, next: () => void) => void) => unknown;
};

export const registerControllers = (app: App): void => {
  app.get('/market/latest', async (req: Request, res: Response) => {
    const parsed = MarketLatestQuery.parse(req.query);
    const symbol = parsed.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = parsed.tf ?? ENV.INDODAX_TIMEFRAME_MIN;
    const limit = parsed.limit ?? 10;
    const rows = await getLatestOhlcv(symbol, timeframeMin, limit);
    res.json(rows);
  });

  app.post('/market/sync', async (_req: Request, res: Response) => {
    await syncOhlcv();
    res.json(OkResponse.parse({ ok: true }));
  });

  app.get('/indicators/series', async (req: Request, res: Response) => {
    const parsed = IndicatorSeriesQuery.parse(req.query);
    const symbol = parsed.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = parsed.tf ?? ENV.INDODAX_TIMEFRAME_MIN;
    const name = parsed.name ?? 'sma20';
    const limit = parsed.limit ?? 10;
    const rows = await getIndicatorSeries(symbol, timeframeMin, name, limit);
    res.json(rows);
  });

  app.post('/indicators/generate', async (_req: Request, res: Response) => {
    await generateIndicators();
    res.json(OkResponse.parse({ ok: true }));
  });

  app.post('/ai/train', async (_req: Request, res: Response) => {
    await trainMindsDbModel();
    res.json(OkResponse.parse({ ok: true }));
  });

  app.get('/ai/predict', async (_req: Request, res: Response) => {
    const pred = await predictNextPrice();
    res.json(pred);
  });

  app.post('/signals/calc', async (_req: Request, res: Response) => {
    await calculateAndStoreSignal();
    res.json(OkResponse.parse({ ok: true }));
  });

  app.get('/signals/latest', async (req: Request, res: Response) => {
    const parsed = SignalsLatestQuery.parse(req.query);
    const symbol = parsed.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = parsed.tf ?? ENV.INDODAX_TIMEFRAME_MIN;
    const saved = await Signal.findOne({
      where: { symbol, timeframeMin },
      order: [['time', 'DESC']]
    });
    res.json(saved ?? null);
  });

  app.get('/strategies/run', async (_req: Request, res: Response) => {
    const results = await runStrategies();
    res.json(results);
  });
};
