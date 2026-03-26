import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { Prisma } from '@prisma/client'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    tag: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('../lib/prisma.js', () => ({ prisma: mockPrisma }))

vi.mock('../middleware/requireAuth.js', () => ({
  requireAuth: (_req: any, res: any, next: any) => {
    res.locals.userId = 'aaaaaaaa-0000-0000-0000-000000000001'
    next()
  },
}))

import tagsRouter from './tags.js'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER_ID = 'aaaaaaaa-0000-0000-0000-000000000001'
const TAG_ID = 'cccccccc-0000-0000-0000-000000000001'

const tagInDb = {
  id: TAG_ID,
  userId: USER_ID,
  name: '개발',
}

const app = express()
app.use(express.json())
app.use('/api/v1/tags', tagsRouter)
app.use((err: Error, _req: any, res: any, _next: any) => {
  res.status(500).json({ error: err.message })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Tags API', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── 플로우: 커스텀 태그 추가 (선택) ──────────────────────────────────────────
  describe('POST /api/v1/tags — 커스텀 태그 추가', () => {
    it('태그 생성 성공', async () => {
      mockPrisma.tag.create.mockResolvedValue(tagInDb)

      const res = await request(app).post('/api/v1/tags').send({ name: '개발' })

      expect(res.status).toBe(201)
      expect(res.body.name).toBe('개발')
      expect(res.body.userId).toBe(USER_ID)
    })

    it('같은 이름의 태그 중복 생성 → 409', async () => {
      mockPrisma.tag.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '6',
        }),
      )

      const res = await request(app).post('/api/v1/tags').send({ name: '개발' })

      expect(res.status).toBe(409)
      expect(res.body.error).toBe('Tag already exists')
    })

    it('이름 없으면 400', async () => {
      const res = await request(app).post('/api/v1/tags').send({})

      expect(res.status).toBe(400)
    })

    it('50자 초과 이름 → 400', async () => {
      const res = await request(app)
        .post('/api/v1/tags')
        .send({ name: 'a'.repeat(51) })

      expect(res.status).toBe(400)
    })

    it('내 userId로 태그 생성됨', async () => {
      mockPrisma.tag.create.mockResolvedValue(tagInDb)

      await request(app).post('/api/v1/tags').send({ name: '개발' })

      expect(mockPrisma.tag.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: USER_ID }),
        }),
      )
    })
  })

  // ── 플로우: 태그 목록 조회 (대시보드 / 태그 선택 UI) ──────────────────────────
  describe('GET /api/v1/tags — 태그 목록', () => {
    it('내 태그 목록 조회', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([tagInDb])

      const res = await request(app).get('/api/v1/tags')

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body[0].name).toBe('개발')
    })

    it('내 userId로만 조회 (다른 유저 태그 노출 안 됨)', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([tagInDb])

      await request(app).get('/api/v1/tags')

      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: USER_ID },
        }),
      )
    })

    it('태그 없으면 빈 배열 반환', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([])

      const res = await request(app).get('/api/v1/tags')

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  // ── 플로우: 태그 삭제 ─────────────────────────────────────────────────────────
  describe('DELETE /api/v1/tags/:id — 태그 삭제', () => {
    it('태그 삭제 성공 → 204', async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(tagInDb)
      mockPrisma.tag.delete.mockResolvedValue(tagInDb)

      const res = await request(app).delete(`/api/v1/tags/${TAG_ID}`)

      expect(res.status).toBe(204)
    })

    it('존재하지 않는 태그 → 404', async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(null)

      const res = await request(app).delete('/api/v1/tags/nonexistent')

      expect(res.status).toBe(404)
    })

    it('다른 유저의 태그 삭제 불가 (userId 조건 확인)', async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(null)

      await request(app).delete(`/api/v1/tags/${TAG_ID}`)

      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: USER_ID }),
        }),
      )
    })
  })
})
