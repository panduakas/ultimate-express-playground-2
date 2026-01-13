/**
 * Signal engine combining strategies and AI output
 */
import { logger } from '../../../../logger.js';
import { ENV } from '../../../../variables.js';
import { predictNextPrice } from '../../ai/services/ai.service.js';
import { OhlcvRepository } from '../../market-data/repositories/ohlcv.repository.js';
import { runStrategies } from '../../strategies/services/strategies.service.js';
import { Signal, type SignalCreationAttributes } from '../entities/signal.entity.js';

export class SignalsService {
  constructor(private readonly ohlcvRepo: OhlcvRepository = new OhlcvRepository()) {}

  async calculateAndStoreSignal(
    params: { symbol?: string; timeframe?: number } = {}
  ): Promise<void> {
    const symbol = params.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = params.timeframe ?? ENV.INDODAX_TIMEFRAME_MIN;

    const strategies = await runStrategies({ symbol, timeframe: timeframeMin });
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

    const aiAdj = await this.computeAiAdjustment(ai.predicted);
    const finalScore = weightedScore + aiAdj;
    const signal = determineSignal(finalScore);

    const row = buildSignalRow(signal, ai.predicted, strategies, symbol, timeframeMin);
    await persistSignal(row);
    logger.info(`Signal ${signal} predicted ${ai.predicted}`);
  }

  private async computeAiAdjustment(predicted: number): Promise<number> {
    if (!Number.isFinite(predicted)) return 0;
    const latest = await this.ohlcvRepo.getLatestOhlcv(
      ENV.INDODAX_PAIR,
      ENV.INDODAX_TIMEFRAME_MIN,
      1
    );
    const price = latest.length ? latest[0].close : predicted;
    const diff = (predicted - price) / price;
    return diff * 2;
  }
}

export const calculateAndStoreSignal = async (
  params: { symbol?: string; timeframe?: number } = {}
): Promise<void> => {
  const svc = new SignalsService();
  return svc.calculateAndStoreSignal(params);
};

const determineSignal = (score: number): 'buy' | 'sell' | 'hold' => {
  if (score > 0.3) return 'buy';
  if (score < -0.3) return 'sell';
  return 'hold';
};

const buildSignalRow = (
  signal: 'buy' | 'sell' | 'hold',
  predicted: number,
  strategies: readonly { name: string; score: number; signal: 'buy' | 'sell' | 'hold' }[],
  symbol: string,
  timeframeMin: number
): SignalCreationAttributes => ({
  symbol,
  timeframeMin,
  time: new Date(),
  signal,
  predictedPrice: predicted,
  strategyScores: JSON.stringify(strategies)
});

const persistSignal = async (row: SignalCreationAttributes): Promise<void> => {
  const found = await Signal.findOne({
    where: {
      symbol: row.symbol,
      timeframeMin: row.timeframeMin,
      time: row.time
    }
  });
  if (found) {
    await found.update(row);
  } else {
    await Signal.create(row);
  }
};
