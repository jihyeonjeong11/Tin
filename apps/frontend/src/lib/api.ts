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
