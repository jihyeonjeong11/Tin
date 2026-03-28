FROM node:20-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# ── deps (layer cache) ────────────────────────────────────────────────────────
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

# ── source ────────────────────────────────────────────────────────────────────
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Generate Prisma client
RUN pnpm --filter @tin/backend db:generate

EXPOSE 4000

# tsc has noEmit:true (moduleResolution: bundler) — tsx used as runtime
CMD ["node_modules/.bin/tsx", "apps/backend/src/index.ts"]
