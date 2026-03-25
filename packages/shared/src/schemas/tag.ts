import { z } from 'zod'

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(50),
})

export const TagResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
})

export type CreateTagInput = z.infer<typeof CreateTagSchema>
export type TagResponse = z.infer<typeof TagResponseSchema>
