/**
 * Indicator repository
 */
import { Indicator, type IndicatorCreationAttributes } from '../entities/indicator.entity.js';

export const upsertIndicators = async (
  rows: readonly IndicatorCreationAttributes[]
): Promise<void> => {
  if (!rows.length) return;
  await Indicator.bulkCreate(rows as IndicatorCreationAttributes[], {
    updateOnDuplicate: ['value'],
    fields: ['symbol', 'timeframeMin', 'time', 'name', 'value']
  });
};

export const getIndicatorSeries = async (
  symbol: string,
  timeframeMin: number,
  name: string,
  limit: number
): Promise<Indicator[]> => {
  const res = await Indicator.findAll({
    where: { symbol, timeframeMin, name },
    order: [['time', 'DESC']],
    limit
  });
  return res.reverse();
};
