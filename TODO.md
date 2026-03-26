# Tin — TODO

> 항목 추가: `- [ ] 내용` / 완료: `- [x] 내용` / 삭제: 줄 제거

---

## ⚙️ Phase 0 — 프로젝트 셋업

### 모노레포

- [x] pnpm 워크스페이스 구성 (`apps/`, `packages/`)
- [x] `tsconfig.base.json` 공통 TypeScript 설정
- [x] ESLint 설정 (typescript-eslint)
- [x] Prettier 설정
- [x] Husky + lint-staged (pre-commit)
- [x] `.editorconfig`
- [x] `.gitignore`
- [x] `postinstall` 자동화 (shared 빌드 + prisma generate)
- [x] 루트 스크립트 정의 (dev, build, lint, typecheck, test, db:\*)

### 테스트 인프라

- [x] Vitest 설정 — 백엔드 (node 환경)
- [x] Vitest 설정 — 프론트엔드 (jsdom + @testing-library/react)
- [x] Playwright 설정 — E2E
- [ ] 백엔드 테스트 파일 작성 (routes: tins, tags)
- [ ] 프론트엔드 컴포넌트 테스트 파일 작성
- [ ] E2E 시나리오 작성 (로그인 → tin 작성 → 아카이브)

### 백엔드 셋업

- [x] Express + TypeScript 초기화
- [x] pino + pino-pretty 로거
- [x] dotenv 환경변수 로딩
- [x] CORS 설정
- [x] Better-Auth 서버 설정
- [x] Prisma 설치 및 client 설정
- [x] `.env.example` 작성
- [ ] `.env` 파일 생성 (BETTER_AUTH_SECRET 랜덤값 포함)

### 프론트엔드 셋업

- [x] Next.js 15 App Router + TypeScript 초기화
- [x] TailwindCSS v4 설치
- [x] shadcn/ui 초기화
- [x] TanStack Query 설정 (QueryClientProvider)
- [x] axios 인스턴스 + 401 인터셉터
- [x] Better-Auth 클라이언트 초기화
- [x] 컬러 스킴 — Quiet Paper 팔레트 (globals.css, 라이트/다크)
- [x] `.env.example` 작성
- [ ] `.env.local` 파일 생성

### Shared 패키지

- [x] tsup 빌드 설정 (cjs + esm + dts)
- [x] Zod 스키마 — `RegisterSchema`, `LoginSchema`
- [x] Zod 스키마 — `CreateTinSchema`, `UpdateTinSchema`, `TinResponseSchema`
- [x] Zod 스키마 — `CreateTagSchema`, `TagResponseSchema`
- [x] 공통 타입 — `TinStatus`, `TinType`
- [ ] `RegisterSchema`에 `name` 필드 추가

### 디자인 시스템

- [x] 방향 확정 — Quiet Paper
- [x] 컬러 토큰 (라이트/다크 모드)
- [x] 타이포그래피 — Lora (serif) + Inter (sans)
- [x] `globals.css` Quiet Paper 팔레트 적용
- [x] Tin 상태별 유틸리티 클래스 (tin-letting-go / tin-reflection / tin-pending / tin-archived)
- [ ] shadcn 컴포넌트 커스터마이즈 (Button, Input, Card, Badge)
- [ ] 다크모드 토글

### DB 스키마

- [x] Prisma 스키마 작성 (User, Tin, Tag, TinTag, Session, Account)
- [x] `TinStatus` enum (pending / archived)
- [x] `TinType` enum (letting_go / reflection)
- [x] Docker Compose — PostgreSQL 16
- [ ] Prisma User 모델 Better-Auth 스펙 맞춤 (name, emailVerified, image, updatedAt / passwordHash 제거)
- [ ] Redis docker-compose에 추가
- [ ] DB 마이그레이션 최초 실행 (`pnpm docker:up && pnpm db:migrate`)

---

## 🔴 Phase 1 — 안정화

- [ ] Express 글로벌 에러 핸들러 추가
- [ ] 태그 중복 생성 시 409 처리 (Prisma unique constraint)

---

## 🟡 Phase 2 — 기능 구현

### 인증

- [ ] 회원가입 페이지 (`/register`)
- [ ] 로그인 페이지 (`/login`)
- [ ] 인증 상태에 따른 라우트 보호
- [ ] 로그아웃 UI

### API 레이어 (TanStack Query 훅)

- [ ] `useTins` — 목록 조회
- [ ] `useCreateTin` — 생성
- [ ] `useUpdateTin` — 수정
- [ ] `useArchiveTin` — 아카이브
- [ ] `useDeleteTin` — 삭제
- [ ] `useTags` — 태그 목록
- [ ] `useCreateTag` — 태그 생성

### Tin CRUD UI

- [ ] 홈/목록 페이지 (상태 필터: pending / archived)
- [ ] Tin 카드 컴포넌트
- [ ] Tin 작성 폼 (제목, 날짜, 감정, 타입, 태그)
- [ ] Tin 수정
- [ ] Tin 아카이브
- [ ] Tin 삭제

### 태그

- [ ] 태그 생성/삭제 UI
- [ ] Tin 폼에서 태그 선택/연결

---

## 🚀 배포 (후순위)

- [ ] Oracle Cloud 인프라 셋업
- [ ] 프로덕션 환경변수 정리
- [ ] Docker 프로덕션 이미지 (멀티스테이지 빌드)
- [ ] CI/CD (GitHub Actions)
- [ ] 도메인 + HTTPS 설정
