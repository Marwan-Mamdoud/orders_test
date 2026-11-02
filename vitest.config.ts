import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    // `npm run test:report` writes an HTML report to html/index.html
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      include: ['src/**/*.{ts,js}'],
      exclude: ['src/**/*.d.ts', 'src/seed.ts'],
      reportsDirectory: './coverage',
      all: true,
      clean: true,
      skipFull: false,
      reportOnFailure: true,
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
