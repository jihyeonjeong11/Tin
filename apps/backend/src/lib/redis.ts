import Redis from 'ioredis'
import { logger } from './logger.js'

export const redis = new Redis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD,
  lazyConnect: true,
})

redis.on('error', (err) => logger.error({ err }, 'Redis connection error'))
redis.on('connect', () => logger.info('Redis connected'))
