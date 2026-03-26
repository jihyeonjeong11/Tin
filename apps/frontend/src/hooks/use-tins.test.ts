import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// ─── Mock api ─────────────────────────────────────────────────────────────────

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}
vi.mock('@/lib/api', () => ({ api: mockApi }))

import {
  useTins,
  useTin,
  useCreateTin,
  useArchiveTin,
  useRestoreTin,
  useDeleteTin,
  tinKeys,
} from './use-tins'

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

const TIN_ID = 'bbbbbbbb-0000-0000-0000-000000000001'

const tinResponse = {
  id: TIN_ID,
  userId: 'aaaaaaaa-0000-0000-0000-000000000001',
  title: '개발 공부 포기',
  givenUpAt: '2026-01-15',
  feeling: '힘들었지만 의미 있었다',
  status: 'pending',
  type: 'letting_go',
  createdAt: '2026-01-20T00:00:00.000Z',
  updatedAt: '2026-01-20T00:00:00.000Z',
  tags: [{ id: 'cccccccc-0000-0000-0000-000000000001', name: '개발' }],
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('use-tins hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── 플로우: 대시보드 목록 ───────────────────────────────────────────────────
  describe('useTins — 대시보드 목록', () => {
    it('pending 목록 조회', async () => {
      mockApi.get.mockResolvedValue({ data: [tinResponse] })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useTins('pending'), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/v1/tins',
        expect.objectContaining({ params: { status: 'pending' } }),
      )
      expect(result.current.data).toEqual([tinResponse])
    })

    it('archived 목록 조회 (흘려보낸 것들)', async () => {
      mockApi.get.mockResolvedValue({ data: [] })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useTins('archived'), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/v1/tins',
        expect.objectContaining({ params: { status: 'archived' } }),
      )
    })

    it('status 없이 전체 조회', async () => {
      mockApi.get.mockResolvedValue({ data: [tinResponse] })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useTins(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/v1/tins',
        expect.objectContaining({ params: undefined }),
      )
    })
  })

  // ── 플로우: Tin 상세 보기 ───────────────────────────────────────────────────
  describe('useTin — 상세 보기', () => {
    it('특정 tin 조회', async () => {
      mockApi.get.mockResolvedValue({ data: tinResponse })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useTin(TIN_ID), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockApi.get).toHaveBeenCalledWith(`/api/v1/tins/${TIN_ID}`)
      expect(result.current.data?.title).toBe('개발 공부 포기')
    })

    it('id 없으면 쿼리 실행 안 됨', () => {
      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useTin(''), { wrapper })

      expect(result.current.fetchStatus).toBe('idle')
      expect(mockApi.get).not.toHaveBeenCalled()
    })
  })

  // ── 플로우: 새 아쉬움 작성 ─────────────────────────────────────────────────
  describe('useCreateTin — 새 아쉬움 작성', () => {
    it('letting_go 타입으로 생성', async () => {
      mockApi.post.mockResolvedValue({ data: tinResponse })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useCreateTin(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          title: '개발 공부 포기',
          givenUpAt: '2026-01-15',
          type: 'letting_go',
        })
      })

      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/v1/tins',
        expect.objectContaining({
          type: 'letting_go',
        }),
      )
    })

    it('reflection 타입으로 생성', async () => {
      const reflectionTin = { ...tinResponse, type: 'reflection' }
      mockApi.post.mockResolvedValue({ data: reflectionTin })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useCreateTin(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          title: '그때의 선택',
          givenUpAt: '2026-01-15',
          type: 'reflection',
        })
      })

      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/v1/tins',
        expect.objectContaining({
          type: 'reflection',
        }),
      )
    })

    it('성공 후 목록 캐시 무효화', async () => {
      mockApi.get.mockResolvedValue({ data: [tinResponse] })
      mockApi.post.mockResolvedValue({ data: tinResponse })

      const { wrapper, qc } = makeWrapper()
      const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

      const { result } = renderHook(() => useCreateTin(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync({
          title: '새 기록',
          givenUpAt: '2026-01-15',
          type: 'letting_go',
        })
      })

      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: tinKeys.lists() }),
      )
    })
  })

  // ── 플로우: 버리기 결정 → 아카이브 ─────────────────────────────────────────
  describe('useArchiveTin — 버리기', () => {
    it('tin 아카이브', async () => {
      const archived = { ...tinResponse, status: 'archived' }
      mockApi.patch.mockResolvedValue({ data: archived })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useArchiveTin(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync(TIN_ID)
      })

      expect(mockApi.patch).toHaveBeenCalledWith(`/api/v1/tins/${TIN_ID}/archive`)
    })
  })

  // ── 플로우: 아카이브 복구 ──────────────────────────────────────────────────
  describe('useRestoreTin — 복구', () => {
    it('tin 복구', async () => {
      const restored = { ...tinResponse, status: 'pending' }
      mockApi.patch.mockResolvedValue({ data: restored })

      const { wrapper } = makeWrapper()
      const { result } = renderHook(() => useRestoreTin(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync(TIN_ID)
      })

      expect(mockApi.patch).toHaveBeenCalledWith(`/api/v1/tins/${TIN_ID}/restore`)
    })
  })

  // ── 플로우: 삭제 ───────────────────────────────────────────────────────────
  describe('useDeleteTin', () => {
    it('tin 삭제 후 캐시에서 제거', async () => {
      mockApi.delete.mockResolvedValue({ data: undefined })

      const { wrapper, qc } = makeWrapper()
      const removeSpy = vi.spyOn(qc, 'removeQueries')

      const { result } = renderHook(() => useDeleteTin(), { wrapper })

      await act(async () => {
        await result.current.mutateAsync(TIN_ID)
      })

      expect(mockApi.delete).toHaveBeenCalledWith(`/api/v1/tins/${TIN_ID}`)
      expect(removeSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: tinKeys.detail(TIN_ID) }),
      )
    })
  })
})
