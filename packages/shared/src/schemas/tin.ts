import { z } from 'zod'

export const CreateTinSchema = z.object({
  title: z.string().min(1).max(255),
  givenUpAt: z.string().date(),
  feeling: z.string().optional(),
  type: z.enum(['letting_go', 'reflection']),
  tagIds: z.array(z.string().uuid()).optional(),
})

export const UpdateTinSchema = CreateTinSchema.partial()

export const TinResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  givenUpAt: z.string(),
  feeling: z.string().nullable(),
  type: z.enum(['letting_go', 'reflection']),
  createdAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
})

export type CreateTinInput = z.infer<typeof CreateTinSchema>
export type UpdateTinInput = z.infer<typeof UpdateTinSchema>
export type TinResponse = z.infer<typeof TinResponseSchema>
