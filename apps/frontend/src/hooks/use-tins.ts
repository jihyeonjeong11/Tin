import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getErrorMessage } from '@/lib/api'
import type { TinResponse, CreateTinInput, UpdateTinInput } from '@tin/shared'

// ─── Query keys ───────────────────────────────────────────────────────────────

export const tinKeys = {
  all: ['tins'] as const,
  lists: () => [...tinKeys.all, 'list'] as const,
  list: (type?: 'letting_go' | 'reflection') => [...tinKeys.lists(), { type }] as const,
  detail: (id: string) => [...tinKeys.all, 'detail', id] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useTins(type?: 'letting_go' | 'reflection') {
  return useQuery({
    queryKey: tinKeys.list(type),
    queryFn: () =>
      api
        .get<TinResponse[]>('/api/v1/tins', { params: type ? { type } : undefined })
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
      toast.success('Tin을 기록했어요')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
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
      toast.success('수정했어요')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
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
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
