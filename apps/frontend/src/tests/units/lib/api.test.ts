import { describe, it, expect } from 'vitest'
import axios from 'axios'
import { getErrorMessage } from '@/lib/api'

function makeAxiosError(overrides?: {
  message?: string
  responseMessage?: string
  status?: number
}) {
  const err = new axios.AxiosError(overrides?.message ?? 'request failed')
  if (overrides?.responseMessage !== undefined) {
    err.response = {
      data: { message: overrides.responseMessage },
      status: overrides?.status ?? 400,
      statusText: 'Bad Request',
      headers: {},
      config: err.config!,
    }
  }
  return err
}

describe('getErrorMessage', () => {
  it('서버가 message를 내려주면 그 메시지를 반환한다', () => {
    const err = makeAxiosError({ responseMessage: '이미 존재하는 이메일이에요' })
    expect(getErrorMessage(err)).toBe('이미 존재하는 이메일이에요')
  })

  it('타임아웃(ECONNABORTED)이면 한국어 메시지를 반환한다', () => {
    const err = new axios.AxiosError('timeout of 5000ms exceeded')
    err.code = 'ECONNABORTED'
    expect(getErrorMessage(err)).toBe('요청 시간이 초과됐어요')
  })

  it('response가 없으면(네트워크 끊김) 한국어 메시지를 반환한다', () => {
    const err = new axios.AxiosError('Network Error')
    expect(getErrorMessage(err)).toBe('서버에 연결할 수 없어요')
  })

  it('일반 Error이면 error.message를 반환한다', () => {
    expect(getErrorMessage(new Error('무언가 잘못됨'))).toBe('무언가 잘못됨')
  })

  it('"Failed to fetch" 에러는 한국어 메시지를 반환한다', () => {
    expect(getErrorMessage(new Error('Failed to fetch'))).toBe('서버에 연결할 수 없어요')
  })

  it('알 수 없는 타입이면 기본 메시지를 반환한다', () => {
    expect(getErrorMessage(null)).toBe('오류가 발생했어요')
    expect(getErrorMessage('string error')).toBe('오류가 발생했어요')
    expect(getErrorMessage(42)).toBe('오류가 발생했어요')
  })
})
