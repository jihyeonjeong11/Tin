'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/lib/button-variants'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, Archive, Feather } from 'lucide-react'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <span className="font-serif text-lg text-foreground">Tin</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            로그인
          </Link>
          <Link href="/register" className={buttonVariants({ size: 'sm' })}>
            시작하기
          </Link>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-14 text-center">
      <Badge variant="secondary" className="mb-8 rounded-pill px-4 py-1.5 text-xs tracking-widest">
        마음 챙김 노트
      </Badge>

      <h1 className="font-serif text-5xl leading-tight text-foreground sm:text-6xl md:text-7xl">
        잊어도 괜찮아,
        <br />
        <span className="text-primary">기록했으니까</span>
      </h1>

      <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
        놓아버리고 싶은 것들, 가끔 돌아보고 싶은 순간들.
        <br />
        마음 속에만 담아두지 않아도 됩니다.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/register" className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-8')}>
          지금 시작하기
          <ArrowRight className="size-4" />
        </Link>
        <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'lg' })}>
          이미 계정이 있어요
        </Link>
      </div>

      <div className="mt-24 h-px w-16 bg-border" />
    </section>
  )
}

// ─── Concept ─────────────────────────────────────────────────────────────────

function Concept() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h2 className="font-serif text-3xl text-foreground sm:text-4xl">Tin이란?</h2>
      <p className="mt-6 text-base leading-loose text-muted-foreground sm:text-lg">
        Tin은 일상에서 마주치는 감정들을 담아두는 작은 통입니다.
        <br />
        포기한 꿈, 떠나보낸 관계, 바꾸고 싶었던 습관.
        <br className="hidden sm:block" />
        <br />
        기록으로 남기면 마음이 조금 가벼워집니다.
      </p>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

const steps = [
  {
    icon: Feather,
    step: '01',
    title: '적는다',
    description: '떠오를 때 바로, 감정과 함께 기록합니다. 잘 쓸 필요 없어요.',
  },
  {
    icon: BookOpen,
    step: '02',
    title: '들여다본다',
    description: '시간이 지나면 같은 기억도 다르게 보입니다. 가끔 꺼내봐요.',
  },
  {
    icon: Archive,
    step: '03',
    title: '흘려보낸다',
    description: '충분히 봤다면 아카이브합니다. 없애는 게 아니라 놓아주는 것.',
  },
]

function HowItWorks() {
  return (
    <section className="bg-secondary/30 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-serif text-3xl text-foreground sm:text-4xl">
          이렇게 씁니다
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-4xl text-primary/30">{step}</span>
                <div className="rounded-lg bg-accent p-2">
                  <Icon className="size-4 text-accent-foreground" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

function TinTypes() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <h2 className="text-center font-serif text-3xl text-foreground sm:text-4xl">두 가지 방식</h2>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        기록의 성격에 따라 골라보세요
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {/* Letting Go */}
        <div className="tin-letting-go rounded-xl border border-border p-8">
          <p className="text-xs tracking-widest text-muted-foreground">LETTING GO</p>
          <h3 className="mt-3 font-serif text-2xl text-foreground">놓아버림</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            더 이상 붙들고 싶지 않은 것들. 포기한 일, 버린 습관, 떠나보낸 인연. 기록하고 나면 조금
            더 가벼워집니다.
          </p>
          <div className="mt-6 h-px w-8 bg-border" />
          <p className="mt-4 text-xs text-muted-foreground">
            예: "매일 새벽 5시에 일어나겠다는 다짐"
          </p>
        </div>

        {/* Reflection */}
        <div className="tin-reflection rounded-xl border border-border p-8">
          <p className="text-xs tracking-widest text-muted-foreground">REFLECTION</p>
          <h3 className="mt-3 font-serif text-2xl text-foreground">돌아봄</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            다시 한번 마주하고 싶은 순간들. 잘했던 것, 못했던 것, 배운 것. 꺼내볼수록 나를 더 알게
            됩니다.
          </p>
          <div className="mt-6 h-px w-8 bg-border" />
          <p className="mt-4 text-xs text-muted-foreground">예: "첫 직장에서 배운 것들"</p>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section className="bg-secondary/30 px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
          오늘의 감정을
          <br />
          Tin에 담아보세요
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          무료로 시작할 수 있습니다. 언제든지.
        </p>
        <Link href="/register" className={cn(buttonVariants({ size: 'lg' }), 'mt-8 gap-2 px-10')}>
          무료로 시작하기
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between text-xs text-muted-foreground">
        <span className="font-serif text-sm">Tin</span>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && session) router.replace('/home')
  }, [isPending, session, router])

  if (isPending || session) return null

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Concept />
        <HowItWorks />
        <TinTypes />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
