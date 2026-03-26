# Tin

> 살아가면서 잊었던 것, 버렸던 것을 기록하고 반성하는 마음 챙김 노트 앱

## 기술 스택

|          | 기술                                                               |
| -------- | ------------------------------------------------------------------ |
| Frontend | Next.js 15, TailwindCSS v4, shadcn/ui, TanStack Query, Better-Auth |
| Backend  | Express, Prisma, PostgreSQL, Better-Auth                           |
| Shared   | Zod 스키마                                                         |
| Infra    | Docker Compose, Oracle Cloud (예정)                                |

## 시작하기

### 사전 요구사항

- Node.js 22+
- pnpm 9+
- Docker Desktop

### 설치 및 실행

```bash
# 1. 의존성 설치 (shared 빌드 + prisma generate 자동 실행)
pnpm install

# 2. 환경변수 설정
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
# .env의 BETTER_AUTH_SECRET을 랜덤값으로 변경

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
pnpm dev          # 프론트 + 백엔드 동시 실행
pnpm build        # 전체 빌드
pnpm lint         # ESLint
pnpm typecheck    # TypeScript 검사
pnpm test         # 유닛 테스트
pnpm test:e2e     # E2E 테스트

pnpm docker:up    # PostgreSQL 실행
pnpm docker:down  # 컨테이너 종료
pnpm db:migrate   # DB 마이그레이션
pnpm db:studio    # Prisma Studio
```

## 프로젝트 구조

```
tin/
├── apps/
│   ├── frontend/    # Next.js 15 App Router
│   └── backend/     # Express API
├── packages/
│   └── shared/      # 공통 Zod 스키마 및 타입
└── docker-compose.yml
```
