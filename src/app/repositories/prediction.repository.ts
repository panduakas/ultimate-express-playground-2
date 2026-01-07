/**
 * Prediction repository
 */
import { Prediction, type PredictionCreationAttributes } from '../entities/prediction.entity.js';

export const upsertPrediction = async (row: PredictionCreationAttributes): Promise<void> => {
  await Prediction.upsert(row, { conflictFields: ['symbol', 'timeframeMin', 'time'] });
};

export const getLatestPrediction = async (
  symbol: string,
  timeframeMin: number
): Promise<Prediction | null> => {
  const res = await Prediction.findOne({
    where: { symbol, timeframeMin },
    order: [['time', 'DESC']]
  });
  return res;
};
