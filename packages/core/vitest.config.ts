import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@unisane/ui',
    root: __dirname,
    environment: 'node',
    globals: true,
    include: ['tests/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.tsx'],
    passWithNoTests: true,
  },
});
