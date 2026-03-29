import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: '@tin/backend',
    environment: 'node',
    globals: true,
    include: ['src/tests/**/*.test.ts'],
  },
})
