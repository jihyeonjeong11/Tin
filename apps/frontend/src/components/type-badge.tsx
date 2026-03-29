import { cn } from '@/lib/utils'
import type { TinType } from '@tin/shared'

export function TypeBadge({ type }: { type: TinType }) {
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
