import 'dotenv/config'
import pino from 'pino'
import { z } from 'zod'

const _logger = pino()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  LOG_LEVEL: z.string().default('info'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  _logger.error({ errors: parsed.error.flatten().fieldErrors }, '❌ Invalid environment variables')
  process.exit(1)
}

export const env = parsed.data
