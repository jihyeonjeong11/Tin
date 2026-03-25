import { Router, type Router as ExpressRouter } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'
import { CreateTinSchema, UpdateTinSchema } from '@tin/shared'

const router: ExpressRouter = Router()

router.use(requireAuth)

// GET /api/tins
router.get('/', async (req, res) => {
  const userId = res.locals.userId as string
  const status = req.query.status as 'pending' | 'archived' | undefined

  const tins = await prisma.tin.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    include: { tinTags: { include: { tag: true } } },
    orderBy: { createdAt: 'desc' },
  })

  res.json(tins.map(formatTin))
})

// GET /api/tins/:id
router.get('/:id', async (req, res) => {
  const userId = res.locals.userId as string
  const tin = await prisma.tin.findFirst({
    where: { id: req.params['id'] as string, userId },
    include: { tinTags: { include: { tag: true } } },
  })

  if (!tin) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.json(formatTin(tin))
})

// POST /api/tins
router.post('/', validate(CreateTinSchema), async (req, res) => {
  const userId = res.locals.userId as string
  const { tagIds, ...data } = req.body

  const tin = await prisma.tin.create({
    data: {
      ...data,
      userId,
      givenUpAt: new Date(data.givenUpAt),
      ...(tagIds?.length && {
        tinTags: { create: tagIds.map((tagId: string) => ({ tagId })) },
      }),
    },
    include: { tinTags: { include: { tag: true } } },
  })

  res.status(201).json(formatTin(tin))
})

// PATCH /api/tins/:id
router.patch('/:id', validate(UpdateTinSchema), async (req, res) => {
  const userId = res.locals.userId as string
  const { tagIds, ...data } = req.body

  const existing = await prisma.tin.findFirst({
    where: { id: req.params['id'] as string, userId },
  })
  if (!existing) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const tin = await prisma.tin.update({
    where: { id: req.params['id'] as string },
    data: {
      ...data,
      ...(data.givenUpAt && { givenUpAt: new Date(data.givenUpAt) }),
      ...(tagIds && {
        tinTags: {
          deleteMany: {},
          create: tagIds.map((tagId: string) => ({ tagId })),
        },
      }),
    },
    include: { tinTags: { include: { tag: true } } },
  })

  res.json(formatTin(tin))
})

// PATCH /api/tins/:id/archive
router.patch('/:id/archive', async (req, res) => {
  const userId = res.locals.userId as string
  const existing = await prisma.tin.findFirst({
    where: { id: req.params['id'] as string, userId },
  })
  if (!existing) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const tin = await prisma.tin.update({
    where: { id: req.params['id'] as string },
    data: { status: 'archived' },
    include: { tinTags: { include: { tag: true } } },
  })

  res.json(formatTin(tin))
})

// DELETE /api/tins/:id
router.delete('/:id', async (req, res) => {
  const userId = res.locals.userId as string
  const existing = await prisma.tin.findFirst({
    where: { id: req.params['id'] as string, userId },
  })
  if (!existing) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  await prisma.tin.delete({ where: { id: req.params['id'] as string } })
  res.status(204).send()
})

function formatTin(tin: any) {
  return {
    id: tin.id,
    userId: tin.userId,
    title: tin.title,
    givenUpAt: tin.givenUpAt.toISOString().split('T')[0],
    feeling: tin.feeling,
    status: tin.status,
    type: tin.type,
    createdAt: tin.createdAt.toISOString(),
    updatedAt: tin.updatedAt.toISOString(),
    tags:
      tin.tinTags?.map((tt: any) => ({ id: tt.tag.id, name: tt.tag.name })) ??
      [],
  }
}

export default router
