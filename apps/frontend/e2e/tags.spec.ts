import { test, expect, type Page } from '@playwright/test'

const TEST_USER = {
  email: `e2e-tags-${Date.now()}@tin-test.local`,
  password: 'testpassword123',
  name: '태그 테스트 유저',
}

async function signUp(page: Page) {
  await page.goto('/register')
  await page.getByLabel('이름').fill(TEST_USER.name)
  await page.getByLabel('이메일').fill(TEST_USER.email)
  await page.getByLabel('비밀번호').fill(TEST_USER.password)
  await page.getByRole('button', { name: '시작하기' }).click()
  await expect(page).toHaveURL('/home')
}

test.describe('태그 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await signUp(page)
  })

  test('태그 생성 → 태그 목록에 노출', async ({ page }) => {
    await page.goto('/home/tags')

    await page.getByPlaceholder(/태그/).fill('개발')
    await page.getByRole('button', { name: '추가' }).click()

    await expect(page.getByText('개발')).toBeVisible()
  })

  test('Tin 작성 시 태그 선택 → 상세 페이지에서 확인', async ({ page }) => {
    // 태그 먼저 생성
    await page.goto('/home/tags')
    await page.getByPlaceholder(/태그/).fill('독서')
    await page.getByRole('button', { name: '추가' }).click()
    await expect(page.getByText('독서')).toBeVisible()

    // Tin 작성 시 태그 선택
    await page.getByRole('link', { name: '새 Tin' }).click()
    await page.getByRole('button', { name: '놓아버림' }).click()
    await page.getByLabel('제목').fill('책 읽기 포기')
    await page.getByLabel('포기한 날짜').fill('2026-01-15')

    // 태그 선택
    await page.getByRole('button', { name: '독서' }).click()

    await page.getByRole('button', { name: '미관으로 남기기' }).click()
    await expect(page).toHaveURL('/home')

    // 상세에서 태그 확인
    await page.getByText('책 읽기 포기').click()
    await expect(page.getByText('독서')).toBeVisible()
  })

  test('태그 삭제 → 목록에서 제거', async ({ page }) => {
    await page.goto('/home/tags')

    await page.getByPlaceholder(/태그/).fill('삭제태그')
    await page.getByRole('button', { name: '추가' }).click()
    await expect(page.getByText('삭제태그')).toBeVisible()

    await page.getByRole('button', { name: '삭제태그 삭제' }).click()

    await expect(page.getByText('삭제태그')).not.toBeVisible()
  })
})
