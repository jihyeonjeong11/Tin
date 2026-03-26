import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { TagResponse, CreateTagInput } from '@tin/shared'

// ─── Query keys ───────────────────────────────────────────────────────────────

export const tagKeys = {
  all: ['tags'] as const,
  list: () => [...tagKeys.all, 'list'] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useTags() {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => api.get<TagResponse[]>('/api/v1/tags').then((r) => r.data),
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTagInput) =>
      api.post<TagResponse>('/api/v1/tags', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.list() })
    },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/tags/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.list() })
    },
  })
}
