import { z } from 'zod'

export const CreateTagSchema = z.object({
  name: z.string().min(1, '태그 이름을 입력해주세요.').max(50, '태그 이름은 50자 이하로 입력해주세요.'),
})

export const TagResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
})

export type CreateTagInput = z.infer<typeof CreateTagSchema>
export type TagResponse = z.infer<typeof TagResponseSchema>
