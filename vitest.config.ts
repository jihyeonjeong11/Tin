import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['apps/frontend/vitest.config.mts', 'apps/backend/vitest.config.ts'],
  },
})
