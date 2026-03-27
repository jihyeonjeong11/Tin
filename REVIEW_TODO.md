# REVIEW_TODO.md

코드리뷰 및 개선 작업 목록. 완료 시 `[x]`로 표시.

블로그: tsup 이슈, express request

## HUMAN

- [] better-auth jwt 방식으로 변경
- [] 랜딩 페이지 진입 시 token이 유효하다면 home으로 이동해야 함
- [] 태그 관리 UI 미구현 — `useCreateTag`, `useDeleteTag` 훅은 있으나 태그를 생성/삭제하는 페이지 없음
- [] `tins.ts`, `tags.ts` 라우트 핸들러 `Request<{}, {}, Body>` 패턴 재검토 — `{}` 사용이 적절한지 아티클 참고 후 판단 (llms.txt Express request type 링크)

- [] 에러 핸들링 + 토스트

- [] 배포 이후 graphql이나 trpc로 shared 타입 문제 생각하기

---

## CRITICAL

- [ ] **[C-1]** `BETTER_AUTH_SECRET` 교체 — 실제 값이 `.env`에 존재, 배포 전 반드시 rotate
- [x] **[C-2]** `apps/frontend/src/app/login/page.tsx:45` — `?next=` 파라미터 오픈 리다이렉트 수정 (`startsWith('/')` 검증 추가)

---

## HIGH

- [ ] **[H-1]** `apps/backend/src/index.ts` — `/api/v1/*` rate limiting 추가 (현재 `/api/auth/*`에만 적용)
- [x] **[H-2]** `packages/shared/src/schemas/tin.ts` — `feeling` 필드 `max(2000)` 제한 추가
- [x] **[H-3]** `packages/shared/src/schemas/user.ts` — `password` 필드 `max(128)` 제한 추가 (bcrypt 72바이트 truncation 이슈)
- [x] **[H-4]** `apps/backend/src/routes/tins.ts:110` — `formatTin(tin: any)` → Prisma `TinGetPayload` 타입으로 교체 (이미 완료)
- [x] **[H-5]** Express 5 사용으로 async 오류 자동 전파 — 스킵
- [x] **[H-6]** 태그 코드 제거로 해당 없음 — 스킵
- [x] **[H-7]** login / register / new / edit 페이지 전체 — `<label htmlFor>` 연결 (현재 스크린리더 접근 불가)

---

## MEDIUM

- [ ] **[M-1]** `apps/backend/prisma/seed.ts` — `password123` 하드코딩 제거, `process.env.SEED_PASSWORD`로 대체
- [x] **[M-2]** `apps/backend/prisma/seed.ts` — `status` 필드 참조 제거 (migration 2에서 컬럼 삭제됨, 현재 `pnpm db:seed` 실패)
- [ ] **[M-3]** `apps/backend/src/routes/tins.ts` — `GET /api/v1/tins` 페이지네이션 또는 `take` limit 추가
- [ ] **[M-4]** `apps/backend/src/routes/tins.ts:14` — `?type=` 쿼리 파라미터 런타임 검증 추가 (현재 TypeScript cast만 사용)
- [ ] **[M-5]** `apps/frontend/src/lib/api.ts:15` — `window.location.href` → SSR 안전한 방식으로 교체, `'use client'` 마킹
- [ ] **[M-6]** `docker-compose.yml` — DB 자격증명 하드코딩 제거, env 파일로 분리
- [ ] **[M-7]** `apps/frontend/src/app/home/new/page.tsx`, `edit/page.tsx` — `mutateAsync` 오류 처리 및 사용자 에러 메시지 추가 (토스트 도입 후 처리)

---

## LOW

- [ ] **[L-1]** `apps/frontend/src/app/home/new/page.tsx`, `edit/page.tsx` — `toggleTag` 내 state updater에서 `setValue` side effect 분리 (React Strict Mode 이슈)
- [x] **[L-2]** `apps/frontend/src/app/providers.tsx` — `HealthCheck` 컴포넌트 제거 또는 인증된 레이아웃 안으로 이동
- [x] **[L-3]** `apps/backend/src/lib/env.ts` — `console.error` → pino 일관성 맞추기
- [x] **[L-4]** `todo.md` — 제거된 `useArchiveTin` / `useRestoreTin` 항목 정리
- [ ] **[L-5]** `apps/backend/prisma/migrations/20260326133409_2/` — 미커밋 마이그레이션 (`status` 컬럼 제거) git에 커밋 필요

---

## 테스트 개선

- [ ] **[T-1]** `apps/backend/src/lib/env.ts` — `parseEnv(env)` 함수로 분리하여 Vitest 테스트 가능하도록 리팩터 (현재 모듈 로드 시 즉시 실행 → 테스트 불가)
- [ ] **[T-2]** `apps/backend/src/lib/env.test.ts` — `parseEnv` 단위 테스트 작성 (필수 필드 누락, `BETTER_AUTH_SECRET` 32자 미만, 잘못된 URL 형식 등)

---

## CI / GitHub Actions

- [ ] **[CI-1]** `.github/workflows/ci.yml` 생성 — PR/push 시 백엔드 Vitest + 프론트엔드 Vitest 자동 실행
- [ ] **[CI-2]** CI에 E2E(Playwright) 단계 추가 — Docker Compose로 PostgreSQL 띄운 후 실행
- [ ] **[CI-3]** CI에 TypeScript 타입 체크 단계 추가 (`pnpm tsc --noEmit`)

---

## 테스팅 개선

- [] 깃헙 워크플로우에 테스트 통과하지 않으면 올릴 수 없도록

- [ ] **[E-1]** `apps/frontend/e2e/tin-crud.spec.ts` — `TEST_USER` 이메일 `Date.now()` 파일 상단 호출 문제 수정 (모든 테스트가 동일 이메일 사용 → 2번째 테스트부터 회원가입 실패)
- [ ] **[E-2]** 회원가입 헬퍼 공용화 — `auth.spec.ts`와 `tin-crud.spec.ts`의 중복 제거, `e2e/fixtures/auth.ts`로 분리
- [ ] **[E-3]** `beforeEach` 매번 회원가입 → Playwright storage state 방식으로 전환 (로그인 상태 재사용)
- [ ] **[E-4]** E2E 위치 검토 — `apps/frontend/e2e/` vs 모노레포 루트 `e2e/` (현재는 `webServer` 설정 의존으로 프론트 안에 위치)
