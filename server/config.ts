function env(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

function envInt(key: string, fallback: number): number {
  const val = process.env[key];
  return val ? parseInt(val, 10) : fallback;
}

export const config = {
  get port() { return envInt('PORT', 3000); },
  get host() { return env('HOST', '0.0.0.0'); },
  get nodeEnv() { return env('NODE_ENV', 'development'); },
  get redisUrl() { return env('REDIS_URL', ''); },
  get stockApiKey() { return env('STOCK_API_KEY', ''); },
  get cacheTtl() { return envInt('CACHE_TTL', 28800); },
  get rateLimitRetryMs() { return envInt('RATE_LIMIT_RETRY_MS', 15000); },
};
