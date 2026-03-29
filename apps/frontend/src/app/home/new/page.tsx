'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTinSchema, type CreateTinInput } from '@tin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Archive, Feather } from 'lucide-react'
import { useCreateTin } from '@/hooks/use-tins'
import { TypeCard } from '@/components/type-card'
import type { TinType } from '@tin/shared'

export default function NewTinPage() {
  const router = useRouter()
  const [tinType, setTinType] = useState<TinType | null>(null)

  const createTin = useCreateTin()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTinInput>({
    resolver: zodResolver(CreateTinSchema),
  })

  const onSubmit = async (data: CreateTinInput) => {
    try {
      await createTin.mutateAsync(data)
      router.push('/home')
    } catch {
      // 에러 토스트는 useCreateTin onError에서 처리
    }
  }

  const handleTypeSelect = (type: TinType) => {
    setTinType(type)
    setValue('type', type)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-8 font-serif text-2xl text-foreground">새 Tin</h1>

      <fieldset disabled={createTin.isPending} className="flex flex-col gap-6 disabled:opacity-60">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Type selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">어떤 기록인가요?</label>
            <div className="grid grid-cols-2 gap-3">
              <TypeCard
                type="letting_go"
                label="놓아버림"
                sub="버리기로 한 것"
                icon={Archive}
                selected={tinType === 'letting_go'}
                onSelect={handleTypeSelect}
              />
              <TypeCard
                type="reflection"
                label="돌아봄"
                sub="다시 보고 싶은 것"
                icon={Feather}
                selected={tinType === 'reflection'}
                onSelect={handleTypeSelect}
              />
            </div>
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              제목
            </label>
            <Input
              {...register('title')}
              id="title"
              placeholder="무엇을 기록할까요?"
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="givenUpAt" className="text-sm font-medium text-foreground">
              {tinType === 'letting_go' ? '포기한 날짜' : '기록 날짜'}
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
              감정 / 메모 (선택)
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
            <Button type="submit" disabled={isSubmitting || !tinType}>
              {createTin.isPending ? '저장 중…' : '기록하기'}
            </Button>
          </div>
        </form>
      </fieldset>
    </div>
  )
}
