import { t } from 'elysia';

export const IndicatorSeriesQuerySchema = t.Object({
  symbol: t.Optional(t.String()),
  tf: t.Optional(t.Numeric({ default: 60 })),
  name: t.Optional(t.String()),
  limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 500 }))
});

export const IndicatorRowSchema = t.Object({
  id: t.Optional(t.Number()),
  symbol: t.String(),
  timeframeMin: t.Number(),
  time: t.Date(),
  name: t.String(),
  value: t.Number()
});

export const GenerateIndicatorsResponseSchema = t.Object({
  ok: t.Boolean()
});
