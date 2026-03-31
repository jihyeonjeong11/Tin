'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RegisterSchema } from '@tin/shared'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/form-field'

const RegisterFormSchema = RegisterSchema.extend({
  agreed: z.literal(true, { errorMap: () => ({ message: '약관에 동의해주세요.' }) }),
})
type RegisterFormInput = z.infer<typeof RegisterFormSchema>

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(RegisterFormSchema),
  })

  const onSubmit = async (data: RegisterFormInput) => {
    setServerError(null)
    try {
      const result = await authClient.signUp.email(
        { name: data.name, email: data.email, password: data.password },
        {
          onSuccess: (ctx) => {
            const token = ctx.response.headers.get('set-auth-token')
            if (token) {
              localStorage.setItem('bearer_token', token)
            }
          },
        },
      )
      if (result.error) {
        setServerError(result.error.message ?? '회원가입에 실패했습니다.')
        return
      }
      window.location.href = '/home'
    } catch {
      setServerError('서버에 연결할 수 없어요')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-10 block text-center font-serif text-2xl text-foreground">
          Tin
        </Link>

        <h1 className="mb-1 text-center font-serif text-2xl text-foreground">계정 만들기</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          기록을 시작할 준비가 됐나요?
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField htmlFor="name" label="이름" error={errors.name?.message}>
            <Input
              {...register('name')}
              id="name"
              placeholder="홍길동"
              aria-invalid={!!errors.name}
              autoComplete="name"
            />
          </FormField>

          <FormField htmlFor="email" label="이메일" error={errors.email?.message}>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
          </FormField>

          <FormField htmlFor="password" label="비밀번호" error={errors.password?.message}>
            <Input
              {...register('password')}
              id="password"
              type="password"
              placeholder="8자 이상"
              aria-invalid={!!errors.password}
              autoComplete="new-password"
            />
          </FormField>

          <Controller
            control={control}
            name="agreed"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="agreed"
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked ? true : false)}
                    aria-invalid={!!errors.agreed}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="agreed"
                    className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
                  >
                    <Link
                      href="/terms"
                      className="text-foreground underline-offset-4 hover:underline"
                      target="_blank"
                    >
                      이용약관
                    </Link>{' '}
                    및{' '}
                    <Link
                      href="/privacy"
                      className="text-foreground underline-offset-4 hover:underline"
                      target="_blank"
                    >
                      개인정보처리방침
                    </Link>
                    에 동의합니다.
                  </label>
                </div>
                {errors.agreed && (
                  <p className="text-xs text-destructive">{errors.agreed.message}</p>
                )}
              </div>
            )}
          />

          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="mt-2 w-full"
            data-testid="register-submit"
          >
            {isSubmitting ? '가입 중…' : '시작하기'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
