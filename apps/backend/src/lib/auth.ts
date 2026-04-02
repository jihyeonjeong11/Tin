import { betterAuth } from 'better-auth'
import { bearer, admin } from 'better-auth/plugins'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma.js'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh if 1 day old
  },
  trustedOrigins: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],
  // bearer(): 커스텀 도메인 없는 환경(Railway 기본 URL 등)에서 크로스 도메인 쿠키 차단 시
  //           Bearer 토큰 인증을 fallback으로 지원합니다. 쿠키 환경에서도 영향 없습니다.
  plugins: [bearer(), admin()],
})
