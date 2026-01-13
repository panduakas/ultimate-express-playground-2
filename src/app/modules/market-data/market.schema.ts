import { t } from 'elysia';

export const MarketLatestQuerySchema = t.Object({
  symbol: t.Optional(t.String()),
  tf: t.Optional(t.Numeric({ default: 60 })),
  limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 500 }))
});

export const OhlcvRowSchema = t.Object({
  id: t.Optional(t.Number()),
  symbol: t.String(),
  timeframeMin: t.Number(),
  time: t.Date(),
  open: t.Number(),
  high: t.Number(),
  low: t.Number(),
  close: t.Number(),
  volume: t.Number()
});

export const SyncOhlcvResponseSchema = t.Object({
  ok: t.Boolean()
});
