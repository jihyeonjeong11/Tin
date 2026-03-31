import Link from 'next/link'
import { Archive, Feather } from 'lucide-react'
import { formatDate } from '@/lib/format'
import type { TinResponse } from '@tin/shared'

export function TinCard({ tin }: { tin: TinResponse }) {
  return (
    <Link
      href={`/home/${tin.id}`}
      data-testid="tin-card"
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
    </Link>
  )
}
