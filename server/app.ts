import Fastify from 'fastify';
import { stockRoutes } from './routes/stockRoutes.js';
import { healthRoutes } from './routes/healthRoutes.js';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Security
  await app.register(import('@fastify/helmet'), { contentSecurityPolicy: false });
  await app.register(import('@fastify/cors'), { origin: true });
  await app.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

  // Routes
  await app.register(healthRoutes);
  await app.register(stockRoutes);

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    await app.register(import('@fastify/static'), {
      root: new URL('../dist', import.meta.url).pathname,
      prefix: '/',
    });

    // SPA fallback
    app.setNotFoundHandler((_request, reply) => {
      return reply.sendFile('index.html');
    });
  }

  return app;
}
