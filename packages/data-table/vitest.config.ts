import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['node', 'import'],
  },
  test: {
    name: 'data-table',
    root: __dirname,
    globals: true,
    environment: 'happy-dom', // MUST use happy-dom for React/DOM tests
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'tests/**',
        'src/**/index.ts',
        'src/types/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/.turbo/**',
      ],
    },
    exclude: ['**/dist/**', '**/node_modules/**', '**/.turbo/**'],
  },
});
