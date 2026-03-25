import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pinoHttp from 'pino-http'
import { toNodeHandler } from 'better-auth/node'
import { logger } from './lib/logger.js'
import { auth } from './lib/auth.js'
import tinsRouter from './routes/tins.js'
import tagsRouter from './routes/tags.js'

const app: express.Express = express()
const PORT = process.env.PORT ?? 4000

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
)

app.use(pinoHttp({ logger }))
app.use(express.json())

// Better-Auth handler
app.all('/api/auth/*splat', toNodeHandler(auth))

// API routes
app.use('/api/tins', tinsRouter)
app.use('/api/tags', tagsRouter)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  logger.info(`Backend running on http://localhost:${PORT}`)
})

export default app
