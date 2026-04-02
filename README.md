이 SASS 템플릿 프로젝트는 Monorepo(Express + Nextjs)를 Agentic Coding을 통해 실제 배포까지 진행하기 위한 프로젝트입니다.

## Known Issues

### 인증 전략 — 두 가지 케이스

Railway 기본 URL 환경에서는 프론트와 백엔드가 서로 다른 도메인(`*.up.railway.app`)에 배포되어 크로스 도메인 쿠키가 차단됩니다. ([Railway issue](https://station.railway.com/questions/cross-domain-cookies-on-preview-65c2b01e))

이 템플릿은 두 케이스를 모두 지원하며, `apps/frontend/src/lib/api.ts`와 `auth-client.ts`에 전환 방법이 주석으로 안내되어 있습니다.

| 환경                    | 인증 방식                       | 변경 필요 여부                |
| ----------------------- | ------------------------------- | ----------------------------- |
| 커스텀 도메인 (권장)    | better-auth httpOnly 세션 쿠키  | `fetchOptions.auth` 설정 제거 |
| Railway 기본 URL (현재) | Bearer 토큰 → localStorage 저장 | 그대로 사용                   |

> **보안 참고:** localStorage 방식은 XSS에 취약합니다. 프로덕션에서는 커스텀 도메인 + 쿠키 방식을 사용하세요.

# Tin

> 살아가면서 흘려보낸 것, 돌아보고 싶은 것을 기록하는 마음 챙김 노트 앱

[스크린샷 추가]

## 기술 스택

|          | 기술                                                                            |
| -------- | ------------------------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, TailwindCSS v4, shadcn/ui, TanStack Query v5, Better-Auth |
| Backend  | Express 5, Prisma, PostgreSQL 16, Better-Auth, pino, helmet, express-rate-limit |
| 공유     | Zod 스키마 + 타입 (`@tin/shared`, tsup으로 cjs/esm/dts 빌드)                    |
| 테스트   | Vitest (유닛), Playwright (E2E)                                                 |
| 인프라   | Docker Compose, Railway                                                         |

## Features

- Better auth 인증
- Better auth 어드민
- ShadCN
- Tailwind CSS
- Prisma ORM
- Light / Dark mode

## ENV

### 로컬 개발

| 파일                       | 용도                           |
| -------------------------- | ------------------------------ |
| `.env`                     | Docker Compose PostgreSQL 설정 |
| `apps/backend/.env`        | 백엔드 서버 설정               |
| `apps/frontend/.env.local` | 프론트엔드 설정                |

### Railway 배포

Railway는 `.env` 파일을 읽지 않습니다. Variables 탭에서 직접 설정하거나 RAW Editor에 붙여넣기 하세요.

```bash
# Railway CLI 사용 시
railway variables set --from apps/backend/.env
```

주요 환경변수:

**백엔드** (`apps/backend/.env`)

| 변수                 | 설명                                          |
| -------------------- | --------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL 연결 문자열 (Railway DB 자동 주입) |
| `BETTER_AUTH_SECRET` | 32자 이상 랜덤 문자열                         |
| `BETTER_AUTH_URL`    | 백엔드 배포 URL                               |
| `FRONTEND_URL`       | 프론트엔드 배포 URL                           |
| `ADMIN_EMAIL`        | 어드민 계정 이메일 (`db:seed` 실행 시 생성)   |
| `ADMIN_PASSWORD`     | 어드민 계정 비밀번호                          |

**프론트엔드** (`apps/frontend/.env.local`)

| 변수                  | 설명                               |
| --------------------- | ---------------------------------- |
| `BACKEND_URL`         | 백엔드 URL (SSR 서버사이드 요청)   |
| `NEXT_PUBLIC_API_URL` | 백엔드 URL (클라이언트사이드 요청) |

### 어드민 계정 생성 및 접근

```bash
# 환경변수 설정 후 seed 실행
pnpm db:seed
```

어드민 페이지: `{서비스 URL}/admin` (어드민 role 계정으로 로그인 시에만 접근 가능)

## 시작하기

### 사전 요구사항

- Node.js 22
- pnpm 9+
- Docker Desktop

### 설치 및 실행

````bash
# 1. 의존성 설치 (shared 빌드 + prisma generate 자동 실행)
pnpm install

# 2. 환경변수 설정
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
# .env의 POSTGRES_PASSWORD, apps/backend/.env의 BETTER_AUTH_SECRET, ADMIN_PASSWORD를 변경

# 3. DB 실행
pnpm docker:up

# 4. DB 마이그레이션
pnpm db:migrate

# 5. 개발 서버 실행
pnpm dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Health check: http://localhost:4000/health

## 주요 명령어

```bash
# 개발
pnpm dev              # 프론트 + 백엔드 동시 실행
pnpm dev:fe           # 프론트엔드만
pnpm dev:be           # 백엔드만

# 빌드 / 검사
pnpm build            # 전체 빌드
pnpm lint             # ESLint
pnpm typecheck        # TypeScript 검사

# 테스트
pnpm test:all         # 전체 유닛 테스트 (Vitest)
pnpm test:fe          # 프론트엔드 유닛 테스트
pnpm test:be          # 백엔드 유닛 테스트
pnpm test:e2e         # E2E 테스트 (Playwright)

# DB
pnpm docker:up        # PostgreSQL 컨테이너 실행
pnpm docker:down      # 컨테이너 종료
pnpm docker:logs      # 컨테이너 로그 확인
pnpm db:migrate       # 마이그레이션 실행
pnpm db:push          # 스키마를 DB에 직접 반영 (마이그레이션 파일 없이)
pnpm db:studio        # Prisma Studio (DB GUI)
pnpm db:seed          # 개발용 더미 데이터 삽입
````

## 프로젝트 구조

```
tin/
├── apps/
│   ├── frontend/            # Next.js 16 App Router
│   │   ├── src/app/         # 페이지 (/, /login, /register, /home/*)
│   │   ├── src/components/  # UI 컴포넌트
│   │   ├── src/hooks/       # TanStack Query 훅 (use-tins)
│   │   ├── src/lib/         # axios 인스턴스, auth 클라이언트 등
│   │   └── e2e/             # Playwright E2E 시나리오
│   └── backend/             # Express 5 API
│       └── src/
│           ├── routes/      # tins, tags, me 라우터 (+ 유닛 테스트)
│           ├── middleware/  # requireAuth, validate
│           └── lib/         # prisma, auth, logger, env
├── packages/
│   └── shared/              # 공통 Zod 스키마 및 타입
└── docker-compose.yml
```

## API

| Method | Endpoint                 | 설명             |
| ------ | ------------------------ | ---------------- |
| POST   | /api/auth/\*             | Better-Auth 인증 |
| GET    | /api/v1/tins             | Tin 목록 조회    |
| POST   | /api/v1/tins             | Tin 생성         |
| GET    | /api/v1/tins/:id         | Tin 상세 조회    |
| PATCH  | /api/v1/tins/:id         | Tin 수정         |
| PATCH  | /api/v1/tins/:id/archive | Tin 아카이브     |
| PATCH  | /api/v1/tins/:id/restore | 아카이브 복구    |
| DELETE | /api/v1/tins/:id         | Tin 삭제         |
| GET    | /api/v1/tags             | 태그 목록        |
| POST   | /api/v1/tags             | 태그 생성        |
| DELETE | /api/v1/tags/:id         | 태그 삭제        |
| GET    | /health                  | 헬스체크         |

## 데이터 모델

```
User ─┬─< Tin ─< TinTag >─ Tag
      └─< Tag
```

- **Tin** — 기록 본체. `type`: `letting_go`(놓아버림) | `reflection`(돌아봄), `status`: `pending`(보관 중) | `archived`(흘려보냄)
- **Tag** — 유저별 커스텀 태그. 이름은 유저 내 unique
- **인증** — Better-Auth (email + password). 세션은 PostgreSQL에 저장
