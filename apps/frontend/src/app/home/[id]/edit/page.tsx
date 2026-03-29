'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateTinSchema, type UpdateTinInput } from '@tin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTin, useUpdateTin } from '@/hooks/use-tins'

export default function EditTinPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const { data: tin, isLoading } = useTin(id)
  const updateTin = useUpdateTin(id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateTinInput>({
    resolver: zodResolver(UpdateTinSchema),
  })

  useEffect(() => {
    if (!tin) return
    reset({
      title: tin.title,
      givenUpAt: tin.givenUpAt,
      feeling: tin.feeling ?? undefined,
      type: tin.type,
    })
  }, [tin, reset])

  const onSubmit = async (data: UpdateTinInput) => {
    try {
      await updateTin.mutateAsync(data)
      router.push(`/home/${id}`)
    } catch {
      // 에러 토스트는 useUpdateTin onError에서 처리
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl animate-pulse space-y-4">
        <div className="h-6 w-1/3 rounded bg-muted" />
        <div className="h-10 w-full rounded bg-muted" />
        <div className="h-10 w-full rounded bg-muted" />
        <div className="h-28 w-full rounded bg-muted" />
      </div>
    )
  }

  if (!tin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-2xl text-foreground/40">찾을 수 없어요</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href={`/home/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        돌아가기
      </Link>

      <h1 className="mb-8 font-serif text-2xl text-foreground">수정하기</h1>

      <fieldset disabled={updateTin.isPending} className="flex flex-col gap-6 disabled:opacity-60">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              제목
            </label>
            <Input
              {...register('title')}
              id="title"
              placeholder="제목"
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="givenUpAt" className="text-sm font-medium text-foreground">
              {tin.type === 'letting_go' ? '포기한 날짜' : '기록 날짜'}
            </label>
            <Input
              {...register('givenUpAt')}
              id="givenUpAt"
              type="date"
              aria-invalid={!!errors.givenUpAt}
            />
            {errors.givenUpAt && (
              <p className="text-xs text-destructive">{errors.givenUpAt.message}</p>
            )}
          </div>

          {/* Feeling */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="feeling" className="text-sm font-medium text-foreground">
              감정 / 메모
            </label>
            <textarea
              {...register('feeling')}
              id="feeling"
              rows={4}
              placeholder="그때 어떤 감정이었나요?"
              className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {updateTin.isPending ? '저장 중…' : '저장'}
            </Button>
          </div>
        </form>
      </fieldset>
    </div>
  )
}
