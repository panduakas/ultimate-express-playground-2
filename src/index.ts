import { cors } from '@elysiajs/cors';
import { opentelemetry } from '@elysiajs/opentelemetry';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { initAllConfigs } from './app/config/index.js';
import { aiModule } from './app/modules/ai/index.js';
import { indicatorModule } from './app/modules/indicators/index.js';
import { marketModule } from './app/modules/market-data/index.js';
import { registerScheduler } from './app/modules/scheduler/index.js';
import { signalsModule } from './app/modules/signals/index.js';
import { strategiesModule } from './app/modules/strategies/index.js';
import { logger } from './logger.js';
import { ENV } from './variables.js';

await initAllConfigs();
await registerScheduler();

const app = new Elysia()
  .use(opentelemetry({ serviceName: 'ultimate-trading-service' }))
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Ultimate Trading Service',
          version: '1.0.0',
          description: 'Production-ready backend microservice with ElysiaJS'
        },
        tags: [
          { name: 'Market Data', description: 'OHLCV and Market Data operations' },
          { name: 'Indicators', description: 'Technical Indicators' },
          { name: 'AI', description: 'MindsDB AI Integration' },
          { name: 'Signals', description: 'Trading Signals' },
          { name: 'Strategies', description: 'Trading Strategies' }
        ]
      }
    })
  )
  .use(marketModule)
  .use(indicatorModule)
  .use(aiModule)
  .use(signalsModule)
  .use(strategiesModule)
  .listen(Number(ENV.APP_PORT) || 3000);

logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
