import { t } from 'elysia';

export const AiPredictResponseSchema = t.Object({
  predicted: t.Number(),
  confidence: t.Number()
});

export const TrainModelResponseSchema = t.Object({
  ok: t.Boolean()
});
