# REVIEW_TODO.md

코드리뷰 및 개선 작업 목록. 완료 시 `[x]`로 표시.

블로그: tsup 이슈, express request

## Template

- 기술적 배움 - 모노레포, 레일웨이, tdd
- 에이전틱 코딩 경험
- 모노레포 구조 템플릿

## HUMAN

- [] better-auth jwt 방식으로 변경 - ai가 이해 못함 내가 직접 고쳐야 함 - mvp 제외
- [x] 랜딩 페이지 진입 시 token이 유효하다면 home으로 이동해야 함
- [x] 회원 탈퇴 기능 구현 — 백엔드 삭제 엔드포인트 + 홈 레이아웃 UI (로그아웃 버튼 옆)
- [] 약관/개인정보처리방침 — 공지·이메일 고지 조항 주석 해제 (공지 또는 이메일 기능 구현 후)
- [] 개인정보처리방침에도 탈퇴 시 데이터 삭제 조항 확인 — 탈퇴 기능 구현 후 내용 재검토

- [] `tins.ts`, `tags.ts` 라우트 핸들러 `Request<{}, {}, Body>` 패턴 재검토 — `{}` 사용이 적절한지 아티클 참고 후 판단 (llms.txt Express request type 링크) - mvp 제외

- [x] 에러 핸들링 + 토스트
- [] 모든 엣지케이스 정리 — 오프라인/타임아웃/네트워크 에러 등 미확인 케이스 시나리오별 재검토

- [] 배포 이후 graphql이나 trpc로 shared 타입 문제 생각하기 - mvp 제외
- [] 태그 관리 UI 미구현 — `useCreateTag`, `useDeleteTag` 훅은 있으나 태그를 생성/삭제하는 페이지 없음 - 태그 안하는걸로 지금은

---

## CRITICAL

- [ ] **[C-1]** `.env` 전체 재검토 — 배포 전 실제 값 확인 및 `BETTER_AUTH_SECRET` 포함 필요 시 rotate
- [x] **[C-2]** `apps/frontend/src/app/login/page.tsx:45` — `?next=` 파라미터 오픈 리다이렉트 수정 (`startsWith('/')` 검증 추가)

---

## HIGH

- [x] **[H-1]** `apps/backend/src/index.ts` — `/api/v1/*` rate limiting 추가 (`app.use(limiter)`로 전체 적용 확인)
- [x] **[H-2]** `packages/shared/src/schemas/tin.ts` — `feeling` 필드 `max(2000)` 제한 추가
- [x] **[H-3]** `packages/shared/src/schemas/user.ts` — `password` 필드 `max(128)` 제한 추가 (bcrypt 72바이트 truncation 이슈)
- [x] **[H-4]** `apps/backend/src/routes/tins.ts:110` — `formatTin(tin: any)` → Prisma `TinGetPayload` 타입으로 교체 (이미 완료)
- [x] **[H-5]** Express 5 사용으로 async 오류 자동 전파 — 스킵
- [x] **[H-6]** 태그 코드 제거로 해당 없음 — 스킵
- [x] **[H-7]** login / register / new / edit 페이지 전체 — `<label htmlFor>` 연결 (현재 스크린리더 접근 불가)

---

## MEDIUM

- [ ] **[M-1]** `apps/backend/prisma/seed.ts` — `password123` 하드코딩 제거, `process.env.SEED_PASSWORD`로 대체 - 하드코딩으로 괜찮음
- [x] **[M-2]** `apps/backend/prisma/seed.ts` — `status` 필드 참조 제거 (migration 2에서 컬럼 삭제됨, 현재 `pnpm db:seed` 실패)
- [ ] **[M-3]** `apps/backend/src/routes/tins.ts` — `GET /api/v1/tins` 페이지네이션 또는 `take` limit 추가 - mvp 제외
- [ ] **[M-4]** `apps/backend/src/routes/tins.ts:14` — `?type=` 쿼리 파라미터 런타임 검증 추가 (현재 TypeScript cast만 사용) - mvp 제외
- [ ] **[M-6]** `docker-compose.yml` — DB 자격증명 하드코딩 제거, env 파일로 분리
- [ ] **[M-7]** 에러 메시지 전체 재검토 — 사용자에게 노출되는 메시지 한국어/자연스러운 문구로 통일 (예: "Invalid email" 등 raw 메시지 노출 케이스 포함)

---

## LOW

- [ ] **[L-1]** `apps/frontend/src/app/home/new/page.tsx`, `edit/page.tsx` — `toggleTag` 내 state updater에서 `setValue` side effect 분리 (React Strict Mode 이슈)
- [x] **[L-2]** `apps/frontend/src/app/providers.tsx` — `HealthCheck` 컴포넌트 제거 또는 인증된 레이아웃 안으로 이동
- [x] **[L-3]** `apps/backend/src/lib/env.ts` — `console.error` → pino 일관성 맞추기
- [x] **[L-4]** `todo.md` — 제거된 `useArchiveTin` / `useRestoreTin` 항목 정리
- [x] **[L-5]** `apps/backend/prisma/migrations/20260326133409_2/` — 미커밋 마이그레이션 (`status` 컬럼 제거) git에 커밋 필요

---

## 테스트 개선

- [ ] **[T-1]** `apps/backend/src/lib/env.ts` — `parseEnv(env)` 함수로 분리하여 Vitest 테스트 가능하도록 리팩터 (현재 모듈 로드 시 즉시 실행 → 테스트 불가)
- [ ] **[T-2]** `apps/backend/src/lib/env.test.ts` — `parseEnv` 단위 테스트 작성 (필수 필드 누락, `BETTER_AUTH_SECRET` 32자 미만, 잘못된 URL 형식 등)
- [ ] **[T-3]** `apps/backend/src/tests/` — `requireAuth` 미들웨어 단위 테스트 (비로그인 → 401, 유효 세션 → next() 호출)
- [ ] **[T-4]** `apps/backend/src/tests/` — 인증 라우트 테스트 (회원가입 성공/이메일 중복, 로그인 성공/잘못된 비밀번호)
- [ ] **[T-5]** `apps/frontend/src/tests/` — `theme-toggle.tsx:14` Branch 커버리지 누락 (system 테마 분기 미테스트)
- [ ] **[T-6]** `apps/frontend/src/tests/` — `tin-list-skeleton.test.tsx` unused `container` 변수 경고 수정
- [ ] **[T-7]** 커버리지 설정 공식화 — `vitest.config.ts`에 `coverage` 블록 추가 및 threshold 설정 (백엔드 90%, 프론트 95% 기준)

---

## CI / GitHub Actions - mvp 이후

- [ ] **[CI-1]** `.github/workflows/ci.yml` 생성 — PR/push 시 백엔드 Vitest + 프론트엔드 Vitest 자동 실행
- [ ] **[CI-2]** CI에 E2E(Playwright) 단계 추가 — Docker Compose로 PostgreSQL 띄운 후 실행
- [ ] **[CI-3]** CI에 TypeScript 타입 체크 단계 추가 (`pnpm tsc --noEmit`)

---

## 테스팅 개선
