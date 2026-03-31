import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express, { type Request, type Response, type NextFunction } from 'express'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    user: {
      delete: vi.fn(),
    },
  },
}))

vi.mock('../../lib/prisma.js', () => ({ prisma: mockPrisma }))

vi.mock('../../middleware/requireAuth.js', () => ({
  requireAuth: (_req: Request, res: Response, next: NextFunction) => {
    res.locals.userId = 'aaaaaaaa-0000-0000-0000-000000000001'
    next()
  },
}))

import meRouter from '../../routes/me.js'

// ─── App ──────────────────────────────────────────────────────────────────────

const app = express()
app.use(express.json())
app.use('/api/v1/me', meRouter)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

const USER_ID = 'aaaaaaaa-0000-0000-0000-000000000001'

describe('Me API', () => {
  beforeEach(() => vi.clearAllMocks())

  it('DELETE /api/v1/me — 유저 삭제 후 204 반환', async () => {
    mockPrisma.user.delete.mockResolvedValue({})

    const res = await request(app).delete('/api/v1/me')

    expect(res.status).toBe(204)
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: USER_ID } })
  })

  it('DELETE /api/v1/me — DB 오류 시 500 반환', async () => {
    mockPrisma.user.delete.mockRejectedValue(new Error('DB error'))

    const res = await request(app).delete('/api/v1/me')

    expect(res.status).toBe(500)
  })
})
