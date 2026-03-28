import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  noExternal: ['@tin/shared'],
  clean: true,
  splitting: false,
})
