import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// ─── Mock api ─────────────────────────────────────────────────────────────────

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}
vi.mock('@/lib/api', () => ({ api: mockApi }))

import { useTags, useCreateTag, useDeleteTag, tagKeys } from './use-tags'

// ─── Wrapper ──────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return {
    qc,
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: qc }, children),
  }
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const TAG_ID = 'cccccccc-0000-0000-0000-000000000001'

const tagResponse = {
  id: TAG_ID,
  userId: 'aaaaaaaa-0000-0000-0000-000000000001',
  name: '개발',
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('use-tags hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── 플로우: 태그 목록 (Tin 작성/수정 화면) ─────────────────────────────────
  describe('useTags — 태그 목록', () => {
    it('태그 목록 조회', async () => {
      mockApi.get.mockResolvedValue({ data: [tagResponse] })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useTags(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/tags')
      expect(result.current.data).toEqual([tagResponse])
    })

    it('태그 없으면 빈 배열', async () => {
      mockApi.get.mockResolvedValue({ data: [] })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useTags(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual([])
    })
  })

  // ── 플로우: 커스텀 태그 추가 ──────────────────────────────────────────────
  describe('useCreateTag — 태그 추가', () => {
    it('태그 생성 성공', async () => {
      mockApi.post.mockResolvedValue({ data: tagResponse })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useCreateTag(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ name: '개발' })
      })

      expect(mockApi.post).toHaveBeenCalledWith('/api/v1/tags', { name: '개발' })
    })

    it('성공 후 태그 목록 캐시 무효화', async () => {
      mockApi.post.mockResolvedValue({ data: tagResponse })

      const { wrapper, qc } = makeWrapper()
      const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

      const { result } = renderHook(() => useCreateTag(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({ name: '개발' })
      })

      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: tagKeys.list() }),
      )
    })
  })

  // ── 플로우: 태그 삭제 ──────────────────────────────────────────────────────
  describe('useDeleteTag — 태그 삭제', () => {
    it('태그 삭제 성공', async () => {
      mockApi.delete.mockResolvedValue({ data: undefined })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useDeleteTag(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync(TAG_ID)
      })

      expect(mockApi.delete).toHaveBeenCalledWith(`/api/v1/tags/${TAG_ID}`)
    })

    it('성공 후 태그 목록 캐시 무효화', async () => {
      mockApi.delete.mockResolvedValue({ data: undefined })

      const { wrapper, qc } = makeWrapper()
      const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

      const { result } = renderHook(() => useDeleteTag(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync(TAG_ID)
      })

      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: tagKeys.list() }),
      )
    })
  })
})
