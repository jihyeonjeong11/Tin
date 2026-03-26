import { Router, type Router as ExpressRouter } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'
import { CreateTagSchema } from '@tin/shared'

const router: ExpressRouter = Router()

router.use(requireAuth)

// GET /api/tags
router.get('/', async (req, res) => {
  const userId = res.locals.userId as string
  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  })
  res.json(tags)
})

// POST /api/tags
router.post('/', validate(CreateTagSchema), async (req, res) => {
  const userId = res.locals.userId as string
  try {
    const tag = await prisma.tag.create({ data: { ...req.body, userId } })
    res.status(201).json(tag)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'Tag already exists' })
      return
    }
    throw err
  }
})

// DELETE /api/tags/:id
router.delete('/:id', async (req, res) => {
  const userId = res.locals.userId as string
  const existing = await prisma.tag.findFirst({
    where: { id: req.params.id, userId },
  })
  if (!existing) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  await prisma.tag.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

export default router
