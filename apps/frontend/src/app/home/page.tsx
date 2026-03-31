'use client'

import Link from 'next/link'
import { useState } from 'react'
import { buttonVariants } from '@/lib/button-variants'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTins } from '@/hooks/use-tins'
import { TinCard } from '@/components/tin-card'
import { TinListEmpty } from '@/components/tin-list-empty'
import { TinListSkeleton } from '@/components/tin-list-skeleton'
import type { TinType } from '@tin/shared'

export default function HomePage() {
  const [tab, setTab] = useState<TinType>('reflection')
  const { data: tins = [], isLoading } = useTins(tab)

  return (
    <div>
      {/* Tabs + CTA */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(['reflection', 'letting_go'] as TinType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              data-testid={`tab-${t}`}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                tab === t
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t === 'letting_go' ? '흘려보낸 것들' : '아쉬운 것들'}
            </button>
          ))}
        </div>

        <Link
          href="/home/new"
          className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
          data-testid="new-tin-link"
        >
          <Plus className="size-3.5" />새 Tin
        </Link>
      </div>

      {/* List */}
      <div className="mt-6">
        {isLoading ? (
          <TinListSkeleton />
        ) : tins.length === 0 ? (
          <TinListEmpty tab={tab} />
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
