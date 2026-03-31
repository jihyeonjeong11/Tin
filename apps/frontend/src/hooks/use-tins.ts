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
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: tinKeys.lists() })
      const previousLists = qc.getQueriesData<TinResponse[]>({ queryKey: tinKeys.lists() })
      const tempTin: TinResponse = {
        id: `temp-${Date.now()}`,
        userId: '',
        title: data.title,
        givenUpAt: data.givenUpAt,
        feeling: data.feeling ?? null,
        type: data.type,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      qc.setQueriesData<TinResponse[]>({ queryKey: tinKeys.lists() }, (old) =>
        old ? [tempTin, ...old] : [tempTin],
      )
      return { previousLists }
    },
    onSuccess: () => {
      toast.success('Tin을 기록했어요')
    },
    onError: (error, _data, context) => {
      context?.previousLists.forEach(([key, val]) => qc.setQueryData(key, val))
      toast.error(getErrorMessage(error))
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: tinKeys.lists() })
    },
  })
}

export function useUpdateTin(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTinInput) =>
      api.patch<TinResponse>(`/api/v1/tins/${id}`, data).then((r) => r.data),
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: tinKeys.detail(id) })
      await qc.cancelQueries({ queryKey: tinKeys.lists() })
      const previousDetail = qc.getQueryData<TinResponse>(tinKeys.detail(id))
      const previousLists = qc.getQueriesData<TinResponse[]>({ queryKey: tinKeys.lists() })
      if (previousDetail) {
        qc.setQueryData<TinResponse>(tinKeys.detail(id), { ...previousDetail, ...data })
      }
      qc.setQueriesData<TinResponse[]>({ queryKey: tinKeys.lists() }, (old) =>
        old?.map((tin) => (tin.id === id ? { ...tin, ...data } : tin)),
      )
      return { previousDetail, previousLists }
    },
    onSuccess: (updated) => {
      qc.setQueryData(tinKeys.detail(id), updated)
      toast.success('수정했어요')
    },
    onError: (error, _data, context) => {
      if (context?.previousDetail) qc.setQueryData(tinKeys.detail(id), context.previousDetail)
      context?.previousLists.forEach(([key, val]) => qc.setQueryData(key, val))
      toast.error(getErrorMessage(error))
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: tinKeys.lists() })
    },
  })
}

export function useDeleteTin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/tins/${id}`).then((r) => r.data),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: tinKeys.lists() })
      const previousLists = qc.getQueriesData<TinResponse[]>({ queryKey: tinKeys.lists() })
      qc.setQueriesData<TinResponse[]>({ queryKey: tinKeys.lists() }, (old) =>
        old?.filter((tin) => tin.id !== id),
      )
      return { previousLists }
    },
    onError: (error, _id, context) => {
      context?.previousLists.forEach(([key, val]) => qc.setQueryData(key, val))
      toast.error(getErrorMessage(error))
    },
    onSettled: (_data, _error, id) => {
      qc.removeQueries({ queryKey: tinKeys.detail(id) })
      qc.invalidateQueries({ queryKey: tinKeys.lists() })
    },
  })
}
