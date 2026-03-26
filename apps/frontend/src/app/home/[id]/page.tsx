'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { useTin, useDeleteTin } from '@/hooks/use-tins'
import type { TinResponse } from '@tin/shared'

export default function TinDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const { data: tin, isLoading } = useTin(id)
  const deleteTin = useDeleteTin()

  if (isLoading) return <TinDetailSkeleton />

  if (!tin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-2xl text-foreground/40">찾을 수 없어요</p>
        <Button variant="ghost" className="mt-6" onClick={() => router.back()}>
          돌아가기
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (!confirm('정말 삭제할까요?')) return
    deleteTin.mutate(id, { onSuccess: () => router.push('/home') })
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Back */}
      <Link
        href="/home"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        목록
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <TypeBadge type={tin.type} />
          <h1 className="font-serif text-2xl text-foreground">{tin.title}</h1>
          <p className="text-sm text-muted-foreground">
            {tin.type === 'letting_go' ? '흘려보낸 날' : '기록한 날'} · {formatDate(tin.givenUpAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="수정" disabled={deleteTin.isPending}>
            <Link href={`/home/${id}/edit`}>
              <Pencil />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            aria-label="삭제"
            disabled={deleteTin.isPending}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {/* Feeling */}
      {tin.feeling && (
        <p className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {tin.feeling}
        </p>
      )}

      {/* Tags */}
      {tin.tags && tin.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tin.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-8 h-px w-full bg-border/50" />
      <p className="mt-4 text-xs text-muted-foreground/50">{formatDate(tin.createdAt)} 에 기록됨</p>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: TinResponse['type'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        type === 'letting_go'
          ? 'bg-primary/10 text-primary'
          : 'bg-secondary text-secondary-foreground',
      )}
    >
      {type === 'letting_go' ? '놓아버림' : '돌아봄'}
    </span>
  )
}

function TinDetailSkeleton() {
  return (
    <div className="mx-auto max-w-xl animate-pulse">
      <div className="mb-6 h-4 w-12 rounded bg-muted" />
      <div className="h-7 w-2/3 rounded bg-muted" />
      <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
      <div className="mt-8 space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-4/6 rounded bg-muted" />
      </div>
    </div>
  )
}
