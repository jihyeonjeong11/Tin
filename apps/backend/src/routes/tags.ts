import { Router, type Router as ExpressRouter } from 'express'
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
  const tag = await prisma.tag.create({ data: { ...req.body, userId } })
  res.status(201).json(tag)
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
