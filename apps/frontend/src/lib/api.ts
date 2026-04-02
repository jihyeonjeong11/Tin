'use client'

import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  withCredentials: true,
  timeout: 5_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// AUTH STRATEGY (두 가지 케이스)
//
// [Case 1] 커스텀 도메인 환경 (권장)
//   프론트와 백엔드가 같은 도메인 하위 (예: app.yourdomain.com / api.yourdomain.com)일 때,
//   better-auth가 설정하는 httpOnly 세션 쿠키가 자동으로 전송됩니다.
//   이 경우 아래 Bearer 토큰 로직은 불필요하며, withCredentials: true 만으로 동작합니다.
//
// [Case 2] Railway 기본 URL 환경 (현재)
//   프론트(*.up.railway.app)와 백엔드(*.up.railway.app)가 서로 다른 도메인이라
//   크로스 도메인 쿠키가 차단됩니다. (참고: https://station.railway.com/questions/cross-domain-cookies-on-preview-65c2b01e)
//   이를 우회하기 위해 로그인 시 발급된 Bearer 토큰을 localStorage에 저장해 사용합니다.
api.interceptors.request.use((config) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('bearer_token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.replace('/login')
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return '요청 시간이 초과됐어요'
    if (!error.response) return '서버에 연결할 수 없어요'
    return error.response.data?.message ?? '오류가 발생했어요'
  }
  if (error instanceof Error) {
    if (error.message === 'Failed to fetch' || error.message === 'Network Error') {
      return '서버에 연결할 수 없어요'
    }
    return error.message
  }
  return '오류가 발생했어요'
}
