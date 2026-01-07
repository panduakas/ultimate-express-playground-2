/**
 * Signal engine combining strategies and AI output
 */
import { logger } from '../../../logger.js';
import { ENV } from '../../../variables.js';
import { Signal, type SignalCreationAttributes } from '../../entities/signal.entity.js';
import { getLatestOhlcv } from '../../repositories/ohlcv.repository.js';
import { predictNextPrice } from '../ai/index.js';
import { runStrategies } from '../strategies/index.js';

export const calculateAndStoreSignal = async (): Promise<void> => {
  const strategies = await runStrategies();
  const ai = await predictNextPrice();

  const weights: Record<string, number> = {
    ma_crossover: 1.2,
    rsi_momentum: 1.0,
    scalping: 0.5,
    swing: 1.0,
    trend_following: 0.8,
    range_reversal: 0.8,
    stat_arb: 0.7,
    mean_reversion: 0.7,
    dynamic_grid: 0.5
  };

  const weightedScore = strategies.reduce((acc, s) => acc + s.score * (weights[s.name] ?? 1), 0);

  const aiAdj = await computeAiAdjustment(ai.predicted);
  const finalScore = weightedScore + aiAdj;
  const signal = determineSignal(finalScore);

  const row = buildSignalRow(signal, ai.predicted, strategies);
  await persistSignal(row);
  logger.info(`Signal ${signal} predicted ${ai.predicted}`);
};

const computeAiAdjustment = async (predicted: number): Promise<number> => {
  if (!Number.isFinite(predicted)) return 0;
  const latest = await getLatestOhlcv(ENV.INDODAX_PAIR, ENV.INDODAX_TIMEFRAME_MIN, 1);
  const price = latest.length ? latest[0].close : predicted;
  const diff = (predicted - price) / price;
  return diff * 2;
};

const determineSignal = (score: number): 'buy' | 'sell' | 'hold' => {
  if (score > 0.3) return 'buy';
  if (score < -0.3) return 'sell';
  return 'hold';
};

const buildSignalRow = (
  signal: 'buy' | 'sell' | 'hold',
  predicted: number,
  strategies: readonly { name: string; score: number; signal: 'buy' | 'sell' | 'hold' }[]
): SignalCreationAttributes => ({
  symbol: ENV.INDODAX_PAIR,
  timeframeMin: ENV.INDODAX_TIMEFRAME_MIN,
  time: new Date(),
  signal,
  predictedPrice: predicted,
  strategyScores: JSON.stringify(strategies)
});

const persistSignal = async (row: SignalCreationAttributes): Promise<void> => {
  await Signal.upsert(row, { conflictFields: ['symbol', 'timeframeMin', 'time'] });
};
