/**
 * Prediction repository
 */
import { Prediction, type PredictionCreationAttributes } from '../entities/prediction.entity.js';

export class PredictionRepository {
  async upsertPrediction(row: PredictionCreationAttributes): Promise<void> {
    await Prediction.upsert(row, { conflictFields: ['symbol', 'timeframeMin', 'time'] });
  }

  async getLatestPrediction(symbol: string, timeframeMin: number): Promise<Prediction | null> {
    const res = await Prediction.findOne({
      where: { symbol, timeframeMin },
      order: [['time', 'DESC']]
    });
    return res;
  }
}

export const upsertPrediction = async (row: PredictionCreationAttributes): Promise<void> => {
  const repo = new PredictionRepository();
  return repo.upsertPrediction(row);
};

export const getLatestPrediction = async (
  symbol: string,
  timeframeMin: number
): Promise<Prediction | null> => {
  const repo = new PredictionRepository();
  return repo.getLatestPrediction(symbol, timeframeMin);
};
