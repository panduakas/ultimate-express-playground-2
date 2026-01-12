import type { Request, Response } from 'express';

import { AiController } from '../modules/ai/controllers/ai.controller.js';
import { getControllerRoutes } from '../modules/common/http/decorators.js';
import { createApiRouter } from '../modules/common/http/router.js';
import { IndicatorController } from '../modules/indicators/controllers/indicator.controller.js';
import { MarketController } from '../modules/market-data/controllers/market.controller.js';
import { SignalsController } from '../modules/signals/controllers/signals.controller.js';
import { StrategiesController } from '../modules/strategies/controllers/strategies.controller.js';

type App = {
  get: (path: string, handler: (req: Request, res: Response) => void) => unknown;
  post: (path: string, handler: (req: Request, res: Response) => void) => unknown;
  use: (mw: (req: Request, res: Response, next: () => void) => void) => unknown;
};

export const registerControllers = (app: App): void => {
  const router = createApiRouter(app);
  const ctrls: Array<
    MarketController | IndicatorController | AiController | SignalsController | StrategiesController
  > = [
    new MarketController(),
    new IndicatorController(),
    new AiController(),
    new SignalsController(),
    new StrategiesController()
  ];
  for (const c of ctrls) {
    const routes = getControllerRoutes(c.constructor);
    for (const r of routes) {
      const handler = (
        ((c as unknown) as Record<string | symbol, unknown>)[r.handlerName] as (
          req: Request,
          res: Response
        ) => Promise<void>
      ).bind(c);
      if (r.method === 'get') {
        router.get(
          r.path,
          {
            query: r.query ?? undefined,
            response: r.response ?? undefined,
            description: r.description
          },
          handler
        );
      } else {
        router.post(
          r.path,
          {
            body: r.body ?? undefined,
            response: r.response ?? undefined,
            description: r.description
          },
          handler
        );
      }
    }
  }
};
