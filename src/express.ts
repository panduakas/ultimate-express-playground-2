/**
 * Ultimate Express application using the ultimate-express framework
 */
import type { Request, Response } from 'express';
import express from 'ultimate-express';
type UltimateApp = ReturnType<typeof express>;

export const createApp = (): UltimateApp => {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });
  return app;
};
