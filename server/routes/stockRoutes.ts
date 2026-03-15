import type { FastifyInstance } from 'fastify';
import { getHistoricalData } from '../services/stockDataService.js';
import { AppError } from '../utils/errors.js';

export async function stockRoutes(app: FastifyInstance) {
  app.get<{
    Params: { symbol: string };
  }>('/api/v1/stock/:symbol/history', async (request, reply) => {
    const { symbol } = request.params;

    if (!/^[a-zA-Z]{1,5}$/.test(symbol)) {
      return reply.status(400).send({
        data: null,
        error: 'Symbol must be 1-5 alphabetic characters',
      });
    }

    try {
      const data = await getHistoricalData(symbol);
      return { data };
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          data: null,
          error: error.message,
        });
      }
      throw error;
    }
  });
}
