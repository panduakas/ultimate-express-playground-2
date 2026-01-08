import type { Request, Response } from 'express';

import { Get } from '../../common/http/decorators.js';
import { StrategiesRunResponseDto, StrategyResultDto } from '../dto/strategy.dto.js';
import { StrategiesService } from '../services/strategies.service.js';

export class StrategiesController {
  constructor(private readonly strategies: StrategiesService = new StrategiesService()) {}

  @Get('/strategies/run', { response: StrategiesRunResponseDto, description: 'Run strategies' })
  run = async (_req: Request, res: Response): Promise<void> => {
    const results = await this.strategies.runStrategies();
    const dto = results.map((r) => new StrategyResultDto(r as StrategyResultDto));
    res.json(dto);
  };
}
