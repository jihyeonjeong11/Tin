'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '@tin/shared'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })
    if (result.error || !result.data) {
      setServerError(result.error?.message ?? '로그인에 실패했습니다.')
      return
    }

    const next = searchParams.get('next')
    router.push(next?.startsWith('/') ? next : '/home')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-10 block text-center font-serif text-2xl text-foreground">
          Tin
        </Link>

        <h1 className="mb-1 text-center font-serif text-2xl text-foreground">다시 돌아왔군요</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">오늘도 기록해볼까요?</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Field htmlFor="email" label="이메일" error={errors.email?.message}>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
          </Field>

          <Field htmlFor="password" label="비밀번호" error={errors.password?.message}>
            <Input
              {...register('password')}
              id="password"
              type="password"
              placeholder="비밀번호"
              aria-invalid={!!errors.password}
              autoComplete="current-password"
            />
          </Field>

          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? '로그인 중…' : '로그인'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          아직 계정이 없으신가요?{' '}
          <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
            시작하기
          </Link>
        </p>
      </div>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  htmlFor,
  label,
  error,
  children,
}: {
  htmlFor: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className={cn('text-sm font-medium', error ? 'text-destructive' : 'text-foreground')}
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
