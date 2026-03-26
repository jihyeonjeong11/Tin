'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTinSchema, type CreateTinInput } from '@tin/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Archive, Feather } from 'lucide-react'
import { useCreateTin } from '@/hooks/use-tins'
import { useTags } from '@/hooks/use-tags'

type TinType = 'letting_go' | 'reflection'

export default function NewTinPage() {
  const router = useRouter()
  const [tinType, setTinType] = useState<TinType | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  const createTin = useCreateTin()
  const { data: tags = [] } = useTags()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTinInput>({
    resolver: zodResolver(CreateTinSchema),
  })

  const onSubmit = async (data: CreateTinInput) => {
    await createTin.mutateAsync({ ...data, tagIds: selectedTagIds })
    router.push('/home')
  }

  const handleTypeSelect = (type: TinType) => {
    setTinType(type)
    setValue('type', type)
  }

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
      setValue('tagIds', next)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-8 font-serif text-2xl text-foreground">새 Tin</h1>

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
          <label className="text-sm font-medium text-foreground">제목</label>
          <Input
            {...register('title')}
            placeholder="무엇을 기록할까요?"
            aria-invalid={!!errors.title}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            {tinType === 'letting_go' ? '포기한 날짜' : '기록 날짜'}
          </label>
          <Input {...register('givenUpAt')} type="date" aria-invalid={!!errors.givenUpAt} />
          {errors.givenUpAt && (
            <p className="text-xs text-destructive">{errors.givenUpAt.message}</p>
          )}
        </div>

        {/* Feeling */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">감정 / 메모 (선택)</label>
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
            <label className="text-sm font-medium text-foreground">태그 (선택)</label>
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
          <Button type="submit" disabled={isSubmitting || createTin.isPending || !tinType}>
            {createTin.isPending ? '저장 중…' : '미관으로 남기기'}
          </Button>
        </div>
      </form>
    </div>
  )
}

// ─── TypeCard ─────────────────────────────────────────────────────────────────

function TypeCard({
  type,
  label,
  sub,
  icon: Icon,
  selected,
  onSelect,
}: {
  type: TinType
  label: string
  sub: string
  icon: React.ElementType
  selected: boolean
  onSelect: (type: TinType) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className={cn(
        'flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50',
      )}
    >
      <Icon className={cn('size-4', selected ? 'text-primary' : 'text-muted-foreground')} />
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </button>
  )
}
