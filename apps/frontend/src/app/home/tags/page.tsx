'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTagSchema, type CreateTagInput } from '@tin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function TagsPage() {
  // TODO: useTags(), useCreateTag(), useDeleteTag()
  const tags: { id: string; name: string }[] = []
  const [isAdding, setIsAdding] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTagInput>({
    resolver: zodResolver(CreateTagSchema),
  })

  const onSubmit = async (_data: CreateTagInput) => {
    // TODO: useCreateTag mutation
    reset()
    setIsAdding(false)
  }

  const handleDelete = async (_id: string) => {
    // TODO: useDeleteTag mutation
  }

  return (
    <div className="mx-auto max-w-md">
      <Link
        href="/home"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        대시보드
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">태그</h1>
        {!isAdding && (
          <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
            <Plus />새 태그
          </Button>
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex items-start gap-2" noValidate>
          <div className="flex flex-1 flex-col gap-1">
            <Input
              {...register('name')}
              placeholder="태그 이름"
              aria-invalid={!!errors.name}
              autoFocus
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <Button type="submit" size="default" disabled={isSubmitting}>
            추가
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset()
              setIsAdding(false)
            }}
          >
            취소
          </Button>
        </form>
      )}

      {/* Tag list */}
      <ul className="mt-6 flex flex-col divide-y divide-border">
        {tags.length === 0 ? (
          <li className="py-12 text-center text-sm text-muted-foreground">아직 태그가 없어요.</li>
        ) : (
          tags.map((tag) => (
            <li key={tag.id} className="flex items-center justify-between py-3">
              <span className="text-sm text-foreground">{tag.name}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(tag.id)}
                aria-label="태그 삭제"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
