import { z } from 'zod'

export const CreateTinSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(255, '제목은 255자 이하로 입력해주세요.'),
  givenUpAt: z.string().date('날짜 형식이 올바르지 않습니다.'),
  feeling: z.string().max(2000, '내용은 2000자 이하로 입력해주세요.').optional(),
  type: z.enum(['letting_go', 'reflection'], { message: '유형을 선택해주세요.' }),
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
