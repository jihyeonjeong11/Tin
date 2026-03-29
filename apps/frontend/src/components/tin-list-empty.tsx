import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/lib/button-variants'
import type { TinType } from '@tin/shared'

export function TinListEmpty({ tab }: { tab: TinType }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-4xl text-foreground/20">
        {tab === 'letting_go' ? '비어있어요' : '아직 없어요'}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {tab === 'letting_go' ? '흘려보낸 것들이 여기 쌓입니다.' : '보관 중인 기록을 남겨볼까요?'}
      </p>
      <Link href="/home/new" className={cn(buttonVariants(), 'mt-8')}>
        새 Tin 만들기
      </Link>
    </div>
  )
}
