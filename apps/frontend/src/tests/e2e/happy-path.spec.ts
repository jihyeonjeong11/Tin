import { test, expect } from '@playwright/test'

const uniqueEmail = () => `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@tin-test.local`

test('앱 컴플리트 패스: 회원가입 → Tin 작성 → 아카이브 → 로그아웃', async ({ page }) => {
  const email = uniqueEmail()
  const password = 'testpassword123'

  // 1. 랜딩 진입
  await page.goto('/')

  // 2. 회원가입
  await page.goto('/register')
  await page.getByLabel('이름').fill('테스트 유저')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill(password)
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: '시작하기' }).click()
  await expect(page).toHaveURL('/home')

  // 3. Tin 작성 (letting_go)
  await page.getByRole('link', { name: '새 Tin' }).click()
  await expect(page).toHaveURL('/home/new')
  await page.getByRole('button', { name: '놓아버림' }).click()
  await page.getByLabel('제목').fill('개발 공부 포기')
  await page.getByLabel('포기한 날짜').fill('2026-01-15')
  await page.getByRole('button', { name: '미관으로 남기기' }).click()

  // 4. 목록 확인
  await expect(page).toHaveURL('/home')
  await expect(page.getByText('개발 공부 포기')).toBeVisible()

  // 5. 상세 진입
  await page.getByText('개발 공부 포기').click()
  await expect(page).toHaveURL(/\/home\/.+/)

  // 6. 아카이브
  await page.getByRole('button', { name: '아카이브' }).click()
  await expect(page).toHaveURL('/home')

  // 7. 로그아웃
  await page.getByRole('button', { name: '로그아웃' }).click()
  await expect(page).toHaveURL(/\/(login|$)/)
})
