import Redis from 'ioredis';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (redisClient) return redisClient;

  const password = process.env.REDIS_PASSWORD;
  const host     = process.env.REDIS_HOST || 'redis-11976.crce275.eu-west3-1.gcp.cloud.redislabs.com';
  const port     = parseInt(process.env.REDIS_PORT || '11976', 10);

  if (!password) {
    throw new Error('REDIS_PASSWORD must be set in .env');
  }

  redisClient = new Redis({ host, port, password, lazyConnect: true });

  redisClient.on('connect', () => console.log('[Redis] Connected'));
  redisClient.on('error',   (err) => console.error('[Redis] Error:', err.message));

  return redisClient;
}

export const CHANNEL_ARTICLE_NEW = 'article:new';
