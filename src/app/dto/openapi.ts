import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export const MarketLatestQuery = z.object({
  symbol: z.string().default('BTCIDR'),
  tf: z.coerce.number().int().default(60),
  limit: z.coerce.number().int().min(1).max(500).default(10)
});

export const OhlcvRow = z.object({
  id: z.number().optional(),
  symbol: z.string(),
  timeframeMin: z.number().int(),
  time: z.string().datetime(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number()
});
export const OhlcvResponse = z.array(OhlcvRow);

export const OkResponse = z.object({ ok: z.literal(true) });

export const IndicatorSeriesQuery = z.object({
  symbol: z.string().default('BTCIDR'),
  tf: z.coerce.number().int().default(60),
  name: z.string().default('sma20'),
  limit: z.coerce.number().int().min(1).max(500).default(10)
});

export const IndicatorRow = z.object({
  id: z.number().optional(),
  symbol: z.string(),
  timeframeMin: z.number().int(),
  time: z.string().datetime(),
  name: z.string(),
  value: z.number()
});
export const IndicatorResponse = z.array(IndicatorRow);

export const AiPredictResponse = z.object({
  predicted: z.number(),
  confidence: z.number()
});

export const SignalsLatestQuery = z.object({
  symbol: z.string().default('BTCIDR'),
  tf: z.coerce.number().int().default(60)
});

export const SignalRow = z.object({
  id: z.number().optional(),
  symbol: z.string(),
  timeframeMin: z.number().int(),
  time: z.string().datetime(),
  signal: z.enum(['buy', 'sell', 'hold']),
  predictedPrice: z.number(),
  strategyScores: z.string()
});

export const StrategyResult = z.object({
  name: z.string(),
  score: z.number(),
  signal: z.enum(['buy', 'sell', 'hold'])
});
export const StrategiesRunResponse = z.array(StrategyResult);

export const registry = new OpenAPIRegistry();

registry.register('OhlcvRow', OhlcvRow);
registry.register('OhlcvResponse', OhlcvResponse);
registry.register('IndicatorRow', IndicatorRow);
registry.register('IndicatorResponse', IndicatorResponse);
registry.register('AiPredictResponse', AiPredictResponse);
registry.register('SignalRow', SignalRow);
registry.register('OkResponse', OkResponse);
registry.register('StrategyResult', StrategyResult);

registry.registerPath({
  method: 'get',
  path: '/market/latest',
  request: {
    query: MarketLatestQuery
  },
  responses: {
    200: {
      description: 'Latest OHLCV',
      content: { 'application/json': { schema: OhlcvResponse } }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/market/sync',
  responses: {
    200: {
      description: 'Sync triggered',
      content: { 'application/json': { schema: OkResponse } }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/indicators/series',
  request: { query: IndicatorSeriesQuery },
  responses: {
    200: {
      description: 'Indicator series',
      content: { 'application/json': { schema: IndicatorResponse } }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/indicators/generate',
  responses: {
    200: {
      description: 'Generation triggered',
      content: { 'application/json': { schema: OkResponse } }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/ai/train',
  responses: {
    200: {
      description: 'Training triggered',
      content: { 'application/json': { schema: OkResponse } }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/ai/predict',
  responses: {
    200: {
      description: 'Prediction',
      content: { 'application/json': { schema: AiPredictResponse } }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/signals/calc',
  responses: {
    200: {
      description: 'Calculation triggered',
      content: { 'application/json': { schema: OkResponse } }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/signals/latest',
  request: { query: SignalsLatestQuery },
  responses: {
    200: {
      description: 'Latest signal',
      content: { 'application/json': { schema: SignalRow } }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/strategies/run',
  responses: {
    200: {
      description: 'Strategy results',
      content: { 'application/json': { schema: StrategiesRunResponse } }
    }
  }
});

export const generateOpenApi = (): unknown => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Ultimate Trading Service API',
      version: '1.0.0'
    }
  });
};
