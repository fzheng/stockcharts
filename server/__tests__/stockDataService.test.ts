import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

beforeAll(() => {
  process.env.RATE_LIMIT_RETRY_MS = '0';
});

vi.mock('../services/cacheService.js', () => ({
  getCache: vi.fn().mockResolvedValue({
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue(undefined),
  }),
}));

const { getHistoricalData } = await import('../services/stockDataService.js');

describe('stockDataService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and transforms Twelve Data response', async () => {
    const mockResponse = {
      meta: { symbol: 'AAPL' },
      values: [
        { datetime: '2026-03-13', open: '155.00', high: '160.00', low: '153.00', close: '158.00', volume: '1200000' },
        { datetime: '2026-03-06', open: '148.00', high: '151.00', low: '147.00', close: '150.00', volume: '900000' },
      ],
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: () => Promise.resolve(mockResponse),
    }));

    const data = await getHistoricalData('AAPL');

    expect(data).toHaveLength(2);
    // Should be chronological (reversed from API response)
    expect(data[0].date).toBe('2026-03-06');
    expect(data[1].date).toBe('2026-03-13');
    expect(data[0]).toEqual({
      date: '2026-03-06', open: 148, high: 151, low: 147, close: 150, volume: 900000,
    });
  });

  it('throws on API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: () => Promise.resolve({ status: 'error', message: 'Invalid symbol' }),
    }));

    await expect(getHistoricalData('INVALID')).rejects.toThrow('Invalid symbol');
  });

  it('retries on rate limit then throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: () => Promise.resolve({ code: 429, status: 'error', message: 'Too many requests' }),
    }));

    await expect(getHistoricalData('AAPL')).rejects.toThrow('Too many requests');
  });
});
