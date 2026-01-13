/**
 * Indicator repository
 */

import { Indicator, type IndicatorCreationAttributes } from '../entities/indicator.entity.js';

export type IndicatorRow = {
  id?: number;
  symbol: string;
  timeframeMin: number;
  time: Date;
  name: string;
  value: number;
};

export class IndicatorRepository {
  async upsertIndicators(rows: readonly IndicatorCreationAttributes[]): Promise<void> {
    if (!rows.length) return;
    await Indicator.bulkCreate(rows as IndicatorCreationAttributes[], {
      updateOnDuplicate: ['value'],
      fields: ['symbol', 'timeframeMin', 'time', 'name', 'value']
    });
  }

  async getIndicatorSeries(
    symbol: string,
    timeframeMin: number,
    name: string,
    limit: number
  ): Promise<IndicatorRow[]> {
    const res = await Indicator.findAll({
      where: { symbol, timeframeMin, name },
      order: [['time', 'DESC']],
      limit
    });
    return res.reverse().map((r) => ({
      id: r.id,
      symbol: r.symbol,
      timeframeMin: r.timeframeMin,
      time: r.time,
      name: r.name,
      value: r.value
    }));
  }
}

export const upsertIndicators = async (
  rows: readonly IndicatorCreationAttributes[]
): Promise<void> => {
  const repo = new IndicatorRepository();
  return repo.upsertIndicators(rows);
};

export const getIndicatorSeries = async (
  symbol: string,
  timeframeMin: number,
  name: string,
  limit: number
): Promise<IndicatorRow[]> => {
  const repo = new IndicatorRepository();
  return repo.getIndicatorSeries(symbol, timeframeMin, name, limit);
};
