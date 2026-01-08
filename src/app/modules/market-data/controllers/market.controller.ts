import type { Request, Response } from 'express';

import { ENV } from '../../../../variables.js';
import { OkResponseDto } from '../../../config/openapi.js';
import { Get, Post } from '../../common/http/decorators.js';
import { parseQuery } from '../../common/utils/controller-utils.js';
import { MarketLatestQueryDto, OhlcvRowDto } from '../dto/market.dto.js';
import { OhlcvRepository } from '../repositories/ohlcv.repository.js';
import { MarketDataService } from '../services/market-data.service.js';

export class MarketController {
  constructor(
    private readonly ohlcvRepo: OhlcvRepository = new OhlcvRepository(),
    private readonly marketSvc: MarketDataService = new MarketDataService()
  ) {}

  @Get('/market/latest', {
    query: MarketLatestQueryDto,
    response: OhlcvRowDto,
    description: 'Latest OHLCV'
  })
  latest = async (req: Request, res: Response): Promise<void> => {
    const parsed = parseQuery(MarketLatestQueryDto, req.query);
    const symbol = parsed.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = parsed.tf ?? ENV.INDODAX_TIMEFRAME_MIN;
    const limit = parsed.limit ?? 10;
    const rows = await this.ohlcvRepo.getLatestOhlcv(symbol, timeframeMin, limit);
    const dto = rows.map((r) => new OhlcvRowDto(r as OhlcvRowDto));
    res.json(dto);
  };

  @Post('/market/sync', { response: OkResponseDto, description: 'Sync market data' })
  sync = async (_req: Request, res: Response): Promise<void> => {
    await this.marketSvc.syncOhlcv();
    res.json(OkResponseDto.sanitize({ ok: true }));
  };
}
