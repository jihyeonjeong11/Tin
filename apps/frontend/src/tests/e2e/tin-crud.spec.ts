import { test, expect, type Page } from '@playwright/test'

const TEST_USER = {
  email: `e2e-crud-${Date.now()}@tin-test.local`,
  password: 'testpassword123',
  name: 'CRUD 테스트 유저',
}

async function signUp(page: Page) {
  await page.goto('/register')
  await page.getByLabel('이름').fill(TEST_USER.name)
  await page.getByLabel('이메일').fill(TEST_USER.email)
  await page.getByLabel('비밀번호').fill(TEST_USER.password)
  await page.getByRole('button', { name: '시작하기' }).click()
  await expect(page).toHaveURL('/home')
}

test.describe('Tin CRUD 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await signUp(page)
  })

  // ── 새 아쉬움 작성 ──────────────────────────────────────────────────────────
  test('letting_go 타입 Tin 작성 → 목록에 노출', async ({ page }) => {
    await page.getByRole('link', { name: '새 Tin' }).click()
    await expect(page).toHaveURL('/home/new')

    // 타입 선택
    await page.getByRole('button', { name: '놓아버림' }).click()

    // 제목
    await page.getByLabel('제목').fill('개발 공부 포기')

    // 날짜
    await page.getByLabel('포기한 날짜').fill('2026-01-15')

    // 감정 (선택)
    await page.getByPlaceholder('그때 어떤 감정이었나요?').fill('힘들었지만 의미 있었다')

    await page.getByRole('button', { name: '미관으로 남기기' }).click()

    await expect(page).toHaveURL('/home')
    await expect(page.getByText('개발 공부 포기')).toBeVisible()
  })

  test('reflection 타입 Tin 작성 → 목록에 노출', async ({ page }) => {
    await page.getByRole('link', { name: '새 Tin' }).click()

    await page.getByRole('button', { name: '돌아봄' }).click()
    await page.getByLabel('제목').fill('그때의 선택 돌아보기')
    await page.getByLabel('기록 날짜').fill('2026-01-15')

    await page.getByRole('button', { name: '미관으로 남기기' }).click()

    await expect(page).toHaveURL('/home')
    await expect(page.getByText('그때의 선택 돌아보기')).toBeVisible()
  })

  test('타입 미선택 시 저장 버튼 비활성화', async ({ page }) => {
    await page.getByRole('link', { name: '새 Tin' }).click()

    await page.getByLabel('제목').fill('테스트')
    await page.getByLabel('포기한 날짜').fill('2026-01-15')

    await expect(page.getByRole('button', { name: '미관으로 남기기' })).toBeDisabled()
  })

  // ── Tin 상세 보기 ───────────────────────────────────────────────────────────
  test('Tin 카드 클릭 → 상세 페이지', async ({ page }) => {
    // Tin 작성
    await page.getByRole('link', { name: '새 Tin' }).click()
    await page.getByRole('button', { name: '놓아버림' }).click()
    await page.getByLabel('제목').fill('상세 보기 테스트')
    await page.getByLabel('포기한 날짜').fill('2026-01-15')
    await page.getByRole('button', { name: '미관으로 남기기' }).click()

    await page.getByText('상세 보기 테스트').click()

    await expect(page).toHaveURL(/\/home\/.+/)
    await expect(page.getByRole('heading', { name: '상세 보기 테스트' })).toBeVisible()
  })

  // ── 버리기 결정 → 아카이브 ─────────────────────────────────────────────────
  test('Tin 아카이브 → 흘려보낸 것들 탭에서 확인', async ({ page }) => {
    // Tin 작성
    await page.getByRole('link', { name: '새 Tin' }).click()
    await page.getByRole('button', { name: '놓아버림' }).click()
    await page.getByLabel('제목').fill('아카이브할 Tin')
    await page.getByLabel('포기한 날짜').fill('2026-01-15')
    await page.getByRole('button', { name: '미관으로 남기기' }).click()

    // 상세 진입 후 아카이브
    await page.getByText('아카이브할 Tin').click()
    await page.getByRole('button', { name: '아카이브' }).click()

    await expect(page).toHaveURL('/home')

    // 흘려보낸 것들 탭에서 확인
    await page.getByRole('button', { name: '흘려보낸 것들' }).click()
    await expect(page.getByText('아카이브할 Tin')).toBeVisible()
  })

  // ── 아카이브 복구 ───────────────────────────────────────────────────────────
  test('아카이브 복구 → 보관 중 탭으로 이동', async ({ page }) => {
    // Tin 작성 후 아카이브
    await page.getByRole('link', { name: '새 Tin' }).click()
    await page.getByRole('button', { name: '놓아버림' }).click()
    await page.getByLabel('제목').fill('복구할 Tin')
    await page.getByLabel('포기한 날짜').fill('2026-01-15')
    await page.getByRole('button', { name: '미관으로 남기기' }).click()

    await page.getByText('복구할 Tin').click()
    await page.getByRole('button', { name: '아카이브' }).click()
    await expect(page).toHaveURL('/home')

    // 흘려보낸 것들 탭 → 상세 → 복구
    await page.getByRole('button', { name: '흘려보낸 것들' }).click()
    await page.getByText('복구할 Tin').click()
    await page.getByRole('button', { name: '복구' }).click()

    await expect(page).toHaveURL('/home')

    // 보관 중 탭에서 확인
    await expect(page.getByText('복구할 Tin')).toBeVisible()
  })

  // ── 삭제 ───────────────────────────────────────────────────────────────────
  test('Tin 삭제 → 목록에서 제거', async ({ page }) => {
    // Tin 작성
    await page.getByRole('link', { name: '새 Tin' }).click()
    await page.getByRole('button', { name: '놓아버림' }).click()
    await page.getByLabel('제목').fill('삭제할 Tin')
    await page.getByLabel('포기한 날짜').fill('2026-01-15')
    await page.getByRole('button', { name: '미관으로 남기기' }).click()

    await page.getByText('삭제할 Tin').click()

    // confirm 다이얼로그 수락
    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: '삭제' }).click()

    await expect(page).toHaveURL('/home')
    await expect(page.getByText('삭제할 Tin')).not.toBeVisible()
  })

  // ── 대시보드 탭 전환 ────────────────────────────────────────────────────────
  test('빈 보관 중 탭 → 빈 상태 메시지', async ({ page }) => {
    await expect(page.getByText('비어있어요')).toBeVisible()
  })
})
