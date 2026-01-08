import type { Request, Response } from 'express';

import { ENV } from '../../../../variables.js';
import { OkResponseDto } from '../../../config/openapi.js';
import { Get, Post } from '../../common/http/decorators.js';
import { parseQuery } from '../../common/utils/controller-utils.js';
import { SignalRowDto, SignalsLatestQueryDto } from '../dto/signal.dto.js';
import { Signal } from '../entities/signal.entity.js';
import { SignalsService } from '../services/signals.service.js';

export class SignalsController {
  constructor(private readonly signals: SignalsService = new SignalsService()) {}

  @Post('/signals/calc', { response: OkResponseDto, description: 'Calculate and store signal' })
  calc = async (_req: Request, res: Response): Promise<void> => {
    await this.signals.calculateAndStoreSignal();
    res.json(OkResponseDto.sanitize({ ok: true }));
  };

  @Get('/signals/latest', {
    query: SignalsLatestQueryDto,
    response: SignalRowDto,
    description: 'Latest signal'
  })
  latest = async (req: Request, res: Response): Promise<void> => {
    const parsed = parseQuery(SignalsLatestQueryDto, req.query);
    const symbol = parsed.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = parsed.tf ?? ENV.INDODAX_TIMEFRAME_MIN;
    const saved = await Signal.findOne({
      where: { symbol, timeframeMin },
      order: [['time', 'DESC']]
    });
    if (saved == null) {
      res.json(null);
      return;
    }
    const dto = new SignalRowDto({
      id: saved.id,
      symbol: saved.symbol,
      timeframeMin: saved.timeframeMin,
      time: saved.time,
      signal: saved.signal,
      predictedPrice: saved.predictedPrice,
      strategyScores: saved.strategyScores
    } as SignalRowDto);
    res.json(dto);
  };
}
