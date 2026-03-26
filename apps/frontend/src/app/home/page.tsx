'use client'

import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { LogOut } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <span className="font-serif text-lg text-foreground">Tin</span>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {session?.user.name}
            </span>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="로그아웃">
              <LogOut />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-serif text-4xl text-foreground/20">비어있어요</p>
          <p className="mt-3 text-sm text-muted-foreground">첫 번째 기록을 남겨볼까요?</p>
          <Button className="mt-8">새 Tin 만들기</Button>
        </div>
      </main>
    </div>
  )
}
