import { Router, type Router as ExpressRouter, type Request, type Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router: ExpressRouter = Router()

router.use(requireAuth)

// DELETE /api/v1/me
router.delete('/', async (req: Request, res: Response) => {
  const userId = res.locals.userId as string

  await prisma.user.delete({ where: { id: userId } })

  res.status(204).send()
})

export default router
