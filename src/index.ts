/**
 * Service entrypoint
 */
import swaggerUi from 'swagger-ui-express';
import 'reflect-metadata';

import { initAllConfigs } from './app/config/index.js';
import { registerControllers } from './app/controllers/index.js';
import { generateOpenApi } from './app/config/openapi.js';
import { registerScheduler } from './app/modules/scheduler/index.js';
import { createApp } from './express.js';
import { logger } from './logger.js';
import { ENV } from './variables.js';

const app = createApp();

await initAllConfigs();
registerControllers(app);
await registerScheduler();

const spec = generateOpenApi() as Record<string, unknown>;
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
app.get('/docs.json', (_req, res) => res.json(spec));

app.listen(ENV.APP_PORT, () => {
  logger.info(`Server listening on ${ENV.APP_PORT}`);
});
