import { PrismaClient } from '@prisma/client'
import { auth } from '../src/lib/auth.js'

const prisma = new PrismaClient()

async function main() {
  // 테스트 유저 생성
  await auth.api.signUpEmail({
    body: {
      name: '테스트 유저',
      email: 'test@tin.dev',
      password: 'password123',
    },
  })

  const user = await prisma.user.findUniqueOrThrow({ where: { email: 'test@tin.dev' } })

  // 태그 생성
  const tags = await Promise.all([
    prisma.tag.create({ data: { userId: user.id, name: '관계' } }),
    prisma.tag.create({ data: { userId: user.id, name: '일' } }),
    prisma.tag.create({ data: { userId: user.id, name: '습관' } }),
  ])

  // Tin 생성
  await prisma.tin.createMany({
    data: [
      {
        userId: user.id,
        title: '야근을 당연하게 여기던 나',
        givenUpAt: new Date('2024-06-01'),
        feeling: '지쳐있었지만 멈추지 못했다',
        type: 'letting_go',
      },
      {
        userId: user.id,
        title: '첫 직장에서의 기억',
        givenUpAt: new Date('2023-03-15'),
        feeling: '많이 배웠고, 많이 상처받았다',
        type: 'reflection',
      },
      {
        userId: user.id,
        title: '매일 운동하겠다는 다짐',
        givenUpAt: new Date('2025-01-10'),
        feeling: '의지는 있었지만 현실은 달랐다',
        type: 'letting_go',
      },
    ],
  })

  // 첫 번째 tin에 태그 연결
  const firstTin = await prisma.tin.findFirst({ where: { userId: user.id } })
  if (firstTin) {
    await prisma.tinTag.createMany({
      data: [
        { tinId: firstTin.id, tagId: tags[1].id }, // 일
        { tinId: firstTin.id, tagId: tags[2].id }, // 습관
      ],
    })
  }

  console.log('✅ Seed 완료 — test@tin.dev / password123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
