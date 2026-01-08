import type { Request, Response } from 'express';

import { ENV } from '../../../../variables.js';
import { OkResponseDto } from '../../../config/openapi.js';
import { Get, Post } from '../../common/http/decorators.js';
import { parseQuery } from '../../common/utils/controller-utils.js';
import { IndicatorRowDto, IndicatorSeriesQueryDto } from '../dto/indicator.dto.js';
import { IndicatorRepository } from '../repositories/indicator.repository.js';
import { IndicatorService } from '../services/indicators.service.js';

export class IndicatorController {
  constructor(
    private readonly indRepo: IndicatorRepository = new IndicatorRepository(),
    private readonly indSvc: IndicatorService = new IndicatorService()
  ) {}

  @Get('/indicators/series', {
    query: IndicatorSeriesQueryDto,
    response: IndicatorRowDto,
    description: 'Indicator series'
  })
  series = async (req: Request, res: Response): Promise<void> => {
    const parsed = parseQuery(IndicatorSeriesQueryDto, req.query);
    const symbol = parsed.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = parsed.tf ?? ENV.INDODAX_TIMEFRAME_MIN;
    const name = parsed.name ?? 'sma20';
    const limit = parsed.limit ?? 10;
    const rows = await this.indRepo.getIndicatorSeries(symbol, timeframeMin, name, limit);
    const dto = rows.map((r) => new IndicatorRowDto(r as IndicatorRowDto));
    res.json(dto);
  };

  @Post('/indicators/generate', { response: OkResponseDto, description: 'Generate indicators' })
  generate = async (_req: Request, res: Response): Promise<void> => {
    await this.indSvc.generateIndicators();
    res.json(OkResponseDto.sanitize({ ok: true }));
  };
}
