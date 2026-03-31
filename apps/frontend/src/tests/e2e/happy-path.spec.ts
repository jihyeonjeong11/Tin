import { test, expect } from '@playwright/test'

const uniqueEmail = () => `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@tin-test.local`

test('앱 컴플리트 패스: 회원가입 → Tin 작성 → 확인 → 상세 진입 → 로그아웃', async ({ page }) => {
  const email = uniqueEmail()

  // 1. 랜딩 진입
  await page.goto('/')

  // 2. 회원가입
  await page.goto('/register')
  await page.getByLabel('이름').fill('테스트 유저')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill('testpassword123')
  await page.getByRole('checkbox').check()
  await page.getByTestId('register-submit').click()
  await expect(page).toHaveURL('/home')

  // 3. Tin 작성 (letting_go)
  await page.getByTestId('new-tin-link').click()
  await expect(page).toHaveURL('/home/new')
  await page.getByTestId('type-letting_go').click()
  await page.getByLabel('제목').fill('개발 공부 포기')
  await page.getByLabel('포기한 날짜').fill('2026-01-15')
  await page.getByTestId('create-tin-submit').click()

  // 4. 목록 확인 ("흘려보낸 것들" 탭)
  await expect(page).toHaveURL('/home')
  await page.getByTestId('tab-letting_go').click()
  await expect(page.getByTestId('tin-card').first()).toBeVisible()

  // 5. 상세 진입
  await page.getByTestId('tin-card').first().click()
  await expect(page).toHaveURL(/\/home\/.+/)
  await expect(page.getByText('개발 공부 포기')).toBeVisible()

  // 6. 로그아웃
  await page.getByTestId('logout-button').click()
  await expect(page).toHaveURL(/\/(login|$)/)
})
