FROM node:20-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
ENV DOCKER_BUILD=true

# ── deps (layer cache) ────────────────────────────────────────────────────────
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma
RUN pnpm install --frozen-lockfile --ignore-scripts

# ── source ────────────────────────────────────────────────────────────────────
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Generate Prisma client and build
RUN pnpm --filter @tin/backend db:generate
RUN pnpm --filter @tin/backend build

EXPOSE 4000

CMD ["node", "apps/backend/dist/index.js"]
