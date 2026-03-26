'use client'

import Link from 'next/link'
import { useState } from 'react'
import { buttonVariants } from '@/lib/button-variants'
import { Badge } from '@/components/ui/badge'
import { Plus, Archive, Feather } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTins } from '@/hooks/use-tins'
import type { TinResponse } from '@tin/shared'
import { formatDate } from '@/lib/format'

type Tab = 'pending' | 'archived'

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('pending')
  const { data: tins = [], isLoading } = useTins(tab)

  return (
    <div>
      {/* Tabs + CTA */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(['pending', 'archived'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                tab === t
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t === 'pending' ? '보관 중' : '흘려보낸 것들'}
            </button>
          ))}
        </div>

        <Link href="/home/new" className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}>
          <Plus className="size-3.5" />새 Tin
        </Link>
      </div>

      {/* List */}
      <div className="mt-6">
        {isLoading ? (
          <ListSkeleton />
        ) : tins.length === 0 ? (
          <Empty tab={tab} />
        ) : (
          <div className="flex flex-col gap-3">
            {tins.map((tin) => (
              <TinCard key={tin.id} tin={tin} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TinCard ──────────────────────────────────────────────────────────────────

function TinCard({ tin }: { tin: TinResponse }) {
  return (
    <Link
      href={`/home/${tin.id}`}
      className="group flex flex-col gap-2 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {tin.type === 'letting_go' ? (
            <Archive className="size-3.5 shrink-0 text-primary/60" />
          ) : (
            <Feather className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">{tin.title}</span>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{formatDate(tin.givenUpAt)}</span>
      </div>

      {tin.feeling && (
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{tin.feeling}</p>
      )}

      {tin.tags && tin.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tin.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  )
}

// ─── Empty ────────────────────────────────────────────────────────────────────

function Empty({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-4xl text-foreground/20">
        {tab === 'pending' ? '비어있어요' : '아직 없어요'}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {tab === 'pending' ? '첫 번째 기록을 남겨볼까요?' : '아카이브한 Tin이 여기 쌓입니다.'}
      </p>
      {tab === 'pending' && (
        <Link href="/home/new" className={cn(buttonVariants(), 'mt-8')}>
          새 Tin 만들기
        </Link>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border p-4">
          <div className="flex justify-between">
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
          <div className="mt-2 h-3 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}
