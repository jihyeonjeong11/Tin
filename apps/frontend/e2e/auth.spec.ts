import { test, expect } from '@playwright/test'

const TEST_USER = {
  name: '테스트 유저',
  email: `e2e-${Date.now()}@tin-test.local`,
  password: 'testpassword123',
}

test.describe('인증 플로우', () => {
  test('회원가입 → 홈 리다이렉트', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('이름').fill(TEST_USER.name)
    await page.getByLabel('이메일').fill(TEST_USER.email)
    await page.getByLabel('비밀번호').fill(TEST_USER.password)
    await page.getByRole('button', { name: '시작하기' }).click()

    await expect(page).toHaveURL('/home')
  })

  test('로그인 → 홈 리다이렉트', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('이메일').fill(TEST_USER.email)
    await page.getByLabel('비밀번호').fill(TEST_USER.password)
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page).toHaveURL('/home')
  })

  test('잘못된 비밀번호 → 에러 메시지', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('이메일').fill(TEST_USER.email)
    await page.getByLabel('비밀번호').fill('wrongpassword')
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page.locator('p.text-destructive')).toBeVisible()
  })

  test('미인증 상태로 /home 접근 → /login 리다이렉트', async ({ page }) => {
    await page.goto('/home')

    await expect(page).toHaveURL(/\/login/)
  })

  test('로그아웃 → 랜딩 또는 로그인 페이지', async ({ page }) => {
    // 로그인
    await page.goto('/login')
    await page.getByLabel('이메일').fill(TEST_USER.email)
    await page.getByLabel('비밀번호').fill(TEST_USER.password)
    await page.getByRole('button', { name: '로그인' }).click()
    await expect(page).toHaveURL('/home')

    // 로그아웃
    await page.getByRole('button', { name: '로그아웃' }).click()

    await expect(page).toHaveURL(/\/(login|$)/)
  })
})
