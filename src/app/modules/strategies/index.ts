import { Elysia, t } from 'elysia';

import { StrategiesService } from './services/strategies.service.js';
import { StrategyResultSchema } from './strategy.schema.js';

const strategiesService = new StrategiesService();

export const strategiesModule = new Elysia({ prefix: '/strategies' }).get(
  '/run',
  async () => {
    const results = await strategiesService.runStrategies();
    return results.map((r) => ({
      name: r.name,
      score: r.score,
      signal: r.signal as 'buy' | 'sell' | 'hold'
    }));
  },
  {
    response: t.Array(StrategyResultSchema),
    detail: {
      description: 'Run strategies',
      tags: ['Strategies']
    }
  }
);
