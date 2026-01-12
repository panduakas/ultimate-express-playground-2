/**
 * OHLCV repository
 */

import { OhlcvRowDto } from '../dto/market.dto.js';
import { Ohlcv, type OhlcvCreationAttributes } from '../entities/ohlcv.entity.js';

type OhlcvDTO = OhlcvRowDto;

export class OhlcvRepository {
  async upsertOhlcv(rows: readonly OhlcvCreationAttributes[]): Promise<void> {
    if (!rows.length) return;
    await Ohlcv.bulkCreate(rows as OhlcvCreationAttributes[], {
      updateOnDuplicate: ['open', 'high', 'low', 'close', 'volume'],
      fields: ['symbol', 'timeframeMin', 'time', 'open', 'high', 'low', 'close', 'volume']
    });
  }

  async getLatestOhlcv(symbol: string, timeframeMin: number, limit: number): Promise<OhlcvDTO[]> {
    const res = await Ohlcv.findAll({
      where: { symbol, timeframeMin },
      order: [['time', 'DESC']],
      limit
    });
    return res.reverse().map((r) => ({
      id: r.id,
      symbol: r.symbol,
      timeframeMin: r.timeframeMin,
      time: r.time,
      open: r.open,
      high: r.high,
      low: r.low,
      close: r.close,
      volume: r.volume
    }));
  }
}

export const upsertOhlcv = async (rows: readonly OhlcvCreationAttributes[]): Promise<void> => {
  const repo = new OhlcvRepository();
  return repo.upsertOhlcv(rows);
};

export const getLatestOhlcv = async (
  symbol: string,
  timeframeMin: number,
  limit: number
): Promise<OhlcvDTO[]> => {
  const repo = new OhlcvRepository();
  return repo.getLatestOhlcv(symbol, timeframeMin, limit);
};
