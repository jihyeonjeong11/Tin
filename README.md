이 SASS 템플릿 프로젝트는 Monorepo(Express + Nextjs)를 Agentic Coding을 통해 실제 배포까지 진행하기 위한 프로젝트입니다.

## Known Issues

- Railway로 배포중이며, 현재 커스텀 도메인을 사용하지 않아 [Railway issue](https://station.railway.com/questions/cross-domain-cookies-on-preview-65c2b01e) 이슈로 인해 인증 토큰을 localStorage에 담아 사용하는 보안 리스크가 있습니다.

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
- ShadCN
- Tailwind CSS
- Prisma ORM
- Light / Dark mode

## ENV

[[추가]]

## 시작하기

### 사전 요구사항

- Node.js 22
- pnpm 9+
- Docker Desktop

### 설치 및 실행

```bash
# 1. 의존성 설치 (shared 빌드 + prisma generate 자동 실행)
pnpm install

# 2. 환경변수 설정
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
# apps/backend/.env의 BETTER_AUTH_SECRET을 랜덤값으로 변경

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
pnpm db:studio        # Prisma Studio (DB GUI)
pnpm db:seed          # 개발용 더미 데이터 삽입
```

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
