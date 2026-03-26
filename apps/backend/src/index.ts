import './lib/env.js' // dotenv 로드 + env 검증
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import pinoHttp from 'pino-http'
import { toNodeHandler } from 'better-auth/node'
import { logger } from './lib/logger.js'
import { auth } from './lib/auth.js'
import tinsRouter from './routes/tins.js'
import tagsRouter from './routes/tags.js'

const app: express.Express = express()
const PORT = process.env.PORT ?? 4000

app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  }),
)
app.use(pinoHttp({ logger }))
app.use(express.json({ limit: '10kb' }))

// Rate limiting — 인증 엔드포인트
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 20,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Better-Auth handler
app.all('/api/auth/*splat', authLimiter, toNodeHandler(auth))

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
