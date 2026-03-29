export function TinDetailSkeleton() {
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
