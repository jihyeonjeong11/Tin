import { Router, type Router as ExpressRouter, type Request, type Response } from 'express'
import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'
import { CreateTinSchema, UpdateTinSchema } from '@tin/shared'

const router: ExpressRouter = Router()

router.use(requireAuth)

// GET /api/tins
router.get('/', async (req: Request, res: Response) => {
  const userId = res.locals.userId as string
  const type = req.query.type as 'letting_go' | 'reflection' | undefined

  const tins = await prisma.tin.findMany({
    where: {
      userId,
      ...(type ? { type } : {}),
    },
    include: { tinTags: { include: { tag: true } } },
    orderBy: { createdAt: 'desc' },
  })

  res.json(tins.map(formatTin))
})

// GET /api/tins/:id
router.get('/:id', async (req: Request, res: Response) => {
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
router.post('/', validate(CreateTinSchema), async (req: Request, res: Response) => {
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
router.patch('/:id', validate(UpdateTinSchema), async (req: Request, res: Response) => {
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

// DELETE /api/tins/:id
router.delete('/:id', async (req: Request, res: Response) => {
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

type TinWithTags = Prisma.TinGetPayload<{
  include: { tinTags: { include: { tag: true } } }
}>

function formatTin(tin: TinWithTags) {
  return {
    id: tin.id,
    userId: tin.userId,
    title: tin.title,
    givenUpAt: tin.givenUpAt.toISOString().split('T')[0],
    feeling: tin.feeling,
    type: tin.type,
    createdAt: tin.createdAt.toISOString(),
    updatedAt: tin.updatedAt.toISOString(),
    tags: tin.tinTags.map((tt) => ({ id: tt.tag.id, name: tt.tag.name })),
  }
}

export default router
