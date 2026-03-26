'use client'

import Link from 'next/link'
import { useState } from 'react'
import { buttonVariants } from '@/lib/button-variants'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'pending' | 'archived'

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('pending')

  // TODO: useTins({ status: tab })
  const tins: never[] = []
  const isEmpty = tins.length === 0

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
        {isEmpty ? (
          <Empty tab={tab} />
        ) : (
          <div className="flex flex-col gap-3">{/* TinCard list — coming with API hooks */}</div>
        )}
      </div>
    </div>
  )
}

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
