'use client'

import { cn } from '@/lib/utils'
import type { TinType } from '@tin/shared'

export function TypeCard({
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
