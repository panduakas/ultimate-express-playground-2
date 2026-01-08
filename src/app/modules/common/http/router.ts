import type { Request, Response } from 'express';

type App = {
  get: (path: string, handler: (req: Request, res: Response) => void) => unknown;
  post: (path: string, handler: (req: Request, res: Response) => void) => unknown;
};

type GetOpts = {
  query?: unknown;
  response?: unknown;
  description?: string;
};

type PostOpts = {
  body?: unknown;
  response?: unknown;
  description?: string;
};

export const createApiRouter = (
  app: App
): {
  get: (path: string, opts: GetOpts, handler: (req: Request, res: Response) => void) => void;
  post: (path: string, opts: PostOpts, handler: (req: Request, res: Response) => void) => void;
} => {
  const get = (
    path: string,
    opts: GetOpts,
    handler: (req: Request, res: Response) => void
  ): void => {
    app.get(path, handler);
  };

  const post = (
    path: string,
    opts: PostOpts,
    handler: (req: Request, res: Response) => void
  ): void => {
    app.post(path, handler);
  };

  return { get, post };
};
