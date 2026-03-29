import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express, { type Request, type Response, type NextFunction } from 'express'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    tin: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('../lib/prisma.js', () => ({ prisma: mockPrisma }))

vi.mock('../middleware/requireAuth.js', () => ({
  requireAuth: (_req: Request, res: Response, next: NextFunction) => {
    res.locals.userId = 'aaaaaaaa-0000-0000-0000-000000000001'
    next()
  },
}))

import tinsRouter from './tins.js'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER_ID = 'aaaaaaaa-0000-0000-0000-000000000001'
const TIN_ID = 'bbbbbbbb-0000-0000-0000-000000000001'
const TAG_ID = 'cccccccc-0000-0000-0000-000000000001'

const tinInDb = {
  id: TIN_ID,
  userId: USER_ID,
  title: '개발 공부 포기',
  givenUpAt: new Date('2026-01-15'),
  feeling: '힘들었지만 의미 있었다',
  type: 'letting_go',
  createdAt: new Date('2026-01-20T00:00:00.000Z'),
  updatedAt: new Date('2026-01-20T00:00:00.000Z'),
  tinTags: [{ tag: { id: TAG_ID, name: '개발' } }],
}

const app = express()
app.use(express.json())
app.use('/api/v1/tins', tinsRouter)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Tins API', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── 플로우: 새 아쉬움 작성 ─────────────────────────────────────────────────
  describe('POST /api/v1/tins — 새 아쉬움 작성', () => {
    it('letting_go 타입으로 tin 생성', async () => {
      console.log('env!', process.env.NODE_ENV)
      mockPrisma.tin.create.mockResolvedValue(tinInDb)

      const res = await request(app).post('/api/v1/tins').send({
        title: '개발 공부 포기',
        givenUpAt: '2026-01-15',
        type: 'letting_go',
        feeling: '힘들었지만 의미 있었다',
      })

      expect(res.status).toBe(201)
      expect(res.body.type).toBe('letting_go')
      expect(res.body.title).toBe('개발 공부 포기')
    })

    it('reflection 타입으로 tin 생성', async () => {
      mockPrisma.tin.create.mockResolvedValue({ ...tinInDb, type: 'reflection' })

      const res = await request(app).post('/api/v1/tins').send({
        title: '그때의 선택 돌아보기',
        givenUpAt: '2026-01-15',
        type: 'reflection',
      })

      expect(res.status).toBe(201)
      expect(res.body.type).toBe('reflection')
    })

    it('커스텀 태그 포함', async () => {
      mockPrisma.tin.create.mockResolvedValue(tinInDb)

      const res = await request(app)
        .post('/api/v1/tins')
        .send({
          title: '개발 공부',
          givenUpAt: '2026-01-15',
          type: 'letting_go',
          tagIds: [TAG_ID],
        })

      expect(res.status).toBe(201)
      expect(mockPrisma.tin.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ tinTags: expect.any(Object) }),
        }),
      )
    })

    it('제목 없으면 400', async () => {
      const res = await request(app)
        .post('/api/v1/tins')
        .send({ givenUpAt: '2026-01-15', type: 'letting_go' })

      expect(res.status).toBe(400)
    })

    it('잘못된 type 값이면 400', async () => {
      const res = await request(app).post('/api/v1/tins').send({
        title: '테스트',
        givenUpAt: '2026-01-15',
        type: 'invalid_type',
      })

      expect(res.status).toBe(400)
    })
  })

  // ── 플로우: 대시보드 목록 ────────────────────────────────────────────────────
  describe('GET /api/v1/tins — 목록 조회', () => {
    it('letting_go 목록 조회', async () => {
      mockPrisma.tin.findMany.mockResolvedValue([tinInDb])

      const res = await request(app).get('/api/v1/tins?type=letting_go')

      expect(res.status).toBe(200)
      expect(mockPrisma.tin.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: USER_ID, type: 'letting_go' }),
        }),
      )
    })

    it('reflection 목록 조회', async () => {
      mockPrisma.tin.findMany.mockResolvedValue([{ ...tinInDb, type: 'reflection' }])

      const res = await request(app).get('/api/v1/tins?type=reflection')

      expect(res.status).toBe(200)
      expect(mockPrisma.tin.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'reflection' }),
        }),
      )
    })

    it('type 필터 없이 전체 조회', async () => {
      mockPrisma.tin.findMany.mockResolvedValue([tinInDb])

      const res = await request(app).get('/api/v1/tins')

      expect(res.status).toBe(200)
      expect(mockPrisma.tin.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: USER_ID }),
        }),
      )
    })
  })

  // ── 플로우: Tin 상세 보기 ────────────────────────────────────────────────────
  describe('GET /api/v1/tins/:id — 상세 보기', () => {
    it('존재하는 tin 상세 조회', async () => {
      mockPrisma.tin.findFirst.mockResolvedValue(tinInDb)

      const res = await request(app).get(`/api/v1/tins/${TIN_ID}`)

      expect(res.status).toBe(200)
      expect(res.body.id).toBe(TIN_ID)
      expect(res.body.tags).toEqual([{ id: TAG_ID, name: '개발' }])
    })

    it('존재하지 않는 tin → 404', async () => {
      mockPrisma.tin.findFirst.mockResolvedValue(null)

      const res = await request(app).get('/api/v1/tins/nonexistent')

      expect(res.status).toBe(404)
    })
  })

  // ── 플로우: 수정 ────────────────────────────────────────────────────────────
  describe('PATCH /api/v1/tins/:id — 수정', () => {
    it('제목 수정 성공', async () => {
      mockPrisma.tin.findFirst.mockResolvedValue(tinInDb)
      mockPrisma.tin.update.mockResolvedValue({ ...tinInDb, title: '수정된 제목' })

      const res = await request(app).patch(`/api/v1/tins/${TIN_ID}`).send({ title: '수정된 제목' })

      expect(res.status).toBe(200)
      expect(res.body.title).toBe('수정된 제목')
    })

    it('존재하지 않는 tin 수정 → 404', async () => {
      mockPrisma.tin.findFirst.mockResolvedValue(null)

      const res = await request(app).patch('/api/v1/tins/nonexistent').send({ title: '수정' })

      expect(res.status).toBe(404)
    })
  })

  // ── 플로우: 삭제 ────────────────────────────────────────────────────────────
  describe('DELETE /api/v1/tins/:id', () => {
    it('tin 삭제 성공 → 204', async () => {
      mockPrisma.tin.findFirst.mockResolvedValue(tinInDb)
      mockPrisma.tin.delete.mockResolvedValue(tinInDb)

      const res = await request(app).delete(`/api/v1/tins/${TIN_ID}`)

      expect(res.status).toBe(204)
    })

    it('존재하지 않는 tin → 404', async () => {
      mockPrisma.tin.findFirst.mockResolvedValue(null)

      const res = await request(app).delete('/api/v1/tins/nonexistent')

      expect(res.status).toBe(404)
    })
  })
})
