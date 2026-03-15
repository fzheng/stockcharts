import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildApp } from '../app.js';

vi.mock('../services/stockDataService.js', () => ({
  getHistoricalData: vi.fn(),
}));

import { getHistoricalData } from '../services/stockDataService.js';

const mockGetHistoricalData = vi.mocked(getHistoricalData);

describe('Stock Routes', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await buildApp();
  });

  describe('GET /api/v1/stock/:symbol/history', () => {
    it('returns OHLCV data for a valid symbol', async () => {
      const mockData = [
        { date: '2025-01-02', open: 150, high: 155, low: 149, close: 153, volume: 1000000 },
        { date: '2025-01-03', open: 153, high: 158, low: 152, close: 157, volume: 1200000 },
      ];
      mockGetHistoricalData.mockResolvedValue(mockData);

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/stock/AAPL/history',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toEqual(mockData);
      expect(mockGetHistoricalData).toHaveBeenCalledWith('AAPL');
    });

    it('rejects invalid symbols', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/stock/123/history',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toContain('alphabetic');
    });

    it('rejects symbols longer than 5 characters', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/stock/TOOLONG/history',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/health', () => {
    it('returns ok status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });
  });
});
