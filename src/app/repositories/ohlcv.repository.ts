/**
 * OHLCV repository
 */
import { Ohlcv, type OhlcvCreationAttributes } from '../entities/ohlcv.entity.js';

export const upsertOhlcv = async (rows: readonly OhlcvCreationAttributes[]): Promise<void> => {
  if (!rows.length) return;
  await Ohlcv.bulkCreate(rows as OhlcvCreationAttributes[], {
    updateOnDuplicate: ['open', 'high', 'low', 'close', 'volume'],
    fields: ['symbol', 'timeframeMin', 'time', 'open', 'high', 'low', 'close', 'volume']
  });
};

export const getLatestOhlcv = async (
  symbol: string,
  timeframeMin: number,
  limit: number
): Promise<Ohlcv[]> => {
  const res = await Ohlcv.findAll({
    where: { symbol, timeframeMin },
    order: [['time', 'DESC']],
    limit
  });
  return res.reverse();
};
