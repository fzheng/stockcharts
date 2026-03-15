import NodeCache from 'node-cache';
import { config } from '../config.js';

interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

function createInMemoryCache(): CacheService {
  const cache = new NodeCache();

  return {
    async get<T>(key: string): Promise<T | null> {
      const value = cache.get<T>(key);
      return value ?? null;
    },
    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
      cache.set(key, value, ttlSeconds);
    },
  };
}

async function createRedisCache(url: string): Promise<CacheService> {
  const { default: Redis } = await import('ioredis');
  const redis = new Redis(url, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) return null; // Stop retrying after 3 attempts
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true,
  });

  // Suppress unhandled error events — fallback logic handles failures
  redis.on('error', () => {});

  // Test the connection
  await redis.connect();
  await redis.ping();

  return {
    async get<T>(key: string): Promise<T | null> {
      try {
        const value = await redis.get(key);
        return value ? (JSON.parse(value) as T) : null;
      } catch {
        return null;
      }
    },
    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
      try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      } catch {
        // Silently fail — cache is optional
      }
    },
  };
}

let cacheInstance: CacheService | null = null;

export async function getCache(): Promise<CacheService> {
  if (cacheInstance) return cacheInstance;

  if (config.redisUrl) {
    try {
      cacheInstance = await createRedisCache(config.redisUrl);
      console.log('Using Redis cache');
    } catch {
      cacheInstance = createInMemoryCache();
      console.log('Redis unavailable, using in-memory cache');
    }
  } else {
    cacheInstance = createInMemoryCache();
    console.log('Using in-memory cache');
  }

  return cacheInstance;
}
