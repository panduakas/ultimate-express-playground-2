import type { Request, Response } from 'express';

import { OkResponseDto } from '../../../config/openapi.js';
import { Get, Post } from '../../common/http/decorators.js';
import { AiPredictResponseDto } from '../dto/ai.dto.js';
import { AiService } from '../services/ai.service.js';

export class AiController {
  constructor(private readonly ai: AiService = new AiService()) {}

  @Post('/ai/train', { response: OkResponseDto, description: 'Train AI model' })
  train = async (_req: Request, res: Response): Promise<void> => {
    await this.ai.trainMindsDbModel();
    res.json(OkResponseDto.sanitize({ ok: true }));
  };

  @Get('/ai/predict', { response: AiPredictResponseDto, description: 'Predict next price' })
  predict = async (_req: Request, res: Response): Promise<void> => {
    const pred = await this.ai.predictNextPrice();
    const dto = new AiPredictResponseDto(pred as AiPredictResponseDto);
    res.json(dto);
  };
}
