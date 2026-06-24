import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Minimal env so config validation passes without a real .env in CI/tests.
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://tripu:tripu@localhost:5432/tripu_test?schema=public',
      JWT_SECRET: 'test-secret-test-secret-1234567890',
    },
    include: ['src/**/*.{test,spec}.ts'],
  },
});
