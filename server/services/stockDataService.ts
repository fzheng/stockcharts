import type { OHLCVData } from '../types/stock.js';
import { ExternalApiError } from '../utils/errors.js';
import { getCache } from './cacheService.js';
import { config } from '../config.js';

export async function getHistoricalData(symbol: string): Promise<OHLCVData[]> {
  const upperSymbol = symbol.toUpperCase();
  const cacheKey = `${upperSymbol}:history`;
  const cache = await getCache();

  const cached = await cache.get<OHLCVData[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchFromTwelveData(upperSymbol);

  await cache.set(cacheKey, data, config.cacheTtl);
  return data;
}

interface TwelveDataValue {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface TwelveDataResponse {
  meta?: { symbol: string };
  values?: TwelveDataValue[];
  status?: string;
  code?: number;
  message?: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches weekly OHLCV data from Twelve Data. Single API call returns up to
 * 5000 weekly bars (~20 years). Free tier: 8 req/min, 800 req/day.
 */
async function fetchFromTwelveData(symbol: string): Promise<OHLCVData[]> {
  const apiKey = config.stockApiKey || 'demo';
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1week&outputsize=5000&apikey=${apiKey}`;

  try {
    const json = await fetchWithRetry(url);

    if (!json.values || json.values.length === 0) {
      throw new Error('No data returned for this symbol');
    }

    const data: OHLCVData[] = json.values
      .map((v) => ({
        date: v.datetime,
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: parseInt(v.volume, 10),
      }))
      .reverse(); // API returns newest first, we want chronological

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new ExternalApiError(`Failed to fetch data for ${symbol}: ${message}`);
  }
}

async function fetchWithRetry(url: string, retries = 1): Promise<TwelveDataResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json = (await response.json()) as TwelveDataResponse;

  if (json.code === 429 || json.status === 'error') {
    if (json.code === 429 && retries > 0) {
      const delay = config.rateLimitRetryMs;
      console.log(`Rate limited, retrying in ${delay}ms...`);
      await sleep(delay);
      return fetchWithRetry(url, retries - 1);
    }
    throw new Error(json.message || 'API error');
  }

  return json;
}
