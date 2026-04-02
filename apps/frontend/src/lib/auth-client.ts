import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

// Export authClient directly — destructuring individual methods causes
// pnpm type portability errors due to better-auth's complex return types.
// Use authClient.signIn(), authClient.useSession(), etc. at call sites.
//
// [Case 1] 커스텀 도메인 환경 (권장)
//   fetchOptions.auth 설정 없이 쿠키 기반으로 동작합니다.
//   better-auth가 로그인 시 httpOnly 세션 쿠키를 자동 설정합니다.
//
// [Case 2] Railway 기본 URL 환경 (현재)
//   로그인 응답에서 Bearer 토큰을 받아 localStorage에 저장하고,
//   이후 요청마다 Authorization 헤더로 전달합니다.
//   localStorage에 토큰이 없으면 빈 문자열을 반환해 비로그인으로 처리됩니다.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  fetchOptions: {
    auth: {
      type: 'Bearer',
      token: () =>
        typeof localStorage !== 'undefined' ? (localStorage.getItem('bearer_token') ?? '') : '',
    },
  },
  plugins: [adminClient()],
})
