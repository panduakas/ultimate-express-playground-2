import { Elysia } from 'elysia';

import { AiPredictResponseSchema, TrainModelResponseSchema } from './ai.schema.js';
import { AiService } from './services/ai.service.js';

const aiService = new AiService();

export const aiModule = new Elysia({ prefix: '/ai' })
  .post(
    '/train',
    async () => {
      await aiService.trainMindsDbModel();
      return { ok: true };
    },
    {
      response: TrainModelResponseSchema,
      detail: {
        description: 'Train AI model',
        tags: ['AI']
      }
    }
  )
  .get(
    '/predict',
    async () => {
      const pred = await aiService.predictNextPrice();
      return {
        predicted: pred.predicted,
        confidence: pred.confidence
      };
    },
    {
      response: AiPredictResponseSchema,
      detail: {
        description: 'Predict next price',
        tags: ['AI']
      }
    }
  );
