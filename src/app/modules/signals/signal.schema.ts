import { t } from 'elysia';

export const SignalsLatestQuerySchema = t.Object({
  symbol: t.Optional(t.String()),
  tf: t.Optional(t.Numeric({ default: 60 }))
});

export const SignalRowSchema = t.Object({
  id: t.Optional(t.Number()),
  symbol: t.String(),
  timeframeMin: t.Number(),
  time: t.Date(),
  signal: t.Union([t.Literal('buy'), t.Literal('sell'), t.Literal('hold')]),
  predictedPrice: t.Number(),
  strategyScores: t.String()
});

export const CalculateSignalResponseSchema = t.Object({
  ok: t.Boolean()
});
