/**
 * Indicators calculation and storage
 */
import { ENV } from '../../../../variables.js';
import { OhlcvRepository } from '../../market-data/repositories/ohlcv.repository.js';
import { IndicatorRepository } from '../repositories/indicator.repository.js';

const _sma = (values: readonly number[], period: number): number[] => {
  const out: number[] = [];
  for (const i of values.keys()) {
    if (i + 1 < period) {
      out.push(NaN);
    } else {
      const slice = values.slice(i + 1 - period, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / period;
      out.push(avg);
    }
  }
  return out;
};

const _ema = (values: readonly number[], period: number): number[] => {
  const k = 2 / (period + 1);
  const out: number[] = [];
  for (const i of values.keys()) {
    if (i === 0) {
      out.push(values[i]);
    } else {
      const prev = out[i - 1];
      const next = values[i] * k + prev * (1 - k);
      out.push(next);
    }
  }
  return out;
};

const _rsi = (values: readonly number[], period: number): number[] => {
  const gains: number[] = [];
  const losses: number[] = [];
  for (const i of values.keys()) {
    if (i === 0) {
      gains.push(0);
      losses.push(0);
    } else {
      const diff = values[i] - values[i - 1];
      gains.push(diff > 0 ? diff : 0);
      losses.push(diff < 0 ? -diff : 0);
    }
  }
  const avgGain: number[] = [];
  const avgLoss: number[] = [];
  for (const i of gains.keys()) {
    if (i + 1 < period) {
      avgGain.push(NaN);
      avgLoss.push(NaN);
    } else if (i + 1 === period) {
      const g = gains.slice(1, period).reduce((a, b) => a + b, 0) / period;
      const l = losses.slice(1, period).reduce((a, b) => a + b, 0) / period;
      avgGain.push(g);
      avgLoss.push(l);
    } else {
      const g = (avgGain[i - 1] * (period - 1) + gains[i]) / period;
      const l = (avgLoss[i - 1] * (period - 1) + losses[i]) / period;
      avgGain.push(g);
      avgLoss.push(l);
    }
  }
  const rsi: number[] = [];
  for (const i of avgGain.keys()) {
    if (!Number.isFinite(avgGain[i]) || !Number.isFinite(avgLoss[i])) {
      rsi.push(NaN);
    } else {
      const rs = avgLoss[i] === 0 ? Infinity : avgGain[i] / avgLoss[i];
      const val = 100 - 100 / (1 + rs);
      rsi.push(val);
    }
  }
  return rsi;
};

export class IndicatorService {
  constructor(
    private readonly ohlcvRepo: OhlcvRepository = new OhlcvRepository(),
    private readonly indRepo: IndicatorRepository = new IndicatorRepository()
  ) {}

  async generateIndicators(params: { symbol?: string; timeframe?: number } = {}): Promise<void> {
    const symbol = params.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = params.timeframe ?? ENV.INDODAX_TIMEFRAME_MIN;
    const series = await this.ohlcvRepo.getLatestOhlcv(symbol, timeframeMin, 300);
    if (series.length === 0) {
      return;
    }
    const closes = series.map((r) => r.close);
    const times = series.map((r) => r.time);

    const sma20 = _sma(closes, 20);
    const sma50 = _sma(closes, 50);
    const ema12 = _ema(closes, 12);
    const ema26 = _ema(closes, 26);
    const rsi14 = _rsi(closes, 14);

    const rows = times
      .map((time, idx) => {
        return [
          { symbol, timeframeMin, time, name: 'sma20', value: sma20[idx] },
          { symbol, timeframeMin, time, name: 'sma50', value: sma50[idx] },
          { symbol, timeframeMin, time, name: 'ema12', value: ema12[idx] },
          { symbol, timeframeMin, time, name: 'ema26', value: ema26[idx] },
          { symbol, timeframeMin, time, name: 'rsi14', value: rsi14[idx] }
        ];
      })
      .flat()
      .filter((r) => Number.isFinite(r.value));

    const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - oneMonthMs;
    const eligibleIdxs = times
      .map((t, i) => ({ t, i }))
      .filter(({ t }, i) => i > 0 && t.getTime() >= cutoff)
      .map(({ i }) => i);
    if (eligibleIdxs.length > 0) {
      const wins = eligibleIdxs.reduce((acc, i) => acc + (closes[i] > closes[i - 1] ? 1 : 0), 0);
      const winrate = (wins / eligibleIdxs.length) * 100;
      rows.push({
        symbol,
        timeframeMin,
        time: new Date(),
        name: 'winrate_1m',
        value: winrate
      });
    }
    if (rows.length === 0) {
      return;
    }
    await this.indRepo.upsertIndicators(rows);
  }
}

export const generateIndicators = async (): Promise<void> => {
  const svc = new IndicatorService();
  return svc.generateIndicators();
};
