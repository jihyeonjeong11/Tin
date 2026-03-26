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
- [x] README.md 작성 (프로젝트 소개, 실행 방법)

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
- [x] `.env` 파일 생성 (BETTER_AUTH_SECRET 랜덤값 포함)
- [x] 환경변수 런타임 Zod 검증 (서버 시작 시 필수 env 누락 체크)
- [x] `helmet` 설치 (Express 보안 헤더 — XSS, clickjacking 등)
- [x] Rate limiting 설치 (`express-rate-limit` — 로그인 brute force 방어)
- [x] Request body size limit 설정 (`express.json({ limit: '10kb' })`)
- [x] API 버전 prefix 적용 (`/api/v1/`)
- [x] DB 커넥션 풀 크기 명시 (Prisma `connection_limit`)
- [ ] Seed 스크립트 작성 (개발용 더미 데이터)

### 프론트엔드 셋업

- [x] Next.js 15 App Router + TypeScript 초기화
- [x] TailwindCSS v4 설치
- [x] shadcn/ui 초기화
- [x] TanStack Query 설정 (QueryClientProvider)
- [x] axios 인스턴스 + 401 인터셉터
- [x] Better-Auth 클라이언트 초기화
- [x] 컬러 스킴 — Quiet Paper 팔레트 (globals.css, 라이트/다크)
- [x] `.env.example` 작성
- [x] `.env.local` 파일 생성
- [x] 에러 바운더리 (React 렌더링 에러 처리)
- [x] SEO / OG 태그 설정 (layout.tsx metadata 확장)
- [ ] Bundle analyzer 설정 (`@next/bundle-analyzer`)

### Shared 패키지

- [x] tsup 빌드 설정 (cjs + esm + dts)
- [x] Zod 스키마 — `RegisterSchema`, `LoginSchema`
- [x] Zod 스키마 — `CreateTinSchema`, `UpdateTinSchema`, `TinResponseSchema`
- [x] Zod 스키마 — `CreateTagSchema`, `TagResponseSchema`
- [x] 공통 타입 — `TinStatus`, `TinType`
- [x] `RegisterSchema`에 `name` 필드 추가

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
- [x] Prisma User 모델 Better-Auth 스펙 맞춤 (name, emailVerified, image, updatedAt / passwordHash 제거)
- [x] Redis docker-compose에 추가
- [x] DB 인덱스 추가 (`tins.userId`, `tins.status`, `tags.userId`)
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

### Oracle Cloud VM 셋업 (1회)

- [ ] Ampere A1 인스턴스 생성 (Always Free — 4 OCPU, 24GB RAM)
- [ ] VM에 Docker + Docker Compose 설치
- [ ] 방화벽 규칙 설정 (포트 80, 443, 22)
- [ ] GitHub Actions용 SSH 키 생성 및 등록
- [ ] 프로덕션용 `docker-compose.prod.yml` 작성 (PostgreSQL + Redis + backend + frontend)
- [ ] 프로덕션 환경변수 정리 (`.env.prod` — VM에만 보관)

### Docker 이미지

- [ ] 백엔드 `Dockerfile` 작성 (멀티스테이지 빌드)
- [ ] 프론트엔드 `Dockerfile` 작성 (멀티스테이지 빌드)
- [ ] Graceful shutdown 처리 (SIGTERM — 요청 마무리 후 DB 연결 종료)

### GitHub Actions CI/CD

- [ ] CI 워크플로우 작성 (`pnpm lint` + `pnpm typecheck` + `pnpm test`)
- [ ] CD 워크플로우 작성
  - Docker 이미지 빌드 → ghcr.io push
  - Oracle VM SSH 접속 → `docker compose pull && docker compose up -d`
- [ ] GitHub Secrets 등록 (SSH 키, VM IP, ghcr.io 토큰)

### 도메인 / HTTPS

- [ ] 도메인 연결 (Oracle VM IP)
- [ ] HTTPS 설정 (Let's Encrypt + nginx reverse proxy)
