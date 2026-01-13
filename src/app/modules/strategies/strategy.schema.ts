import { t } from 'elysia';

export const StrategyResultSchema = t.Object({
  name: t.String(),
  score: t.Number(),
  signal: t.Union([t.Literal('buy'), t.Literal('sell'), t.Literal('hold')])
});
