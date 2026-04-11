import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { SHARED_VITEST_COVERAGE_THRESHOLDS } from '../../../scripts/_lib/vitest-coverage';

export default defineConfig({
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    name: '@unisane/ui',
    root: __dirname,
    environment: 'node',
    globals: true,
    include: ['tests/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.tsx'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: SHARED_VITEST_COVERAGE_THRESHOLDS,
      exclude: ['**/dist/**', '**/node_modules/**', '**/.turbo/**'],
    },
  },
});
