/**
 * Trading strategies suite
 */
import { ENV } from '../../../../variables.js';
import { getIndicatorSeries } from '../../indicators/repositories/indicator.repository.js';
import { getLatestOhlcv } from '../../market-data/repositories/ohlcv.repository.js';

export interface StrategyResult {
  name: string;
  score: number;
  signal: 'buy' | 'sell' | 'hold';
}

export type RunStrategiesParams = {
  symbol?: string;
  timeframe?: number;
};

const _signalFromScore = (score: number): 'buy' | 'sell' | 'hold' => {
  if (score > 0.2) return 'buy';
  if (score < -0.2) return 'sell';
  return 'hold';
};

const _smaEmaCrossover = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const sma20 = await getIndicatorSeries(symbol, tf, 'sma20', 3);
  const ema12 = await getIndicatorSeries(symbol, tf, 'ema12', 3);
  if (sma20.length < 2 || ema12.length < 2)
    return { name: 'ma_crossover', score: 0, signal: 'hold' };
  const prevCross = ema12[ema12.length - 2].value - sma20[sma20.length - 2].value;
  const currCross = ema12[ema12.length - 1].value - sma20[sma20.length - 1].value;
  const score = currCross > 0 && prevCross <= 0 ? 0.6 : currCross < 0 && prevCross >= 0 ? -0.6 : 0;
  return { name: 'ma_crossover', score, signal: _signalFromScore(score) };
};

const _rsiMomentum = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const rsi = await getIndicatorSeries(symbol, tf, 'rsi14', 1);
  if (rsi.length === 0) return { name: 'rsi_momentum', score: 0, signal: 'hold' };
  const val = rsi[0].value;
  const score = val < 30 ? 0.5 : val > 70 ? -0.5 : 0;
  return { name: 'rsi_momentum', score, signal: _signalFromScore(score) };
};

const _scalping = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const ema12 = await getIndicatorSeries(symbol, tf, 'ema12', 1);
  const series = await getLatestOhlcv(symbol, tf, 1);
  if (ema12.length === 0 || series.length === 0)
    return { name: 'scalping', score: 0, signal: 'hold' };
  const close = series[0].close;
  const diff = (close - ema12[0].value) / close;
  const score = diff > 0.002 ? 0.3 : diff < -0.002 ? -0.3 : 0;
  return { name: 'scalping', score, signal: _signalFromScore(score) };
};

const _swingDayTrading = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const ema12 = await getIndicatorSeries(symbol, tf, 'ema12', 26);
  const ema26 = await getIndicatorSeries(symbol, tf, 'ema26', 26);
  if (ema12.length < 26 || ema26.length < 26) return { name: 'swing', score: 0, signal: 'hold' };
  const macd = ema12.map((e, idx) => e.value - ema26[idx].value);
  const signalLine = macd.slice(-9).reduce((a, b) => a + b, 0) / 9;
  const currMacd = macd[macd.length - 1];
  const score = currMacd > signalLine ? 0.4 : currMacd < signalLine ? -0.4 : 0;
  return { name: 'swing', score, signal: _signalFromScore(score) };
};

const _trendFollowing = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const sma50 = await getIndicatorSeries(symbol, tf, 'sma50', 1);
  const latest = await getLatestOhlcv(symbol, tf, 1);
  if (sma50.length === 0 || latest.length === 0)
    return { name: 'trend_following', score: 0, signal: 'hold' };
  const price = latest[0].close;
  const score = price > sma50[0].value ? 0.3 : price < sma50[0].value ? -0.3 : 0;
  return { name: 'trend_following', score, signal: _signalFromScore(score) };
};

const _rangeReversal = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const sma20 = await getIndicatorSeries(symbol, tf, 'sma20', 20);
  const latest = await getLatestOhlcv(symbol, tf, 1);
  if (sma20.length < 20 || latest.length === 0)
    return { name: 'range_reversal', score: 0, signal: 'hold' };
  const closes = (await getLatestOhlcv(symbol, tf, 20)).map((r) => r.close);
  const mean = sma20[sma20.length - 1].value;
  const std = Math.sqrt(closes.reduce((acc, c) => acc + Math.pow(c - mean, 2), 0) / closes.length);
  const price = latest[0].close;
  const z = (price - mean) / std;
  const score = z < -1 ? 0.3 : z > 1 ? -0.3 : 0;
  return { name: 'range_reversal', score, signal: _signalFromScore(score) };
};

const _statArb = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const sma50 = await getIndicatorSeries(symbol, tf, 'sma50', 50);
  if (sma50.length < 50) return { name: 'stat_arb', score: 0, signal: 'hold' };
  const closes = (await getLatestOhlcv(symbol, tf, 50)).map((r) => r.close);
  const mean = sma50[sma50.length - 1].value;
  const std = Math.sqrt(closes.reduce((acc, c) => acc + Math.pow(c - mean, 2), 0) / closes.length);
  const price = closes[closes.length - 1];
  const z = (price - mean) / std;
  const score = -Math.max(-1, Math.min(1, z));
  return { name: 'stat_arb', score, signal: _signalFromScore(score) };
};

const _meanReversion = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const sma20 = await getIndicatorSeries(symbol, tf, 'sma20', 20);
  if (sma20.length < 20) return { name: 'mean_reversion', score: 0, signal: 'hold' };
  const closes = (await getLatestOhlcv(symbol, tf, 20)).map((r) => r.close);
  const mean = sma20[sma20.length - 1].value;
  const price = closes[closes.length - 1];
  const score = price < mean ? 0.25 : price > mean ? -0.25 : 0;
  return { name: 'mean_reversion', score, signal: _signalFromScore(score) };
};

const _dynamicGrid = async (symbol: string, tf: number): Promise<StrategyResult> => {
  const latest = await getLatestOhlcv(symbol, tf, 10);
  if (latest.length < 10) return { name: 'dynamic_grid', score: 0, signal: 'hold' };
  const price = latest[latest.length - 1].close;
  const min = Math.min(...latest.map((r) => r.close));
  const max = Math.max(...latest.map((r) => r.close));
  const gridSize = (max - min) / 5;
  const gridIndex = Math.floor((price - min) / gridSize);
  const score = gridIndex <= 1 ? 0.2 : gridIndex >= 4 ? -0.2 : 0;
  return { name: 'dynamic_grid', score, signal: _signalFromScore(score) };
};

export class StrategiesService {
  async runStrategies(params: RunStrategiesParams = {}): Promise<StrategyResult[]> {
    const symbol = params.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = params.timeframe ?? ENV.INDODAX_TIMEFRAME_MIN;

    const results = await Promise.all([
      _smaEmaCrossover(symbol, timeframeMin),
      _rsiMomentum(symbol, timeframeMin),
      _scalping(symbol, timeframeMin),
      _swingDayTrading(symbol, timeframeMin),
      _trendFollowing(symbol, timeframeMin),
      _rangeReversal(symbol, timeframeMin),
      _statArb(symbol, timeframeMin),
      _meanReversion(symbol, timeframeMin),
      _dynamicGrid(symbol, timeframeMin)
    ]);
    return results;
  }
}

export const runStrategies = async (
  params: RunStrategiesParams = {}
): Promise<StrategyResult[]> => {
  const svc = new StrategiesService();
  return svc.runStrategies(params);
};
