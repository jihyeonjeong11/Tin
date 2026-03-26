'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateTinSchema, type UpdateTinInput, type TinResponse } from '@tin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditTinPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // TODO: useTin(id)
  const tin: TinResponse | null = null
  const isLoading = false

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
    const tagIds = tin.tags?.map((t) => t.id) ?? []
    setSelectedTagIds(tagIds)
    setValue('tagIds', tagIds)
  }, [tin, reset, setValue])

  const onSubmit = async (_data: UpdateTinInput) => {
    // TODO: useUpdateTin mutation
    router.push(`/home/${id}`)
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const next = prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
      setValue('tagIds', next, { shouldDirty: true })
      return next
    })
  }

  // TODO: useTags()
  const tags: { id: string; name: string }[] = []

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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">제목</label>
          <Input {...register('title')} placeholder="제목" aria-invalid={!!errors.title} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">날짜</label>
          <Input {...register('givenUpAt')} type="date" aria-invalid={!!errors.givenUpAt} />
          {errors.givenUpAt && (
            <p className="text-xs text-destructive">{errors.givenUpAt.message}</p>
          )}
        </div>

        {/* Feeling */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">감정 / 메모</label>
          <textarea
            {...register('feeling')}
            rows={4}
            placeholder="그때 어떤 감정이었나요?"
            className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">태그</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}>
                  <Badge
                    variant={selectedTagIds.includes(tag.id) ? 'default' : 'secondary'}
                    className="cursor-pointer"
                  >
                    {tag.name}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? '저장 중…' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  )
}
