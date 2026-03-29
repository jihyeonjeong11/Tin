import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
  getErrorMessage: vi.fn((err: unknown) =>
    err instanceof Error ? err.message : '오류가 발생했어요',
  ),
}))

import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useCreateTin, useUpdateTin, useDeleteTin } from '@/hooks/use-tins'
import type { TinResponse } from '@tin/shared'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children)
}

const mockTin: TinResponse = {
  id: 'tin-1',
  userId: 'user-1',
  title: '테스트',
  givenUpAt: '2026-01-01',
  feeling: null,
  type: 'letting_go',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useCreateTin', () => {
  it('성공 시 toast.success를 호출한다', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: mockTin })

    const { result } = renderHook(() => useCreateTin(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate({ title: '테스트', givenUpAt: '2026-01-01', type: 'letting_go' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('Tin을 기록했어요')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('실패 시 toast.error를 호출한다', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('서버 오류'))

    const { result } = renderHook(() => useCreateTin(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate({ title: '테스트', givenUpAt: '2026-01-01', type: 'letting_go' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })
})

describe('useUpdateTin', () => {
  it('성공 시 toast.success를 호출한다', async () => {
    vi.mocked(api.patch).mockResolvedValue({ data: mockTin })

    const { result } = renderHook(() => useUpdateTin('tin-1'), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate({ title: '수정된 제목' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('수정했어요')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('실패 시 toast.error를 호출한다', async () => {
    vi.mocked(api.patch).mockRejectedValue(new Error('수정 실패'))

    const { result } = renderHook(() => useUpdateTin('tin-1'), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate({ title: '수정된 제목' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })
})

describe('useDeleteTin', () => {
  it('성공 시 toast를 호출하지 않는다 (삭제는 페이지 이동으로 피드백)', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: {} })

    const { result } = renderHook(() => useDeleteTin(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate('tin-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('실패 시 toast.error를 호출한다', async () => {
    vi.mocked(api.delete).mockRejectedValue(new Error('삭제 실패'))

    const { result } = renderHook(() => useDeleteTin(), { wrapper: makeWrapper() })

    await act(async () => {
      result.current.mutate('tin-1')
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalled()
  })
})
