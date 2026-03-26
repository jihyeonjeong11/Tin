import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { TinResponse, CreateTinInput, UpdateTinInput } from '@tin/shared'

// ─── Query keys ───────────────────────────────────────────────────────────────

export const tinKeys = {
  all: ['tins'] as const,
  lists: () => [...tinKeys.all, 'list'] as const,
  list: (status?: 'pending' | 'archived') => [...tinKeys.lists(), { status }] as const,
  detail: (id: string) => [...tinKeys.all, 'detail', id] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useTins(status?: 'pending' | 'archived') {
  return useQuery({
    queryKey: tinKeys.list(status),
    queryFn: () =>
      api
        .get<TinResponse[]>('/api/v1/tins', { params: status ? { status } : undefined })
        .then((r) => r.data),
  })
}

export function useTin(id: string) {
  return useQuery({
    queryKey: tinKeys.detail(id),
    queryFn: () => api.get<TinResponse>(`/api/v1/tins/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTinInput) =>
      api.post<TinResponse>('/api/v1/tins', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tinKeys.lists() })
    },
  })
}

export function useUpdateTin(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTinInput) =>
      api.patch<TinResponse>(`/api/v1/tins/${id}`, data).then((r) => r.data),
    onSuccess: (updated) => {
      qc.setQueryData(tinKeys.detail(id), updated)
      qc.invalidateQueries({ queryKey: tinKeys.lists() })
    },
  })
}

export function useArchiveTin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<TinResponse>(`/api/v1/tins/${id}/archive`).then((r) => r.data),
    onSuccess: (updated) => {
      qc.setQueryData(tinKeys.detail(updated.id), updated)
      qc.setQueryData(
        tinKeys.list('pending'),
        (old: TinResponse[] | undefined) => old?.filter((t) => t.id !== updated.id) ?? [],
      )
      qc.invalidateQueries({ queryKey: tinKeys.lists() })
    },
  })
}

export function useRestoreTin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<TinResponse>(`/api/v1/tins/${id}/restore`).then((r) => r.data),
    onSuccess: (updated) => {
      qc.setQueryData(tinKeys.detail(updated.id), updated)
      qc.setQueryData(
        tinKeys.list('archived'),
        (old: TinResponse[] | undefined) => old?.filter((t) => t.id !== updated.id) ?? [],
      )
      qc.invalidateQueries({ queryKey: tinKeys.lists() })
    },
  })
}

export function useDeleteTin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/tins/${id}`).then((r) => r.data),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: tinKeys.detail(id) })
      qc.invalidateQueries({ queryKey: tinKeys.lists() })
    },
  })
}
