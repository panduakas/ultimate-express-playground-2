/**
 * Market data fetcher for Indodax OHLCV
 */
import axios from 'axios';

import { logger } from '../../../../logger.js';
import { ENV } from '../../../../variables.js';
import { getCache, setCache } from '../../../shared/services/cache.service.js';
import { OhlcvRepository, upsertOhlcv } from '../repositories/ohlcv.repository.js';

interface IndodaxHistoryResponse {
  s: string;
  t: number[];
  o: number[];
  h: number[];
  l: number[];
  c: number[];
  v: number[];
}

const _buildHistoryUrl = (from: number, to: number, symbol: string, tf: number): string => {
  const url = `https://indodax.com/tradingview/history_v2?from=${from}&symbol=${symbol}&tf=${tf}&to=${to}`;
  return url;
};

export class MarketDataService {
  constructor(private readonly ohlcvRepo: OhlcvRepository = new OhlcvRepository()) {}

  async syncOhlcv(params: { symbol?: string; timeframe?: number } = {}): Promise<void> {
    const lastSync = await getCache('market:last_sync');
    if (lastSync) {
      return;
    }
    const symbol = params.symbol ?? ENV.INDODAX_PAIR;
    const timeframeMin = params.timeframe ?? ENV.INDODAX_TIMEFRAME_MIN;
    const latest = await this.ohlcvRepo.getLatestOhlcv(symbol, timeframeMin, 1);
    const nowSec = Math.floor(Date.now() / 1000);
    const fromSec =
      latest.length > 0
        ? Math.floor(latest[0].time.getTime() / 1000) + timeframeMin * 60
        : nowSec - timeframeMin * 60 * 300;
    const url = _buildHistoryUrl(fromSec, nowSec, symbol, timeframeMin);
    const res = await axios.get<IndodaxHistoryResponse>(url, { timeout: 15000 });
    if (res.data.s !== 'ok') {
      return;
    }
    const rows = res.data.t.map((t, idx) => ({
      symbol,
      timeframeMin,
      time: new Date(t * 1000),
      open: res.data.o[idx],
      high: res.data.h[idx],
      low: res.data.l[idx],
      close: res.data.c[idx],
      volume: res.data.v[idx]
    }));
    if (rows.length === 0) {
      return;
    }
    await upsertOhlcv(rows);
    logger.info(`Synced OHLCV: ${rows.length} rows`);
    await setCache('market:last_sync', new Date().toISOString(), 300);
  }
}

export const syncOhlcv = async (
  params: { symbol?: string; timeframe?: number } = {}
): Promise<void> => {
  const svc = new MarketDataService();
  return svc.syncOhlcv(params);
};
