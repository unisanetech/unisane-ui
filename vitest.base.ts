import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { conditions: ['node', 'import'] },
  test: {
    name: 'unisane-ui',
    globals: true,
    // UI packages typically need 'happy-dom' or 'jsdom'
    passWithNoTests: true,
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['**/dist/**', '**/node_modules/**', '**/.turbo/**'],
    },
    exclude: ['**/dist/**', '**/node_modules/**', '**/.turbo/**'],
  },
});
