import './lib/env.js' // dotenv 로드 + env 검증
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import pinoHttp from 'pino-http'
import { toNodeHandler } from 'better-auth/node'
import { env } from './lib/env.js'
import { logger } from './lib/logger.js'
import { auth } from './lib/auth.js'
import tinsRouter from './routes/tins.js'
import tagsRouter from './routes/tags.js'

const app: express.Express = express()
const PORT = process.env.PORT ?? 4000

app.use(helmet())

const corsOptions = {
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['set-auth-token'],
  methods: ['GET', 'POST'],
}

app.options('/*splat', cors(corsOptions)) // preflight 명시적 처리
app.use(cors(corsOptions))
app.use(pinoHttp({ logger }))

// Better-Auth handler must be before body parsers (better-auth reads raw body stream)
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json({ limit: '10kb' }))

const isProd = env.NODE_ENV === 'production'

// Rate limiting (production only)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  limit: async (_req, _res) => {
    if (isProd) return 20
    else return 9999
  },
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// API v1 routes
app.use('/api/v1/tins', tinsRouter)
app.use('/api/v1/tags', tagsRouter)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  logger.info(`Backend running on http://localhost:${PORT}`)
})

export default app
